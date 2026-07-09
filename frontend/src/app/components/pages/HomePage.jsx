import { useState, useEffect } from "react";
import { DeckFeed } from "../DeckFeed";
import { api } from "../../services/api";

export function HomePage() {
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("for-you");

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const feedPosts = activeTab === "for-you" 
                    ? await api.feed.getPublic()
                    : await api.feed.getPersonal();
                
                const transformedPosts = feedPosts.map((post) => ({
                    id: String(post.id),
                    user: {
                        name: post.display_name,
                        handle: post.username,
                    },
                    content: post.content,
                    image: post.image_path,
                    timestamp: new Date(post.created_at).toLocaleDateString(),
                    likes: post.like_count || 0,
                    liked: false,
                }));
                setPosts(transformedPosts);
            } catch (err) {
                console.error("Failed to load posts:", err);
            }
        };

        loadPosts();
    }, [activeTab]);

    const handleLike = async (id) => {
        try {
            const post = posts.find((p) => p.id === id);
            if (post.liked) {
                await api.posts.unlike(id);
                setPosts((prev) =>
                    prev.map((p) =>
                        p.id === id
                            ? { ...p, liked: false, likes: Math.max(0, p.likes - 1) }
                            : p,
                    ),
                );
            } else {
                await api.posts.like(id);
                setPosts((prev) =>
                    prev.map((p) =>
                        p.id === id ? { ...p, liked: true, likes: p.likes + 1 } : p,
                    ),
                );
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const handleRepost = async (id) => {
        alert("Repost feature not available");
    };

    const handleBookmark = async (id) => {
        alert("Bookmark feature not available");
    };

    const handleDelete = async (id) => {
        try {
            await api.posts.delete(id);
            setPosts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

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
                <h1
                    className="text-foreground text-[18px]"
                    style={{ fontWeight: 800 }}
                >
                    Your Garden
                </h1>
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setActiveTab("for-you")}
                        className="px-3 py-1 rounded-full text-[12px] transition-all"
                        style={{
                            background: activeTab === "for-you" ? "rgba(107,143,94,0.12)" : "transparent",
                            color: activeTab === "for-you" ? "#6B8F5E" : "#B5B0A4",
                            fontWeight: activeTab === "for-you" ? 700 : 500,
                        }}
                    >
                        For you
                    </button>
                    <button
                        onClick={() => setActiveTab("following")}
                        className="px-3 py-1 rounded-full text-[12px] transition-all hover:bg-secondary"
                        style={{
                            background: activeTab === "following" ? "rgba(107,143,94,0.12)" : "transparent",
                            color: activeTab === "following" ? "#6B8F5E" : "#B5B0A4",
                            fontWeight: activeTab === "following" ? 700 : 500,
                        }}
                    >
                        Following
                    </button>
                </div>
            </div>
            <DeckFeed
                posts={posts}
                onLike={handleLike}
                onRepost={handleRepost}
                onBookmark={handleBookmark}
                onReply={() => {}}
            />
        </div>
    );
}
