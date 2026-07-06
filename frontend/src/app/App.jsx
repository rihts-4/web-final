import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { DeckFeed } from "./components/DeckFeed";
import { ComposeModal } from "./components/ComposeModal";
import { RightSidebar } from "./components/RightSidebar";
import { ProfilePage } from "./components/ProfilePage";
import { LoginPage } from "./components/LoginPage";
import { OnboardingModal } from "./components/OnboardingModal";
import { ReplyModal } from "./components/ReplyModal";
import { HashtagList } from "./components/HashtagList";
import { api } from "./services/api";
import { Bell, Compass, Search } from "lucide-react";

export default function App() {
    const [route, setRoute] = useState("login");
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [activeNav, setActiveNav] = useState("home");
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
                setRoute("login");
            }
        };

        if (route !== "login") {
            initApp();
        }
    }, [route]);

    const enterApp = () => {
        setRoute("home");
        setShowOnboarding(false);
    };

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
        } catch (err) {
            alert(err.message);
        }
    };

    if (route === "login") {
        return <LoginPage onEnter={enterApp} />;
    }

    if (!currentUser) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#F4F0E6]">
                <p className="text-muted-foreground">Loading your garden...</p>
            </div>
        );
    }

    const savedPosts = posts.filter((p) => p.bookmarked);

    const renderMain = () => {
        if (activeNav === "profile") {
            return <ProfilePage user={currentUser} />;
        }

        if (activeNav === "notifications") {
            const notifs = [
                {
                    emoji: "❤️",
                    user: "Amara Sol",
                    action: "liked your thought",
                    time: "2h",
                    avatar: posts[0]?.user.avatar,
                },
                {
                    emoji: "👁",
                    user: "Rowan Ashby",
                    action: "started following you",
                    time: "4h",
                    avatar: posts[1]?.user.avatar,
                },
                {
                    emoji: "🔁",
                    user: "Zara Finch",
                    action: "re-rooted your thought",
                    time: "6h",
                    avatar: posts[2]?.user.avatar,
                },
                {
                    emoji: "💬",
                    user: "Felix Osei",
                    action: 'replied: "Couldn\'t agree more."',
                    time: "8h",
                    avatar: posts[3]?.user.avatar,
                },
                {
                    emoji: "❤️",
                    user: "Mila Voss",
                    action: "liked your thought",
                    time: "1d",
                    avatar: posts[4]?.user.avatar,
                },
            ];
            return (
                <div
                    className="flex flex-col h-full overflow-y-auto"
                    style={{ fontFamily: "'Nunito', sans-serif" }}
                >
                    <div
                        className="px-5 py-4 flex items-center gap-2 flex-shrink-0"
                        style={{
                            borderBottom: "1px solid rgba(42,42,37,0.08)",
                        }}
                    >
                        <Bell size={18} style={{ color: "#6B8F5E" }} />
                        <h1
                            className="text-foreground text-[18px]"
                            style={{ fontWeight: 800 }}
                        >
                            Ripples
                        </h1>
                    </div>
                    {notifs.map((n, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-secondary/40"
                            style={{
                                borderBottom: "1px solid rgba(42,42,37,0.06)",
                            }}
                        >
                            <span className="text-xl flex-shrink-0">
                                {n.emoji}
                            </span>
                            <img
                                src={n.avatar}
                                alt={n.user}
                                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                                style={{
                                    outline: "2px solid rgba(107,143,94,0.2)",
                                    outlineOffset: 1,
                                }}
                            />

                            <div className="flex-1 min-w-0">
                                <span
                                    className="text-foreground text-[14px]"
                                    style={{ fontWeight: 700 }}
                                >
                                    {n.user}{" "}
                                </span>
                                <span className="text-foreground text-[14px]">
                                    {n.action}
                                </span>
                                <p className="text-muted-foreground text-[12px] mt-0.5">
                                    {n.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (activeNav === "explore") {
            if (selectedTopic) {
                return (
                    <div
                        className="flex flex-col h-full"
                        style={{ fontFamily: "'Nunito', sans-serif" }}
                    >
                        <div
                            className="px-5 py-4 flex items-center gap-3 flex-shrink-0"
                            style={{
                                borderBottom: "1px solid rgba(42,42,37,0.08)",
                            }}
                        >
                            <button
                                onClick={() => setSelectedTopic(null)}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary transition-colors"
                            >
                                ←
                            </button>
                            <div>
                                <h1
                                    className="text-foreground text-[18px]"
                                    style={{ fontWeight: 800 }}
                                >
                                    {selectedTopic}
                                </h1>
                                <p className="text-muted-foreground text-[12px]">
                                    Top thoughts in this category
                                </p>
                            </div>
                        </div>
                        <DeckFeed
                            posts={posts}
                            onLike={handleLike}
                            onRepost={handleRepost}
                            onBookmark={handleBookmark}
                            onReply={(post) => setReplyPost(post)}
                        />
                    </div>
                );
            }

            return (
                <div
                    className="flex flex-col h-full overflow-y-auto"
                    style={{ fontFamily: "'Nunito', sans-serif" }}
                >
                    <div
                        className="px-5 py-4 flex-shrink-0"
                        style={{
                            borderBottom: "1px solid rgba(42,42,37,0.08)",
                        }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Compass size={18} style={{ color: "#6B8F5E" }} />
                            <h1
                                className="text-foreground text-[18px]"
                                style={{ fontWeight: 800 }}
                            >
                                Explore
                            </h1>
                        </div>
                        <div className="relative">
                            <Search
                                size={15}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />

                            <input
                                type="text"
                                placeholder="Search thoughts, tags, people..."
                                className="w-full rounded-2xl pl-10 pr-4 py-2.5 text-[14px] outline-none"
                                style={{
                                    background: "#EAE5D8",
                                    color: "#2A2A25",
                                    border: "1.5px solid transparent",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#6B8F5E";
                                    e.target.style.background = "#FDFAF4";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "transparent";
                                    e.target.style.background = "#EAE5D8";
                                }}
                            />
                        </div>
                    </div>

                    <div className="px-5 py-5 flex flex-col gap-6">
                        <div>
                            <h2
                                className="text-[13px] uppercase tracking-wider mb-3"
                                style={{ color: "#7D7D72", fontWeight: 700 }}
                            >
                                Topics
                            </h2>
                            <div className="grid grid-cols-2 gap-2.5">
                                {[
                                    {
                                        label: "Slow Living",
                                        emoji: "🍃",
                                        count: "24.8K",
                                    },
                                    {
                                        label: "Ecology",
                                        emoji: "🌿",
                                        count: "12.4K",
                                    },
                                    {
                                        label: "Design",
                                        emoji: "✏️",
                                        count: "55K",
                                    },
                                    {
                                        label: "Mindfulness",
                                        emoji: "🧘",
                                        count: "8.9K",
                                    },
                                    {
                                        label: "Sustainability",
                                        emoji: "♻️",
                                        count: "41K",
                                    },
                                    {
                                        label: "Science",
                                        emoji: "🔬",
                                        count: "18K",
                                    },
                                ].map((cat) => (
                                    <div
                                        key={cat.label}
                                        onClick={() =>
                                            setSelectedTopic(cat.label)
                                        }
                                        className="flex flex-col gap-1.5 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-md"
                                        style={{
                                            background: "#FDFAF4",
                                            border: "1px solid rgba(42,42,37,0.08)",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor =
                                                "rgba(107,143,94,0.35)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor =
                                                "rgba(42,42,37,0.08)";
                                        }}
                                    >
                                        <span className="text-2xl">
                                            {cat.emoji}
                                        </span>
                                        <span
                                            className="text-foreground text-[14px]"
                                            style={{ fontWeight: 700 }}
                                        >
                                            {cat.label}
                                        </span>
                                        <span className="text-muted-foreground text-[12px]">
                                            {cat.count} thoughts
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <HashtagList title="Trending tags" />
                    </div>
                </div>
            );
        }

        if (activeNav === "bookmarks") {
            return (
                <div
                    className="flex flex-col h-full"
                    style={{ fontFamily: "'Nunito', sans-serif" }}
                >
                    <div
                        className="px-5 py-4 flex-shrink-0"
                        style={{
                            borderBottom: "1px solid rgba(42,42,37,0.08)",
                        }}
                    >
                        <h1
                            className="text-foreground text-[18px]"
                            style={{ fontWeight: 800 }}
                        >
                            Saved Thoughts
                        </h1>
                        <p className="text-muted-foreground text-[13px]">
                            {savedPosts.length} thought
                            {savedPosts.length !== 1 ? "s" : ""} saved
                        </p>
                    </div>
                    {savedPosts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center flex-1 text-center px-8">
                            <span className="text-5xl mb-4">🌿</span>
                            <h2
                                className="text-foreground text-[20px] mb-2"
                                style={{ fontWeight: 800 }}
                            >
                                Nothing saved yet
                            </h2>
                            <p className="text-muted-foreground text-[14px] leading-relaxed">
                                Tap the bookmark icon on any thought to save it
                                here.
                            </p>
                        </div>
                    ) : (
                        <DeckFeed
                            posts={savedPosts}
                            onLike={handleLike}
                            onRepost={handleRepost}
                            onBookmark={handleBookmark}
                            onReply={(post) => setReplyPost(post)}
                        />
                    )}
                </div>
            );
        }

        return (
            <div
                className="flex flex-col h-full"
                style={{ fontFamily: "'Nunito', sans-serif" }}
            >
                <div
                    className="px-5 py-3.5 flex items-center justify-between flex-shrink-0"
                    style={{
                        borderBottom: "1px solid rgba(42,42,37,0.08)",
                    }}
                >
                    <div>
                        <h1
                            className="text-foreground text-[18px]"
                            style={{ fontWeight: 800 }}
                        >
                            Your Garden
                        </h1>
                        <p className="text-muted-foreground text-[11px]">
                            Swipe right to like · swipe left to reply
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span
                            className="px-3 py-1 rounded-full text-[12px]"
                            style={{
                                background: "rgba(107,143,94,0.12)",
                                color: "#6B8F5E",
                                fontWeight: 700,
                            }}
                        >
                            For you
                        </span>
                        <span
                            className="px-3 py-1 rounded-full text-[12px] text-muted-foreground cursor-pointer hover:bg-secondary transition-colors"
                            style={{ fontWeight: 500 }}
                        >
                            Following
                        </span>
                    </div>
                </div>
                <DeckFeed
                    posts={posts}
                    onLike={handleLike}
                    onRepost={handleRepost}
                    onBookmark={handleBookmark}
                    onReply={(post) => setReplyPost(post)}
                />
            </div>
        );
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
                activeTab={activeNav}
                onTabChange={setActiveNav}
                onCompose={() => setShowCompose(true)}
                onShowOnboarding={() => setShowOnboarding(true)}
                currentUser={currentUser}
            />

            <main
                className="flex-1 min-w-0 flex overflow-hidden"
                style={{ borderRight: "1px solid rgba(42,42,37,0.1)" }}
            >
                <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
                    {renderMain()}
                </div>
            </main>

            <div className="hidden lg:flex flex-col overflow-y-auto py-4">
                <RightSidebar
                    onTopicClick={(topic) => {
                        setActiveNav("explore");
                        setSelectedTopic(topic);
                    }}
                />
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
    );
}
