import { useContext, useEffect, useState } from "react";
import axios from "axios";
import NoteCard from "../components/NoteCard";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const {token, user} = useContext(AuthContext);

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [notes, setNotes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);


  //from state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [editing, setEditing] = useState(null);

  const uploadImageForNote = async (noteId, file) => {
  const form = new FormData();
  form.append("image", file);
  await axios.post(`http://localhost:5000/api/notes/${noteId}/upload`, form, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
  });
  fetchNotes();
};



  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: {Authorization: `Bearer ${token}`},
        params: {q, page, limit}
    });
      setNotes(res.data.notes);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err.response?.data|| err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchNotes();
  }, [token, q, page]);

  const createNote = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/notes", { 
        title, content, tags: tags?.split(",").map(t => t.trim()) : [], category, color},
        {headers: {Authorization: `Bearer ${token}`}}
      );
      setNotes([res.data.note, ...notes]);
      setTitle("");
      setContent("");
      setTags("");
      setCategory("");
      
    } catch (err) { console.error(err);}
  };

  const updateNote = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/notes/${id}`, {title, content, tags: tags?tags.split(",").map(t => t.trim()) : [], category, color},
      {headers: {Authorization: `Bearer ${token}`}});
      <input type="file" onChange={(e)=>uploadImageForNote(note._id, e.target.files[0])} />
      setNotes(notes.map(n => n._id === id ? res.data : n));
      setEditing(null);
      setContent("");
      setTitle ("");
} catch (err) { console.error(err);}
  };


  const startEdit = (note) => {
    setEditing(note._id);
    setTitle (note.title);
    setContent(note.content);
    setTags((note.tags||[]).join(", ") );
    setCategory(note.category || "");
    setColor(note.color || "#ffffff");
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: {Authorization: `Bearer ${token}`});
        setNotes(notes.filter(n => n._id !== id));
    } catch (err) { console.error(err);
      
    }
  };

  const togglePin = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/notes/${id}/pin`, {}, {
        headers: {Authorization: `Bearer ${token}`}});
        setNotes(notes.map(n => n._id === id ? res.data : n));
    } catch (err) { console.error(err);}
  };

  const toggleFav = async (id) => {
    try {
      const res  = await axios.patch(`http://localhost:5000/api/notes/${id}/favorite`, {}, {
        headers: {Authorization: `Bearer ${token}`}});
        setNotes(notes.map(n => n._id === id ? res.data : n));
    } catch (err) { console.error(err);}

  };

 return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
          <p className="text-sm text-gray-500">Manage your notes</p>
        </div>

        <div className="flex gap-2 items-center">
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search notes..." className="px-3 py-2 border rounded" />
        </div>
      </div>

      {/* Note form */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
        <input className="w-full mb-2 p-2 border rounded" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <textarea className="w-full mb-2 p-2 border rounded" placeholder="Content" value={content} onChange={(e)=>setContent(e.target.value)} />
        <input className="w-full mb-2 p-2 border rounded" placeholder="Tags (comma separated)" value={tags} onChange={(e)=>setTags(e.target.value)} />
        <input className="w-full mb-2 p-2 border rounded" placeholder="Category" value={category} onChange={(e)=>setCategory(e.target.value)} />
        <div className="flex gap-2 items-center">
          <input type="color" value={color} onChange={(e)=>setColor(e.target.value)} />
          {editing ? (
            <button onClick={()=>updateNote(editing)} className="px-3 py-1 bg-green-500 text-white rounded">Save</button>
          ) : (
            <button onClick={createNote} className="px-3 py-1 bg-blue-500 text-white rounded">Add</button>
          )}
        </div>
      </div>

      {/* Notes grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {loading ? <p>Loading...</p> : notes.map(note => (
          <NoteCard key={note._id} note={note} onEdit={startEdit} onDelete={deleteNote} onPin={togglePin} onFav={toggleFav} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 border rounded">Prev</button>
        <div>{page} / {Math.ceil(total/limit) || 1}</div>
        <button disabled={page>= Math.ceil(total/limit)} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded">Next</button>
      </div>
    </div>
  );
}
  