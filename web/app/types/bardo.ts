export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface World {
  id: string;
  name: string;
  description: string | null;
}

export interface UpdateWorldInput {
  name?: string;
  description?: string;
}

export interface Backstory {
  id: string;
  title: string;
  characterName: string;
  content: string;
  world: World;
}
