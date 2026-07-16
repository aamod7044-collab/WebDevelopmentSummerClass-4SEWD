import "./TaskComponent.css";

function TaskComponent() {
  const containerTitle = "Tasks Due Today";
  const tasks = [
    // { time: "9:00 AM", text: "Get eggs", isUrgent: true },
    // { time: "9:05 AM", text: "Clean your room", isUrgent: false },
    // { time: "10:00 AM", text: "Complete task 1", isUrgent: false },
    // { time: "4:00 PM", text: "Go for a walk", isUrgent: false },
  ];

  if (tasks.length === 0) {
    return <h2>No Pending Tasks</h2>;
  } else {
    return (
      <>
        <h2>{containerTitle}</h2>
        <ul>
          {tasks.map((task, index) => (
            <li
              className={task.isUrgent ? "task-item urgent-task" : "task-item"}
              key={index}
            >
              <span>{task.time}</span>-<span>{task.text}</span>
            </li>
          ))}
        </ul>
      </>
    );
  }
}

export default TaskComponent;
