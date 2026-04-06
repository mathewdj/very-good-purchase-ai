import axios from 'axios'

const authClient = axios.create({ baseURL: '/' })

export const register = (username: string, password: string) =>
  authClient.post('/auth/register', { username, password })

export const login = (username: string, password: string) =>
  authClient.post<{ token: string }>('/auth/login', { username, password }).then((r) => r.data)
