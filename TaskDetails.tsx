import Comments from "../components/Comments";

type Task = {
  id: number;
  title: string;
  description?: string;
};

export default function TaskDetails({ task }: { task: Task }) {
  return (
    <div style={{ maxWidth: 600 }}>
      <h1>{task.title}</h1>
      <p style={{ opacity: 0.8 }}>{task.description}</p>

      <hr style={{ margin: "24px 0", opacity: 0.2 }} />

      <Comments taskId={task.id} />
    </div>
  );
}
