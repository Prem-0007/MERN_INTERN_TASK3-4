import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const MAX_CHARS = 500;

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

function BlogDashboard() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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

  const getBlogs = async () => {
    try {
      const res = await API.get("/blogs");
      setBlogs(res.data);
    } catch (err) {
      console.log(err);
      showToast("Failed to load blogs", "error");
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  const addBlog = async () => {
    if (!title.trim()) return showToast("Title is required", "error");
    if (!content.trim()) return showToast("Content is required", "error");
    try {
      await API.post("/blogs", { title, content });
      setTitle("");
      setContent("");
      getBlogs();
      showToast("Blog post created 🎉");
    } catch (err) {
      console.log(err);
      showToast("Failed to create blog", "error");
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await API.delete(`/blogs/${id}`);
      getBlogs();
      showToast("Blog deleted 🗑️", "error");
    } catch (err) {
      console.log(err);
    }
  };

  const editBlog = (blog) => {
    setEditingId(blog._id);
    setTitle(blog.title);
    setContent(blog.content);
  };

  const updateBlog = async () => {
    if (!title.trim()) return showToast("Title is required", "error");
    if (!content.trim()) return showToast("Content is required", "error");
    try {
      await API.put(`/blogs/${editingId}`, { title, content });
      setEditingId(null);
      setTitle("");
      setContent("");
      getBlogs();
      showToast("Blog updated ✏️");
    } catch (err) {
      console.log(err);
      showToast("Failed to update blog", "error");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <Toast toasts={toasts} />
      <h1>Blog Posts</h1>

      <div className="nav-group">
        <button onClick={() => navigate("/")}>Back to Tasks</button>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>


      <input
        type="text"
        placeholder="🔍 Search blogs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

     
      <div className="input-group">
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="textarea-wrapper">
          <textarea
            className="blog-textarea"
            placeholder="Blog Content"
            value={content}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) setContent(e.target.value);
            }}
            rows={5}
          />
          <div className={`char-counter ${content.length >= MAX_CHARS ? "char-limit" : ""}`}>
            {content.length}/{MAX_CHARS}
          </div>
        </div>
        {editingId ? (
          <div className="btn-row">
            <button onClick={updateBlog}>Update Blog</button>
            <button className="cancel-edit-btn" onClick={cancelEdit}>Cancel</button>
          </div>
        ) : (
          <button onClick={addBlog}>Add Blog</button>
        )}
      </div>

     
      {filteredBlogs.length === 0 ? (
        <div className="empty-state">
          {search ? "No blogs match your search 🔍" : "No blog posts yet. Write one above! ✍️"}
        </div>
      ) : (
        <ul>
          {filteredBlogs.map((blog) => (
            <li key={blog._id}>
              <div style={{ flex: 1 }}>
                <h3>{blog.title}</h3>
                <p>{blog.content}</p>
                <small>📅 {new Date(blog.createdAt).toLocaleDateString()}</small>
              </div>
              <div className="btn-group">
                <button onClick={() => editBlog(blog)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteBlog(blog._id)}>
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

export default BlogDashboard;
