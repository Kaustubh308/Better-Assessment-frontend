import { useEffect, useState } from "react";
import {
  getComments,
  addComment,
  deleteComment,
} from "../api/comments";

export type Comment = {
  id: number;
  content: string;
};

export function useComments(taskId: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await getComments(taskId);
    setComments(data);
  }

  async function add(content: string) {
    if (!content.trim()) return;
    setLoading(true);
    await addComment(taskId, content);
    await load();
    setLoading(false);
  }

  async function remove(commentId: number) {
    await deleteComment(taskId, commentId);
    await load();
  }

  useEffect(() => {
    load();
  }, [taskId]);

  return { comments, add, remove, loading };
}
