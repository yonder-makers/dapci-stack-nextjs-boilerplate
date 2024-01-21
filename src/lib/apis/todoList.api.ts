import axios from 'axios';

export type TodoListRequest = {
  name: string;
};

export type TodoListResponse = {
  id: string;
  name: string;
};

export type TodoListDeletedResponse = {
  id: string;
};

export async function createTodoList(name: string) {
  const body = { name } as TodoListRequest;
  const response = await axios.post<TodoListResponse>('/api/todo-lists', body);
  return response.data;
}

export async function updateTodoList(id: string, name: string) {
  const body = { name } as TodoListRequest;
  const response = await axios.post<TodoListResponse>(
    `/api/todo-lists/${id}`,
    body,
  );
  return response.data;
}

export async function deleteTodoList(id: string) {
  const response = await axios.delete<TodoListDeletedResponse>(
    `/api/todo-lists/${id}`,
  );
  return response.data;
}
