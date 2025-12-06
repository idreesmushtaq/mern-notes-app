import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);

  return (
    <nav style={{
      padding: "10px 20px",
      background: "#282c34",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h2>Notes App</h2>

      <div>
        <Link to="/" style={{ color: "white", marginRight: "20px" }}>Dashboard</Link>
        <button 
          onClick={logout}
          style={{ padding: "6px 12px", background: "red", color: "white", border: "none", borderRadius: "4px" }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
