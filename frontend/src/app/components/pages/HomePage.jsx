import { useState, useEffect } from "react";
import { DeckFeed } from "../DeckFeed";
import { useUser } from "../../context/UserContext";
import { api, IMAGE_BASE } from "../../services/api";

export function HomePage() {
    const { user } = useUser();
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("for-you");
    const [postError, setPostError] = useState(null);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const feedPosts = activeTab === "for-you" 
                    ? await api.feed.getPublic()
                    : await api.feed.getPersonal();
                
                const transformedPosts = feedPosts.map((post) => ({
                    id: String(post.id),
                    userId: post.user_id,
                    user: {
                        name: post.display_name,
                        handle: post.username,
                    },
                    content: post.content,
                    image: post.image_path ? `${IMAGE_BASE}${post.image_path}` : null,
                    timestamp: new Date(post.created_at).toLocaleDateString(),
                    likes: post.like_count || 0,
                    liked: post.liked === 1,
                    isFollowing: post.is_following === 1,
                }));
                setPosts(transformedPosts);
            } catch (err) {
                console.error("Failed to load posts:", err);
            }
        };

        loadPosts();
    }, [activeTab]);

    const handleLike = async (id) => {
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
    };

    const handleRepost = async (id) => {
        setPostError("Repost feature not available");
    };

    const handleBookmark = async (id) => {
        setPostError("Bookmark feature not available");
    };

    const handleDelete = async (id) => {
        try {
            await api.posts.delete(id);
            setPosts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            setPostError(err.message);
        }
    };

    const handleFollow = async (id) => {
        const post = posts.find((p) => p.id === id);
        if (!post) return;
        if (post.isFollowing) {
            await api.users.unfollow(post.userId);
            setPosts((prev) =>
                prev.map((p) =>
                    p.id === id ? { ...p, isFollowing: false } : p
                ),
            );
        } else {
            await api.users.follow(post.userId);
            setPosts((prev) =>
                prev.map((p) =>
                    p.id === id ? { ...p, isFollowing: true } : p
                ),
            );
        }
    };

    return (
        <div className="flex flex-col h-full font-['Nunito',sans-serif]">
            <div className="px-5 py-3.5 flex items-center justify-between flex-shrink-0 border-b border-border/60">
                <h1 className="text-foreground text-lg font-extrabold">
                    Your Garden
                </h1>
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setActiveTab("for-you")}
                        className={`px-3 py-1 rounded-full text-xs transition-all ${
                            activeTab === "for-you"
                                ? "bg-primary/12 text-primary font-bold"
                                : "bg-transparent text-switch-background font-medium"
                        }`}
                    >
                        For you
                    </button>
                    <button
                        onClick={() => setActiveTab("following")}
                        className={`px-3 py-1 rounded-full text-xs transition-all hover:bg-secondary ${
                            activeTab === "following"
                                ? "bg-primary/12 text-primary font-bold"
                                : "bg-transparent text-switch-background font-medium"
                        }`}
                    >
                        Following
                    </button>
                </div>
            </div>
            {postError && (
                <p className="px-5 py-2 text-xs text-destructive font-semibold">
                    {postError}
                </p>
            )}
            <DeckFeed
                posts={posts}
                onLike={handleLike}
                onFollow={handleFollow}
                onRepost={handleRepost}
                onBookmark={handleBookmark}
                onReply={() => {}}
                currentUserHandle={user?.username}
            />
        </div>
    );
}
