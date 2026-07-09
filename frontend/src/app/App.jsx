import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { ComposeModal } from "./components/ComposeModal";
import { ReplyModal } from "./components/ReplyModal";
import { OnboardingModal } from "./components/OnboardingModal";
import { RightSidebar } from "./components/RightSidebar";
import { LoginPage } from "./components/LoginPage";
import { HomePage } from "./pages/HomePage";
import { ExplorePage } from "./pages/ExplorePage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { BookmarksPage } from "./pages/BookmarksPage";
import { ProfilePage } from "./components/ProfilePage";
import { api } from "./services/api";

export default function App() {
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [showCompose, setShowCompose] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [replyPost, setReplyPost] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);

    useEffect(() => {
        const initApp = async () => {
            try {
                const user = await api.auth.me();
                setCurrentUser(user);
                const initialPosts = await api.posts.getAll();
                setPosts(initialPosts);
            } catch (err) {
                console.error("Failed to initialize app:", err);
                setCurrentUser(null);
            }
        };

        initApp();
    }, []);

    const handleLike = async (id) => {
        try {
            const updatedPost = await api.posts.like(id);
            setPosts((prev) =>
                prev.map((p) => (p.id === id ? updatedPost : p)),
            );
        } catch (err) {
            alert(err.message);
        }
    };

    const handleRepost = async (id) => {
        try {
            const updatedPost = await api.posts.repost(id);
            setPosts((prev) =>
                prev.map((p) => (p.id === id ? updatedPost : p)),
            );
        } catch (err) {
            alert(err.message);
        }
    };

    const handleBookmark = async (id) => {
        try {
            const updatedPost = await api.posts.bookmark(id);
            setPosts((prev) =>
                prev.map((p) => (p.id === id ? updatedPost : p)),
            );
        } catch (err) {
            alert(err.message);
        }
    };

    const handlePost = async (content) => {
        try {
            const newPost = await api.posts.create({ content });
            setPosts((prev) => [newPost, ...prev]);
            setShowCompose(false);
        } catch (err) {
            alert(err.message);
        }
    };

    if (!currentUser) {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage onEnter={() => {}} />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        );
    }

    return (
        <BrowserRouter>
            <div
                className="h-screen flex overflow-hidden"
                style={{
                    background: "#F4F0E6",
                    fontFamily: "'Nunito', sans-serif",
                }}
            >
                <Sidebar
                    onCompose={() => setShowCompose(true)}
                    onShowOnboarding={() => setShowOnboarding(true)}
                    currentUser={currentUser}
                />

                <main
                    className="flex-1 min-w-0 flex overflow-hidden"
                    style={{ borderRight: "1px solid rgba(42,42,37,0.1)" }}
                >
                    <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
                        <Routes>
                            <Route path="/" element={
                                <HomePage 
                                    posts={posts} 
                                    onLike={handleLike} 
                                    onRepost={handleRepost} 
                                    onBookmark={handleBookmark} 
                                    onReply={(post) => setReplyPost(post)} 
                                />
                            } />
                            <Route path="/explore" element={
                                <ExplorePage 
                                    posts={posts} 
                                    onLike={handleLike} 
                                    onRepost={handleRepost} 
                                    onBookmark={handleBookmark} 
                                    onReply={(post) => setReplyPost(post)}
                                    selectedTopic={selectedTopic}
                                    setSelectedTopic={setSelectedTopic}
                                />
                            } />
                            <Route path="/notifications" element={
                                <NotificationsPage 
                                    posts={posts} 
                                    onLike={handleLike} 
                                    onRepost={handleRepost} 
                                    onBookmark={handleBookmark} 
                                    onReply={(post) => setReplyPost(post)} 
                                />
                            } />
                            <Route path="/bookmarks" element={
                                <BookmarksPage 
                                    posts={posts} 
                                    onLike={handleLike} 
                                    onRepost={handleRepost} 
                                    onBookmark={handleBookmark} 
                                    onReply={(post) => setReplyPost(post)} 
                                />
                            } />
                            <Route path="/profile" element={
                                <ProfilePage user={currentUser} />
                            } />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </main>

                <div className="hidden lg:flex flex-col overflow-y-auto py-4">
                    <RightSidebar onTopicClick={(topic) => setSelectedTopic(topic)} />
                </div>

                {showOnboarding && (
                    <OnboardingModal onDismiss={() => setShowOnboarding(false)} />
                )}

                {showCompose && (
                    <ComposeModal
                        onClose={() => setShowCompose(false)}
                        onPost={handlePost}
                        currentUser={currentUser}
                    />
                )}

                {replyPost && (
                    <ReplyModal
                        post={replyPost}
                        currentUser={currentUser}
                        onClose={() => setReplyPost(null)}
                    />
                )}
            </div>
        </BrowserRouter>
    );
}
