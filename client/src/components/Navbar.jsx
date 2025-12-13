import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout} = useContext(AuthContext);
  const navigate = useNavigate();
  const [dark, setDark] = useState(()=> localStorage.getItem("dark") === "1");

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("dark", next ? "1" : "0");
  };

  return(
    <nav className="bg-slate-50 dark:bg-gray-900 p-3 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold">NotesApp</Link>
        <Link to="/" className="text-sm">My Notes</Link>
        <Link to="/dashboard" className="text-sm">Dashboard</Link>
      </div>

      <div className="flex items-center gap-3">
         <button onClick={toggle} className="px-2 py-1 border rounded">Theme</button>
        {user ? (
          <>
            <span className="text-sm">{user.name}</span>
            <button onClick={() => { logout(); navigate("/login"); }} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
          </>
        ) : (
          <Link to="/login" className="px-3 py-1 bg-blue-500 text-white rounded">Login</Link>
        )}
      </div>
    </nav>
  )
 };


