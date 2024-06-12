import { API_URL } from '../utils';

export const apiRoutes = {
  login: `${API_URL}/login`,
  logout: `${API_URL}/logout`,
  todos: `${API_URL}/todos`,
  todo: `${API_URL}/todo/`,
  create_todo: `${API_URL}/todo/create`,
  update_todo: `${API_URL}/todo/update/`,
  update_todo_active: `${API_URL}/todo/update-active/`,
  delete_todo: `${API_URL}/todo/delete/`,
};
