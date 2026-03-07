# Bardo API – Documentação

API GraphQL em Go para o projeto Bardo: usuários, mundos e backstories.

## Índice

- [Visão geral](#visão-geral)
- [Como rodar](#como-rodar)
- [Arquitetura](#arquitetura)
- [Autenticação](#autenticação)
- [Schema GraphQL](#schema-graphql)
- [Banco de dados](#banco-de-dados)
- [Referência das operações](#referência-das-operações)

---

## Visão geral

- **Stack:** Go, GraphQL (gqlgen), PostgreSQL, JWT.
- **Entidades:** usuário (login/senha), mundo (world), backstory (história de personagem vinculada a um mundo).
- **Fluxo:** o usuário se registra ou faz login, recebe um token JWT; com o token pode criar/editar mundos e salvar backstories nesses mundos.

---

## Como rodar

### Com Docker

```bash
docker compose up -d
```

- **API:** http://localhost:8080 (Playground em `/`, endpoint GraphQL em `/query`)
- **PostgreSQL:** porta 5432
- **Frontend (Nuxt):** http://localhost:3000

Para reconstruir a API após mudanças no código:

```bash
docker compose up -d --build api
```

### Variáveis de ambiente (API)

| Variável     | Descrição                          | Exemplo (local) |
|-------------|-------------------------------------|-----------------|
| DB_HOST     | Host do PostgreSQL                  | localhost / db  |
| DB_PORT     | Porta do PostgreSQL                 | 5432            |
| DB_USER     | Usuário do banco                    | user            |
| DB_PASSWORD | Senha do banco                      | password        |
| DB_NAME     | Nome do banco                       | bardo_db        |
| JWT_SECRET  | Chave para assinar/validar o JWT    | (string segura) |
| PORT        | Porta HTTP da API (opcional)        | 8080            |

Use `.env` na raiz do projeto ou defina no `docker-compose` (ex.: `JWT_SECRET`).

---

## Arquitetura

### Fluxo de uma requisição

```
[Cliente] --> |POST /query + Authorization: Bearer <token>| [API]
[API]     --> [authMiddleware]
[authMiddleware] --> |token válido?| coloca userID no context
[authMiddleware] --> [Handler GraphQL]
[Handler GraphQL] --> [Resolver] (ex: CreateWorld, SaveBackstory)
[Resolver] --> userIDFromContext(ctx) --> usuário logado?
[Resolver] --> r.DB (PostgreSQL) --> resposta
```

Em resumo:

1. **HTTP** — A requisição chega em `/query`.
2. **Middleware de auth** (`server.go`) — Lê `Authorization: Bearer <token>`. Se o JWT for válido, extrai o `sub` (ID do usuário) e coloca no **context** com a chave `UserIDKey`. Se não houver token ou for inválido, o context segue sem usuário.
3. **Handler GraphQL** — Processa a operação e chama o resolver correspondente.
4. **Resolvers** — Usam `userIDFromContext(ctx)` para saber se há usuário logado. Operações que exigem login retornam `errUnauthorized` se não houver. Acessam o banco via `r.DB` e helpers em `helpers.go` (ex.: `getWorldByID`).

### Estrutura do código (API)

```
api/
├── server.go              # Entrada HTTP, conexão DB, middleware de auth, rota /query
├── graph/
│   ├── schema.graphqls    # Schema GraphQL (tipos, queries, mutations)
│   ├── schema.resolvers.go # Implementação dos resolvers (regras de negócio)
│   ├── generated.go      # Código gerado pelo gqlgen (não editar)
│   ├── model/            # Structs Go geradas a partir do schema
│   ├── resolver.go        # Struct Resolver { DB, JWTSecret }
│   ├── context.go         # Chave de context para userID (UserIDKey)
│   └── helpers.go         # signToken, userIDFromContext, getWorldByID, errUnauthorized
└── db_init/
    └── init.sql           # Criação das tabelas (users, worlds, backstories)
```

- **Resolver root:** `graph.Resolver` contém `DB` e `JWTSecret`; é injetado em todos os resolvers (via `mutationResolver` e `queryResolver` que embutem `*Resolver`).
- **Helpers:** funções compartilhadas (auth e leitura de world) ficam em `helpers.go` para não serem sobrescritas pelo `gqlgen generate`.

---

## Autenticação

- **Registro:** `register(input: RegisterInput!)`  
  - Cria usuário com senha hasheada (bcrypt).  
  - Retorna `AuthPayload { token, user }`.  
  - Não exige token.

- **Login:** `login(input: LoginInput!)`  
  - Busca usuário por email, compara senha com bcrypt.  
  - Retorna `AuthPayload { token, user }`.  
  - Não exige token.

- **Uso do token:**  
  - O cliente envia em toda requisição que exige login:  
    `Authorization: Bearer <token>`.  
  - O middleware valida o JWT (assinatura e expiração, 24h) e coloca o `sub` no context como ID do usuário.

- **Quem exige login:**  
  - `me`, `createWorld`, `updateWorld`, `deleteWorld`, `saveBackstory`.  
  - `myWorlds` sem token retorna lista vazia.  
  - `world(id)` e `backstories(worldId)` não checam dono; qualquer um pode ler se souber o id.

---

## Schema GraphQL

### Tipos principais

- **User:** `id`, `username`, `email` (senha nunca é exposta no GraphQL).
- **AuthPayload:** `token`, `user` (retorno de register/login).
- **World:** `id`, `name`, `description`.
- **Backstory:** `id`, `title`, `characterName`, `content`, `world`.

### Queries

| Query            | Descrição                         | Auth   |
|------------------|-----------------------------------|--------|
| me               | Usuário logado                    | opcional |
| myWorlds         | Mundos do usuário logado          | opcional (vazio se não logado) |
| world(id)        | Um mundo por ID                   | não    |
| backstories(worldId) | Backstories de um mundo       | não    |

### Mutations

| Mutation       | Descrição                          | Auth   |
|----------------|------------------------------------|--------|
| register       | Criar conta                        | não    |
| login          | Login (email + senha)              | não    |
| createWorld    | Criar mundo (dono = usuário logado)| sim    |
| updateWorld    | Atualizar nome/descrição do mundo  | sim (dono) |
| deleteWorld    | Excluir mundo                      | sim (dono) |
| saveBackstory  | Criar backstory em um mundo        | sim (world deve ser seu) |

---

## Banco de dados

### Tabelas (`init.sql`)

- **users:** `id` (SERIAL), `username` (UNIQUE), `email` (UNIQUE), `password` (bcrypt).
- **worlds:** `id` (SERIAL), `name`, `description`, `user_id` (FK → users).
- **backstories:** `id` (SERIAL), `title`, `character_name`, `content`, `world_id` (FK → worlds).

Relações: um usuário tem vários mundos; um mundo tem várias backstories.

### Regras nos resolvers

- **createWorld:** insere `user_id` com o ID do usuário do context.
- **updateWorld / deleteWorld:** cláusula `WHERE id = $1 AND user_id = $2` (só o dono altera/apaga).
- **saveBackstory:** só permite se existir world com esse `id` e `user_id` = usuário logado; depois insere em `backstories` com `world_id`.
- **myWorlds:** `WHERE user_id = $1` (apenas mundos do usuário logado).

---

## Referência das operações

### Registrar

```graphql
mutation {
  register(input: { username: "maria", email: "maria@mail.com", password: "senha123" }) {
    token
    user { id username email }
  }
}
```

### Login

```graphql
mutation {
  login(input: { email: "maria@mail.com", password: "senha123" }) {
    token
    user { id username email }
  }
}
```

### Headers para operações autenticadas

No Playground (ou no cliente), adicione:

```json
{ "Authorization": "Bearer SEU_TOKEN_AQUI" }
```

### Me

```graphql
query { me { id username email } }
```

### Mundos (CRUD)

```graphql
# Criar
mutation { createWorld(name: "Meu Mundo", description: "Descrição") { id name description } }

# Listar meus mundos
query { myWorlds { id name description } }

# Um mundo
query { world(id: "1") { id name description } }

# Atualizar
mutation { updateWorld(id: "1", input: { name: "Novo Nome", description: "Nova desc" }) { id name } }

# Deletar
mutation { deleteWorld(id: "1") }
```

### Backstories

```graphql
# Salvar
mutation {
  saveBackstory(
    title: "Origem do Herói"
    content: "Era uma vez..."
    worldId: "1"
    characterName: "Aragorn"
  ) { id title characterName content world { id name } }
}

# Listar por mundo
query { backstories(worldId: "1") { id title characterName content world { id name } } }
```

---

## Resumo da lógica

1. **Request** → middleware lê JWT e coloca `userID` no context (se válido).
2. **Resolver** usa `userIDFromContext(ctx)` para decidir se há usuário logado.
3. **Criação/edição** de mundos e backstories sempre verifica dono (via `user_id` no banco ou checagem de world).
4. **Senha** nunca sai do backend; só hash bcrypt no DB e comparação no login.
5. **Token** JWT com `sub` = ID do usuário; expira em 24h; secret em `JWT_SECRET`.

Para mais detalhes do schema, use o GraphQL Playground em http://localhost:8080 (documentação e autocomplete).
