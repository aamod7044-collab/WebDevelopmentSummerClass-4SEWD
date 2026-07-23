import { Link } from "react-router";
import "./TaskItem.css";

function TaskItem({ task }) {
  return (
    <li className={task.isUrgent ? "task-item urgent-task" : "task-item"}>
      <span>{task.deadline}</span>-<span>{task.title}</span>
      &nbsp;&nbsp;
      <Link to={`/task/${task.id}`}>View Details</Link>
    </li>
  );
}

export default TaskItem;
