import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { DeckFeed } from "./components/DeckFeed";
import { ComposeModal } from "./components/ComposeModal";
import { RightSidebar } from "./components/RightSidebar";
import { ProfilePage } from "./components/ProfilePage";
import { INITIAL_POSTS, ThoughtPost } from "./data/posts";
import { Bell, Compass, Search } from "lucide-react";

const CURRENT_USER = {
  name: "Alex Rivera",
  handle: "alexrivera",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&auto=format",
};

export default function App() {
  const [posts, setPosts] = useState<ThoughtPost[]>(INITIAL_POSTS);
  const [activeNav, setActiveNav] = useState("home");
  const [showCompose, setShowCompose] = useState(false);
  const [nextId, setNextId] = useState(100);

  const handleLike = (id: string) =>
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p)));

  const handleRepost = (id: string) =>
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, reposted: !p.reposted } : p)));

  const handleBookmark = (id: string) =>
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p)));

  const handlePost = (content: string) => {
    const newPost: ThoughtPost = {
      id: String(nextId),
      user: CURRENT_USER,
      content,
      timestamp: "just now",
      likes: 0,
      replies: 0,
      reposts: 0,
      liked: false,
    };
    setPosts((prev) => [newPost, ...prev]);
    setNextId((n) => n + 1);
  };

  const savedPosts = posts.filter((p) => p.bookmarked);

  const renderMain = () => {
    if (activeNav === "profile") {
      return <ProfilePage user={CURRENT_USER} />;
    }

    if (activeNav === "notifications") {
      const notifs = [
        { emoji: "🌱", user: "Amara Sol", action: "sprouted your thought", time: "2h", avatar: INITIAL_POSTS[0].user.avatar },
        { emoji: "👁", user: "Rowan Ashby", action: "started following you", time: "4h", avatar: INITIAL_POSTS[1].user.avatar },
        { emoji: "🔁", user: "Zara Finch", action: "re-rooted your thought", time: "6h", avatar: INITIAL_POSTS[2].user.avatar },
        { emoji: "💬", user: "Felix Osei", action: "replied: \"Couldn't agree more.\"", time: "8h", avatar: INITIAL_POSTS[3].user.avatar },
        { emoji: "🌱", user: "Mila Voss", action: "sprouted your thought", time: "1d", avatar: INITIAL_POSTS[4].user.avatar },
      ];
      return (
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="px-5 py-4 flex items-center gap-2 flex-shrink-0" style={{ borderBottom: "1px solid rgba(42,42,37,0.08)" }}>
            <Bell size={18} style={{ color: "#6B8F5E" }} />
            <h1 className="text-foreground text-[18px]" style={{ fontWeight: 800 }}>Ripples</h1>
          </div>
          {notifs.map((n, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-secondary/40" style={{ borderBottom: "1px solid rgba(42,42,37,0.06)" }}>
              <span className="text-xl flex-shrink-0">{n.emoji}</span>
              <img src={n.avatar} alt={n.user} className="w-9 h-9 rounded-full object-cover flex-shrink-0" style={{ outline: "2px solid rgba(107,143,94,0.2)", outlineOffset: 1 }} />
              <div className="flex-1 min-w-0">
                <span className="text-foreground text-[14px]" style={{ fontWeight: 700 }}>{n.user} </span>
                <span className="text-foreground text-[14px]">{n.action}</span>
                <p className="text-muted-foreground text-[12px] mt-0.5">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeNav === "explore") {
      return (
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="px-5 py-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(42,42,37,0.08)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Compass size={18} style={{ color: "#6B8F5E" }} />
              <h1 className="text-foreground text-[18px]" style={{ fontWeight: 800 }}>Explore</h1>
            </div>
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search thoughts..."
                className="w-full rounded-2xl pl-10 pr-4 py-2.5 text-[14px] outline-none"
                style={{ background: "#EAE5D8", color: "#2A2A25", border: "1.5px solid transparent" }}
                onFocus={(e) => { e.target.style.borderColor = "#6B8F5E"; e.target.style.background = "#FDFAF4"; }}
                onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.background = "#EAE5D8"; }}
              />
            </div>
          </div>
          <div className="px-5 py-4 grid grid-cols-2 gap-3">
            {[
              { label: "Slow Living", emoji: "🍃", count: "24.8K thoughts" },
              { label: "Ecology", emoji: "🌿", count: "12.4K thoughts" },
              { label: "Design", emoji: "✏️", count: "55K thoughts" },
              { label: "Mindfulness", emoji: "🧘", count: "8.9K thoughts" },
              { label: "Sustainability", emoji: "♻️", count: "41K thoughts" },
              { label: "Science", emoji: "🔬", count: "18K thoughts" },
            ].map((cat) => (
              <div
                key={cat.label}
                className="flex flex-col gap-1.5 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-md"
                style={{ background: "#FDFAF4", border: "1px solid rgba(42,42,37,0.08)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(107,143,94,0.35)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(42,42,37,0.08)"; }}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-foreground text-[14px]" style={{ fontWeight: 700 }}>{cat.label}</span>
                <span className="text-muted-foreground text-[12px]">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeNav === "bookmarks") {
      return (
        <div className="flex flex-col h-full">
          <div className="px-5 py-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(42,42,37,0.08)" }}>
            <h1 className="text-foreground text-[18px]" style={{ fontWeight: 800 }}>Saved Thoughts</h1>
            <p className="text-muted-foreground text-[13px]">{savedPosts.length} thought{savedPosts.length !== 1 ? "s" : ""} saved</p>
          </div>
          {savedPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center px-8">
              <span className="text-5xl mb-4">🌿</span>
              <h2 className="text-foreground text-[20px] mb-2" style={{ fontWeight: 800 }}>Nothing saved yet</h2>
              <p className="text-muted-foreground text-[14px] leading-relaxed">Save thoughts that resonate with you to find them here.</p>
            </div>
          ) : (
            <DeckFeed posts={savedPosts} onLike={handleLike} onRepost={handleRepost} onBookmark={handleBookmark} />
          )}
        </div>
      );
    }

    // Home — deck feed
    return (
      <div className="flex flex-col h-full">
        <div className="px-5 py-3.5 flex items-center justify-between flex-shrink-0" style={{ borderBottom: "1px solid rgba(42,42,37,0.08)" }}>
          <div>
            <h1 className="text-foreground text-[18px]" style={{ fontWeight: 800 }}>Your Garden</h1>
            <p className="text-muted-foreground text-[12px]">Swipe right to sprout · left to reply</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="px-3 py-1 rounded-full text-[12px]" style={{ background: "rgba(107,143,94,0.12)", color: "#6B8F5E", fontWeight: 700 }}>
              For you
            </div>
            <div className="px-3 py-1 rounded-full text-[12px] text-muted-foreground cursor-pointer hover:bg-secondary transition-colors" style={{ fontWeight: 500 }}>
              Following
            </div>
          </div>
        </div>
        <DeckFeed posts={posts} onLike={handleLike} onRepost={handleRepost} onBookmark={handleBookmark} />
      </div>
    );
  };

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: "#F4F0E6", fontFamily: "'Nunito', sans-serif" }}>
      <Sidebar
        activeTab={activeNav}
        onTabChange={setActiveNav}
        onCompose={() => setShowCompose(true)}
        currentUser={CURRENT_USER}
      />

      {/* Main area */}
      <main className="flex-1 min-w-0 flex overflow-hidden" style={{ borderRight: "1px solid rgba(42,42,37,0.1)" }}>
        <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
          {renderMain()}
        </div>
      </main>

      {/* Right sidebar */}
      <div className="hidden lg:flex flex-col overflow-y-auto py-4">
        <RightSidebar />
      </div>

      {showCompose && (
        <ComposeModal
          onClose={() => setShowCompose(false)}
          onPost={handlePost}
          currentUser={CURRENT_USER}
        />
      )}
    </div>
  );
}
