import Comments from "./components/Comments";

export default function App() {
  return (
    <div className="app-container">
      <div className="task-card">
        <h1 className="task-title">Thoughts & Discussions</h1>
        <p className="task-subtitle">
          Share your ideas, feedback, and reflections in one place
        </p>

        <Comments taskId={1} />
      </div>
    </div>
  );
}
