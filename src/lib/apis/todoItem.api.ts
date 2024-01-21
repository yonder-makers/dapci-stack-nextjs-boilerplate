import axios from 'axios';

export type TodoItemRequest = {
  name: string;
  isDone: boolean;
  assigneeIds: string[];
};

export type TodoItemResponse = {
  id: string;
  name: string;
  isDone: boolean;
  assigneeIds: string[];
};

export type TodoItemDeletedResponse = {
  id: string;
};

export async function createTodoItem(
  todoListId: string,
  item: TodoItemRequest,
) {
  const body = item;
  const url = `/api/todo-lists/${todoListId}/items`;

  const response = await axios.post<TodoItemResponse>(url, body);

  return response.data;
}

export async function updateTodoItem(
  todoListId: string,
  itemId: string,
  item: TodoItemRequest,
) {
  const body = item;
  const url = `/api/todo-lists/${todoListId}/items/${itemId}`;

  const response = await axios.post<TodoItemResponse>(url, body);

  return response.data;
}

export async function updateTodoItemIsDone(
  todoListId: string,
  itemId: string,
  isDone: boolean,
) {
  const url = `/api/todo-lists/${todoListId}/items/${itemId}/is-done`;

  const method = isDone ? 'POST' : 'DELETE';

  const response = await axios.request<TodoItemResponse>({
    url,
    method,
  });

  return response.data;
}

export async function deleteTodoItem(todoListId: string, itemId: string) {
  const url = `/api/todo-lists/${todoListId}/items/${itemId}`;

  const response = await axios.delete<TodoItemDeletedResponse>(url);

  return response.data;
}
