import { createContext, useState, useEffect, Children } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    // Load user data if token exists

    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get("http://localhost:5000/api/protected/me", {
                    headers: { Authorization: `Bearer ${token}`},
                });

                setUser(res.data.user);
            } catch (err) {
                console.error(err);
                setToken(null);
                localStorage.removeItem("token");
            }
            setLoading(false);
        }
        loadUser();
    }, [token]);

    const login = (token, user) => {
        setToken(token);
        localStorage.setItem("token", token);
        setUser(user);
    };
    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value= {{ user, token, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
};