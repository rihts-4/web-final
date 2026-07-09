import { Bell, Compass, Search } from "lucide-react";
import { HashtagList } from "../components/HashtagList";
import { DeckFeed } from "../components/DeckFeed";

export function ExplorePage({ posts, onLike, onRepost, onBookmark, onReply, selectedTopic, setSelectedTopic }) {
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
                    onLike={onLike}
                    onRepost={onRepost}
                    onBookmark={onBookmark}
                    onReply={onReply}
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
