import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('acie_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const { data } = await axios.get('/api/auth/profile');
                    setUser(data);
                } catch {
                    localStorage.removeItem('acie_token');
                    setToken(null);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };
        initAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('acie_token', data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setToken(data.token);
            setUser(data);
            return data;
        } catch (err) {
            throw err;
        }
    };

    const register = async (name, email, password, targetRole) => {
        try {
            const { data } = await axios.post('/api/auth/register', { name, email, password, targetRole });
            localStorage.setItem('acie_token', data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setToken(data.token);
            setUser(data);
            return data;
        } catch (err) {
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('acie_token');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, fetchProfile: () => { } }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
