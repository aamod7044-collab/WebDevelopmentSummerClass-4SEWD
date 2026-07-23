import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getTasks } from "../../services/TaskService";
import TaskItem from "../TaskItem/TaskItem";

function TaskContainer({ containerTitle }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        toast.error("Could not load tasks");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <div>
      <h2>{containerTitle}</h2>
      <ul>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
}

export default TaskContainer;
