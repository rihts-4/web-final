import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                if (parsed && typeof parsed === "object" && parsed.username) {
                    setUser(parsed);
                }
            }
        } catch {
            localStorage.removeItem("user");
            localStorage.removeItem("auth_token");
        } finally {
            setInitialized(true);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout, initialized }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within UserProvider");
    }
    return context;
}
