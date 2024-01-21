export type TodoItemRequest = {
  name: string;
  assigneeIds: string[];
};

export type TodoItemResponse = {
  id: string;
  name: string;
  assigneeIds: string[];
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
