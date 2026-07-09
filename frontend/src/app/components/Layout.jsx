import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { RightSidebar } from "./RightSidebar";
import { ComposeModal } from "./ComposeModal";
import { OnboardingModal } from "./OnboardingModal";
import { ReplyModal } from "./ReplyModal";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";

export function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user: contextUser, setUser } = useUser();

    useEffect(() => {
        if (!contextUser) {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                } catch (err) {
                    console.error("Failed to parse stored user:", err);
                }
            }
        }
    }, [contextUser, setUser]);
    const [showCompose, setShowCompose] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [replyPost, setReplyPost] = useState(null);
    const [trending, setTrending] = useState({ hashtags: [], users: [] });

    useEffect(() => {
      api.feed.getTrending().then(setTrending).catch(() => {});
    }, []);

    const getActiveNav = () => {
        const path = location.pathname;
        if (path === "/") return "home";
        if (path === "/explore") return "explore";
        if (path === "/notifications") return "notifications";
        if (path === "/profile") return "profile";
        return "home";
    };

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    const handlePost = async (content) => {
        try {
            await api.posts.create({ content });
            setShowCompose(false);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div
            className="h-screen flex overflow-hidden"
            style={{
                background: "#F4F0E6",
                fontFamily: "'Nunito', sans-serif",
            }}
        >
            <Sidebar
                activeTab={getActiveNav()}
                onTabChange={(tab) => {
                    const routes = {
                        home: "/",
                        explore: "/explore",
                        notifications: "/notifications",
                        profile: "/profile",
                    };
                    navigate(routes[tab]);
                }}
                onCompose={() => setShowCompose(true)}
                onShowOnboarding={() => setShowOnboarding(true)}
                onLogout={handleLogout}
                currentUser={contextUser}
            />

            <main
                className="flex-1 min-w-0 flex overflow-hidden"
                style={{ borderRight: "1px solid rgba(42,42,37,0.1)" }}
            >
                <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
                    {children}
                </div>
            </main>

            {(trending.hashtags.length > 0 || trending.users.length > 0) && (
                <div className="hidden lg:flex flex-col overflow-y-auto py-4">
                    <RightSidebar
                        hashtags={trending.hashtags}
                        users={trending.users}
                        onTopicClick={(topic) => {
                            navigate("/explore");
                        }}
                    />
                </div>
            )}

            {showOnboarding && (
                <OnboardingModal onDismiss={() => setShowOnboarding(false)} />
            )}

            {showCompose && (
                <ComposeModal
                    onClose={() => setShowCompose(false)}
                    onPost={handlePost}
                    currentUser={contextUser}
                />
            )}

            {replyPost && (
                <ReplyModal
                    post={replyPost}
                    currentUser={contextUser}
                    onClose={() => setReplyPost(null)}
                />
            )}
        </div>
    );
}
