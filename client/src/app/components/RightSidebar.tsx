import { Search, TrendingUp } from "lucide-react";

const trends = [
  { topic: "#slowliving", posts: "24.8K", emoji: "🍃" },
  { topic: "#ecology", posts: "12.4K", emoji: "🌿" },
  { topic: "#mindfulness", posts: "8.9K", emoji: "🧘" },
  { topic: "#design", posts: "55K", emoji: "✏️" },
  { topic: "#sustainability", posts: "41K", emoji: "♻️" },
];

const voices = [
  { name: "Amara Sol", handle: "amarasol", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop&auto=format" },
  { name: "Zara Finch", handle: "zarafinch", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&auto=format" },
  { name: "Idris Kamara", handle: "idriskamara", avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=40&h=40&fit=crop&auto=format" },
];

export function RightSidebar() {
  return (
    <aside className="w-[300px] pl-5 py-4 flex flex-col gap-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
        <input
          type="text"
          placeholder="Search thoughts..."
          className="w-full rounded-2xl pl-10 pr-4 py-2.5 text-[14px] outline-none transition-all"
          style={{
            background: "#EAE5D8",
            color: "#2A2A25",
            border: "1.5px solid transparent",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#6B8F5E"; e.target.style.background = "#FDFAF4"; }}
          onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.background = "#EAE5D8"; }}
        />
      </div>

      {/* Trending */}
      <div className="rounded-3xl overflow-hidden" style={{ background: "#FDFAF4", border: "1px solid rgba(42,42,37,0.08)" }}>
        <div className="px-4 pt-4 pb-2 flex items-center gap-2">
          <TrendingUp size={16} style={{ color: "#6B8F5E" }} />
          <h2 className="text-foreground text-[15px]" style={{ fontWeight: 800 }}>Growing topics</h2>
        </div>
        {trends.map((t, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-secondary/60 rounded-xl mx-1">
            <span className="text-lg">{t.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-foreground text-[14px] truncate" style={{ fontWeight: 700 }}>{t.topic}</p>
              <p className="text-muted-foreground text-[12px]">{t.posts} thoughts</p>
            </div>
          </div>
        ))}
        <button className="w-full px-4 py-3 text-[13px] text-left transition-colors hover:bg-secondary/60 rounded-b-3xl" style={{ color: "#6B8F5E", fontWeight: 600 }}>
          See all topics
        </button>
      </div>

      {/* Suggested */}
      <div className="rounded-3xl overflow-hidden" style={{ background: "#FDFAF4", border: "1px solid rgba(42,42,37,0.08)" }}>
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-foreground text-[15px]" style={{ fontWeight: 800 }}>Voices to follow</h2>
        </div>
        {voices.map((v, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-secondary/60 mx-1 rounded-xl">
            <div className="flex items-center gap-2.5">
              <img src={v.avatar} alt={v.name} className="w-9 h-9 rounded-full object-cover" style={{ outline: "2px solid rgba(107,143,94,0.25)", outlineOffset: 1 }} />
              <div>
                <p className="text-foreground text-[14px]" style={{ fontWeight: 700 }}>{v.name}</p>
                <p className="text-muted-foreground text-[12px]">@{v.handle}</p>
              </div>
            </div>
            <button
              className="rounded-xl px-3 py-1.5 text-[12px] transition-all hover:opacity-90"
              style={{ background: "#6B8F5E", color: "#FDFAF4", fontWeight: 700 }}
            >
              Follow
            </button>
          </div>
        ))}
        <button className="w-full px-4 py-3 text-[13px] text-left hover:bg-secondary/60 rounded-b-3xl" style={{ color: "#6B8F5E", fontWeight: 600 }}>
          Discover more
        </button>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 px-1">
        {["Terms", "Privacy", "About"].map((item) => (
          <a key={item} href="#" className="text-[12px] hover:text-foreground transition-colors" style={{ color: "#B5B0A4" }}>
            {item}
          </a>
        ))}
        <span className="text-[12px]" style={{ color: "#B5B0A4" }}>© 2026 Grove</span>
      </div>
    </aside>
  );
}
