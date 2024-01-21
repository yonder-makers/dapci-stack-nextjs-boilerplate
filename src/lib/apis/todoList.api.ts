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
  const request = await fetch('/api/todo-lists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const response = await request.json();

  return response as TodoListResponse;
}

export async function updateTodoList(id: string, name: string) {
  const body = { name } as TodoListRequest;
  const request = await fetch(`/api/todo-lists/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const response = await request.json();

  return response as TodoListResponse;
}

export async function deleteTodoList(id: string) {
  const request = await fetch(`/api/todo-lists/${id}`, {
    method: 'DELETE',
  });

  const response = await request.json();
  return response as TodoListDeletedResponse;
}
