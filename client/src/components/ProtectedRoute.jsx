import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  console.log("PROTECTED:", { user, loading });

  if (loading) return <p>Loading Auth...</p>;

  if (!user) {
    console.log("NO USER → redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("USER FOUND → showing protected page");
  return children;
};

export default ProtectedRoute;
