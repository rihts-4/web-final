import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { DeckFeed } from "./DeckFeed";
import { ComposeModal } from "./ComposeModal";
import { RightSidebar } from "./RightSidebar";
import { ProfilePage } from "./ProfilePage";
import { OnboardingModal } from "./OnboardingModal";
import { ReplyModal } from "./ReplyModal";
import { HashtagList } from "./HashtagList";
import { api, IMAGE_BASE } from "../services/api";
import { useUser } from "../context/UserContext";
import { Bell, Compass, Search } from "lucide-react";

export function Dashboard({ initialUser }) {
    const navigate = useNavigate();
    const { user: contextUser } = useUser();
    const currentUser = contextUser || initialUser;
    const [posts, setPosts] = useState([]);
    const [activeNav, setActiveNav] = useState("home");
    const [showCompose, setShowCompose] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [replyPost, setReplyPost] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);

    useEffect(() => {
        const initApp = async () => {
            try {
                const feedPosts = await api.feed.getPersonal();
                const transformedPosts = feedPosts.map((post) => ({
                    id: String(post.id),
                    user: {
                        id: post.user_id,
                        name: post.display_name,
                        handle: post.username,
                    },
                    content: post.content,
                    image: post.image_path ? `${IMAGE_BASE}${post.image_path}` : null,
                    timestamp: new Date(post.created_at).toLocaleDateString(),
                    likes: post.like_count || 0,
                    liked: false,
                    isFollowing: post.is_following === 1,
                }));
                setPosts(transformedPosts);
            } catch (err) {
                console.error("Failed to load posts:", err);
            }
        };
        initApp();

    const handlePost = async (content, image) => {
        try {
            await api.posts.create({ content, image });
            const feedPosts = await api.feed.getPersonal();
            const transformedPosts = feedPosts.map((post) => ({
                id: String(post.id),
                user: {
                    id: post.user_id,
                    name: post.display_name,
                    handle: post.username,
                },
                content: post.content,
                image: post.image_path ? `${IMAGE_BASE}${post.image_path}` : null,
                timestamp: new Date(post.created_at).toLocaleDateString(),
                likes: post.like_count || 0,
                liked: false,
                isFollowing: post.is_following === 1,
            }));
            setPosts(transformedPosts);
        } catch (err) {
            alert(err.message);
        }
    };

    if (!currentUser) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#F4F0E6]">
                <p className="text-muted-foreground">Loading your garden...</p>
            </div>
        );
    }

    const renderMain = () => {
        if (activeNav === "profile") {
            return <ProfilePage />;
        }

        if (activeNav === "notifications") {
            const notifs = [
                {
                    emoji: "❤️",
                    user: "Amara Sol",
                    handle: "amarasol",
                    action: "liked your thought",
                    time: "2h",
                },
                {
                    emoji: "👁",
                    user: "Rowan Ashby",
                    handle: "rowanashby",
                    action: "started following you",
                    time: "4h",
                },
                {
                    emoji: "🔁",
                    user: "Zara Finch",
                    handle: "zarafinch",
                    action: "re-rooted your thought",
                    time: "6h",
                },
                {
                    emoji: "💬",
                    user: "Felix Osei",
                    handle: "felixosei",
                    action: 'replied: "Couldn\'t agree more."',
                    time: "8h",
                },
                {
                    emoji: "❤️",
                    user: "Mila Voss",
                    handle: "milavoss",
                    action: "liked your thought",
                    time: "1d",
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
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs"
                                style={{
                                    background: "#6B8F5E",
                                    color: "#FDFAF4",
                                    outline: "2px solid rgba(107,143,94,0.2)",
                                    outlineOffset: 1,
                                }}
                            >
                                {n.handle?.charAt(0).toUpperCase() || "U"}
                            </div>

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
                            onFollow={handleFollow}
                            currentUserHandle={currentUser.username}
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
                    onFollow={handleFollow}
                    currentUserHandle={currentUser.username}
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
                onLogout={handleLogout}
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
