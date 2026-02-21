import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    async function bootstrapAuth() {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get('/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data.user || res.data);
            setRole(res.data.role || res.data.user?.role);
        } catch (e) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            setUser(null);
            setRole(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { bootstrapAuth(); }, []);

    return (
        <AuthContext.Provider value={{ user, role, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
