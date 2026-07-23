import { useState, useEffect } from "react";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { getTaskById } from "../../services/TaskService";

function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTask = async () => {
      setLoading(true);
      try {
        const foundTask = await getTaskById(id);
        setTask(foundTask);
      } catch (err) {
        toast.error("Could not load task details");
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!task) {
    return <h2>Task not found</h2>;
  }

  return (
    <div>
      <h2>{task.title}</h2>
      <p>Deadline: {task.deadline}</p>
      <p>{task.isUrgent ? "Urgent" : "Not Urgent"}</p>
    </div>
  );
}

export default TaskDetail;
