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

  const request = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const response = await request.json();

  return response as TodoItemResponse;
}

export async function updateTodoItem(
  todoListId: string,
  itemId: string,
  item: TodoItemRequest,
) {
  const body = item;
  const url = `/api/todo-lists/${todoListId}/items/${itemId}`;

  const request = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const response = await request.json();

  return response as TodoItemResponse;
}

export async function updateTodoItemIsDone(
  todoListId: string,
  itemId: string,
  isDone: boolean,
) {
  const url = `/api/todo-lists/${todoListId}/items/${itemId}/is-done`;

  const request = await fetch(url, {
    method: isDone ? 'POST' : 'DELETE',
  });

  const response = await request.json();

  return response as TodoItemResponse;
}

export async function deleteTodoItem(todoListId: string, itemId: string) {
  const url = `/api/todo-lists/${todoListId}/items/${itemId}`;

  const request = await fetch(url, {
    method: 'DELETE',
  });

  const response = await request.json();
  return response as TodoItemDeletedResponse;
}
