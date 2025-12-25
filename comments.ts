export type Comment = {
  id: number;
  content: string;
};

export async function getComments(taskId: number): Promise<Comment[]> {
  const res = await fetch(`/api/tasks/${taskId}/comments`);
  return res.json();
}

export async function addComment(taskId: number, content: string) {
  await fetch(`/api/tasks/${taskId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}

export async function deleteComment(taskId: number, commentId: number) {
  await fetch(`/api/tasks/${taskId}/comments/${commentId}`, {
    method: "DELETE",
  });
}
