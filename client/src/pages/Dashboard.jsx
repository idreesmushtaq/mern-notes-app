import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { token } = useContext(AuthContext);

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // For editing
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchNotes();
  }, [token]);

  // Add Note
  const handleAdd = async () => {
    if (!title || !content) return alert("Fill all fields");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/notes",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotes([...notes, res.data]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.log(err);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Start editing
  const startEdit = (note) => {
    setEditing(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  // Save edited note
  const saveEdit = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/notes/${id}`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotes(notes.map((n) => (n._id === id ? res.data : n)));
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create a Note</h2>

      <input
        value={title}
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", width: "300px", marginBottom: "10px" }}
      />

      <textarea
        value={content}
        placeholder="Content"
        onChange={(e) => setContent(e.target.value)}
        style={{ display: "block", width: "300px", marginBottom: "10px" }}
      />

      <button onClick={handleAdd}>Add Note</button>

      <hr style={{ margin: "20px 0" }} />

      <h2>Your Notes</h2>

      {notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        notes.map((note) => (
          <div 
            key={note._id}
            style={{ 
              padding: "15px", 
              border: "1px solid #ccc", 
              marginBottom: "10px", 
              borderRadius: "5px" 
            }}
          >
            {editing === note._id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{ width: "250px", marginBottom: "8px" }}
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  style={{ width: "250px", height: "70px" }}
                />
                <br />
                <button onClick={() => saveEdit(note._id)} style={{ marginRight: "10px" }}>
                  Save
                </button>
                <button onClick={() => setEditing(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h3>{note.title}</h3>
                <p>{note.content}</p>

                <button
                  onClick={() => startEdit(note)}
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(note._id)}
                  style={{ background: "red", color: "white" }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
