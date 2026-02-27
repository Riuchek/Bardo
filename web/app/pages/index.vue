<script lang="ts" setup>
const query = gql`
  query GetTodos {
    todos {
      text
      done
    }
  }
`

const { data, error } = await useAsyncQuery(query)
</script>

<template>
  <div>
    <h1>Lista de Tarefas (Vindo do Go)</h1>

    <div v-if="error">Erro ao conectar no backend: {{ error.message }}</div>

    <ul v-else-if="data">
      <li v-for="todo in data.todos" :key="todo.text">
        {{ todo.text }} - <strong>{{ todo.done ? 'Feito' : 'Pendente' }}</strong>
      </li>
    </ul>
    
    <p v-else>Carregando...</p>
  </div>
</template>