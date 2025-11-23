import { useEffect, useState } from "react";
import axios from "axios";

function Notes() {

    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");


    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");


    // Update an existing note
    const updateNote = async (id) => {
        await axios.put(`http://localhost:5000/api/notes/${id}`, {
            title: editTitle,
            content: editContent,
        });
        setEditId(null);
        getNotes(); // refresh notes
        
    };

    //delete note
    const deleteNote = async (id) => {
  await axios.delete(`http://localhost:5000/api/notes/${id}`);
  getNotes(); // refresh notes
};
    // Fetch all notes from backend API

    const getNotes = async () => {
        const res = await axios.get("http://localhost:5000/api/notes");
        setNotes(res.data);
    };

    useEffect( () => {
        getNotes();
    }, []);

    // add a new note

    const addNote = async (e) => {
         e.preventDefault();

         if (!title || !content) return alert("Please fill all fields");

         await axios.post("http://localhost:5000/api/notes", { title, content });

            setTitle("");
            setContent("");

            getNotes();  //refresh notes list


    };

    return (
        <div>
            <h2>Add New Notes</h2>

            <form onSubmit={addNote} style={{ marginBottom: "20px" }}>
                <input 
                    type="text" 
                    placeholder="Title" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            
            />
            <textarea 
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}         
            />

            <button 
            style={{
                padding: "8px 16px",
                background: "black",
                color: "white",
                border: "none",
                cursor: "pointer",
            }}
            >
            Add Note

            </button>
            </form>

            <h2>All Notes</h2>

            {notes.length === 0 ? (
                <p>No notes available</p>
            ) : (
                notes.map((note) => (
                  <div
  key={note._id}
  style={{
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "10px",
    position: "relative",
  }}
>
  <button
    onClick={() => deleteNote(note._id)}
    style={{
      position: "absolute",
      top: "10px",
      right: "10px",
      background: "red",
      color: "white",
      border: "none",
      padding: "5px 10px",
      cursor: "pointer",
    }}
  >
    X
  </button>

  {/* EDIT MODE */}
  {editId === note._id ? (
    <div>
      <input
        type="text"
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <textarea
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        rows="4"
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <button
        onClick={() => updateNote(note._id)}
        style={{
          padding: "6px 12px",
          background: "green",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginRight: "10px",
        }}
      >
        Save
      </button>

      <button
        onClick={() => setEditId(null)}
        style={{
          padding: "6px 12px",
          background: "gray",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Cancel
      </button>
    </div>
  ) : (
    /* NORMAL VIEW MODE */
    <>
      <h3>{note.title}</h3>
      <p>{note.content}</p>

      <button
        onClick={() => {
          setEditId(note._id);
          setEditTitle(note.title);
          setEditContent(note.content);
        }}
        style={{
          padding: "6px 12px",
          background: "blue",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Edit
      </button>
    </>
  )}
</div>


                ))
            )}
        </div>
    );
}

export default Notes;