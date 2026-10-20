import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const getTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
      showToast("Failed to load tasks", "error");
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return showToast("Title is required", "error");
    try {
      await API.post("/tasks", { title, description });
      setTitle("");
      setDescription("");
      getTasks();
      showToast("Task added successfully 🎉");
    } catch (err) {
      console.log(err);
      showToast("Failed to add task", "error");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      getTasks();
      showToast("Task deleted 🗑️", "error");
    } catch (err) {
      console.log(err);
    }
  };

  const toggleTask = async (task) => {
    try {
      await API.put(`/tasks/${task._id}`, {
        ...task,
        completed: !task.completed,
      });
      getTasks();
      showToast(task.completed ? "Marked as pending" : "Marked as completed ✅");
    } catch (err) {
      console.log(err);
    }
  };

  const editTask = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setDescription(task.description);
  };

  const updateTask = async () => {
    if (!title.trim()) return showToast("Title is required", "error");
    try {
      await API.put(`/tasks/${editingId}`, { title, description });
      setEditingId(null);
      setTitle("");
      setDescription("");
      getTasks();
      showToast("Task updated ✏️");
    } catch (err) {
      console.log(err);
      showToast("Failed to update task", "error");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  };

  return (
    <div className="container">
      <Toast toasts={toasts} />
      <h1>Task Manager</h1>

      <div className="nav-group">
        <button className="logout-btn" onClick={logout}>Logout</button>
        <Link to="/blogs"><button className="blog-btn">Blog Posts</button></Link>
      </div>

    
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card stat-completed">
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-card stat-pending">
          <span className="stat-number">{stats.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
      </div>

   
      <input
        type="text"
        placeholder="🔍 Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

     
      <div className="input-group">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {editingId ? (
          <div className="btn-row">
            <button onClick={updateTask}>Update Task</button>
            <button className="cancel-edit-btn" onClick={cancelEdit}>Cancel</button>
          </div>
        ) : (
          <button onClick={addTask}>Add Task</button>
        )}
      </div>

 
      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          {search ? "No tasks match your search 🔍" : "No tasks yet. Add one above! 📝"}
        </div>
      ) : (
        <ul>
          {filteredTasks.map((task) => (
            <li key={task._id}>
              <div>
                <h3
                  onClick={() => toggleTask(task)}
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                    cursor: "pointer",
                  }}
                >
                  {task.title}
                </h3>
                <p>{task.description}</p>
                <small>Status: {task.completed ? "✅ Completed" : "⏳ Pending"}</small>
              </div>
              <div className="btn-group">
                <button onClick={() => editTask(task)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteTask(task._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
