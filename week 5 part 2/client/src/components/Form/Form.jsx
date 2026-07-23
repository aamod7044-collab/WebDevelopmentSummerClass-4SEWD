import { useState } from "react";
import { useNavigate } from "react-router";
import { createTask } from "../../services/TaskService";
import "./Form.css";

function Form({}) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTask(title, deadline, isUrgent);
      toast.success("Task saved successfully");
      navigate("/");
    } catch (err) {
      toast.error("Could not save task");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Task Title</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Deadline</label>
          <br />
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="checkbox"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.target.checked)}
          />
          <label>Is Urgent</label>
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Task"}
        </button>
      </form>
    </>
  );
}

export default Form;
