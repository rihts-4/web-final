import { useNavigate } from "react-router-dom";
import { Search, TrendingUp } from "lucide-react";

const trends = [
  { topic: "#slowliving", posts: "24.8K", emoji: "🍃" },
  { topic: "#ecology", posts: "12.4K", emoji: "🌿" },
  { topic: "#mindfulness", posts: "8.9K", emoji: "🧘" },
  { topic: "#design", posts: "55K", emoji: "✏️" },
  { topic: "#sustainability", posts: "41K", emoji: "♻️" },
];

const voices = [
  {
    name: "Amara Sol",
    handle: "amarasol",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop&auto=format",
  },
  {
    name: "Zara Finch",
    handle: "zarafinch",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&auto=format",
  },
  {
    name: "Idris Kamara",
    handle: "idriskamara",
    avatar:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=40&h=40&fit=crop&auto=format",
  },
];

export function RightSidebar({ onTopicClick }) {
  const navigate = useNavigate();

  const handleTopicClick = (topic) => {
    if (onTopicClick) {
        onTopicClick(topic);
    }
    navigate("/explore");
  };

  return (
    <aside className="w-[300px] pl-5 py-4 flex flex-col gap-5">
      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={15}
        />
        <input
          type="text"
          placeholder="Search thoughts..."
          className="w-full rounded-2xl pl-10 pr-4 py-2.5 text-[14px] outline-none transition-all"
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

      {/* Trending */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: "#FDFAF4",
          border: "1px solid rgba(42,42,37,0.08)",
        }}
      >
        <div className="px-4 pt-4 pb-2 flex items-center gap-2">
          <TrendingUp size={16} style={{ color: "#6B8F5E" }} />
          <h2
            className="text-foreground text-[15px]"
            style={{ fontWeight: 800 }}
          >
            Growing topics
          </h2>
        </div>
        {trends.map((t, i) => (
          <div
            key={i}
            onClick={() => handleTopicClick(t.topic)}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-secondary/60 rounded-xl mx-1"
          >
            <span className="text-lg">{t.emoji}</span>
            <div className="flex-1 min-w-0">
              <p
                className="text-foreground text-[14px] truncate"
                style={{ fontWeight: 700 }}
              >
                {t.topic}
              </p>
              <p className="text-muted-foreground text-[12px]">
                {t.posts} thoughts
              </p>
            </div>
          </div>
        ))}
        <button
          className="w-full px-4 py-3 text-[13px] text-left transition-colors hover:bg-secondary/60 rounded-b-3xl"
          style={{ color: "#6B8F5E", fontWeight: 600 }}
        >
          Show more
        </button>
      </div>
    </aside>
  );
}
