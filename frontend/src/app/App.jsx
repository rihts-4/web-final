import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { HomePage } from "./components/pages/HomePage";
import { ExplorePage } from "./components/pages/ExplorePage";
import { NotificationsPage } from "./components/pages/NotificationsPage";
import { ProfilePage } from "./components/ProfilePage";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { UserProvider } from "./context/UserContext";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <HomePage />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/explore"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <ExplorePage />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/notifications"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <NotificationsPage />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <ProfilePage />
                        </Layout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </UserProvider>
    );
}
