import { useState } from "react";
import { useComments } from "../hooks/useComments";
import "./Comments.css";

type UIComment = {
  id: number;
  content: string;
  liked: boolean;
  pinned: boolean;
};

export default function Comments({ taskId }: { taskId: number }) {
  const { comments, add, remove, loading } = useComments(taskId);

  // UI-only states
  const [uiComments, setUiComments] = useState<UIComment[]>([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"new" | "old">("new");
  const [recentlyDeleted, setRecentlyDeleted] = useState<UIComment | null>(null);

  // Sync backend comments → UI comments
  if (uiComments.length !== comments.length) {
    setUiComments(
      comments.map((c) => ({
        id: c.id,
        content: c.content,
        liked: false,
        pinned: false,
      }))
    );
  }

  async function handleAdd() {
    if (!text.trim()) return;
    await add(text);
    setText("");
  }

  function toggleLike(id: number) {
    setUiComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, liked: !c.liked } : c))
    );
  }

  function togglePin(id: number) {
    setUiComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    );
  }

  async function handleDelete(c: UIComment) {
    setRecentlyDeleted(c);
    setUiComments((prev) => prev.filter((x) => x.id !== c.id));
    await remove(c.id);
  }

  function undoDelete() {
    if (!recentlyDeleted) return;
    setUiComments((prev) => [recentlyDeleted!, ...prev]);
    setRecentlyDeleted(null);
  }

  // Filter + sort
  const filtered = uiComments
    .filter((c) =>
      c.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (sort === "new" ? b.id - a.id : a.id - b.id))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <div className="comments-card">
      <div className="header">
        <h2>
          Discussion <span className="count">{uiComments.length}</span>
        </h2>
      </div>

      {/* Search + Sort */}
      <div className="toolbar">
        <input
          placeholder="Search comments…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value as any)}>
          <option value="new">Newest</option>
          <option value="old">Oldest</option>
        </select>
      </div>

      {/* Add */}
      <div className="input-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment…"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button disabled={!text.trim() || loading} onClick={handleAdd}>
          Post
        </button>
      </div>

      {/* Undo */}
      {recentlyDeleted && (
        <div className="undo">
          Comment deleted
          <button onClick={undoDelete}>Undo</button>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <p className="empty">No comments found</p>
      ) : (
        <ul className="list">
          {filtered.map((c) => (
            <li key={c.id} className={`comment ${c.pinned ? "pinned" : ""}`}>
              <div className="content">{c.content}</div>

              <div className="actions">
                <button onClick={() => toggleLike(c.id)}>
                  {c.liked ? "❤️" : "🤍"}
                </button>
                <button onClick={() => togglePin(c.id)}>📌</button>
                <button onClick={() => handleDelete(c)}>🗑</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
