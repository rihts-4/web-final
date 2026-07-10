import { Compass, Search } from "lucide-react";
import { HashtagList } from "../components/HashtagList";
import { DeckFeed } from "../components/DeckFeed";

export function ExplorePage({ posts, onLike, onRepost, onBookmark, onReply, selectedTopic, setSelectedTopic }) {
    if (selectedTopic) {
        return (
            <div className="flex flex-col h-full">
                <div className="px-5 py-4 flex items-center gap-3 flex-shrink-0 border-b border-border/60">
                    <button
                        onClick={() => setSelectedTopic(null)}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary transition-colors"
                    >
                        ←
                    </button>
                    <div>
                        <h1 className="text-foreground text-[18px] font-extrabold">
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
        <div className="flex flex-col h-full overflow-y-auto">
            <div className="px-5 py-4 flex-shrink-0 border-b border-border/60">
                <div className="flex items-center gap-2 mb-4">
                    <Compass size={18} className="text-primary" />
                    <h1 className="text-foreground text-[18px] font-extrabold">
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
                        className="w-full rounded-2xl pl-10 pr-4 py-2.5 text-[14px] outline-none bg-switch-background text-foreground border-[1.5px] border-transparent focus:border-primary focus:bg-card transition-all"
                    />
                </div>
            </div>

            <div className="px-5 py-5 flex flex-col gap-6">
                <div>
                    <h2 className="text-[13px] uppercase tracking-wider mb-3 text-muted-foreground font-bold">
                        Topics
                    </h2>
                    <div className="grid grid-cols-2 gap-2.5">
                        {[
                            { label: "Slow Living", emoji: "🍃", count: "24.8K" },
                            { label: "Ecology", emoji: "🌿", count: "12.4K" },
                            { label: "Design", emoji: "✏️", count: "55K" },
                            { label: "Mindfulness", emoji: "🧘", count: "8.9K" },
                            { label: "Sustainability", emoji: "♻️", count: "41K" },
                            { label: "Science", emoji: "🔬", count: "18K" },
                        ].map((cat) => (
                            <div
                                key={cat.label}
                                onClick={() => setSelectedTopic(cat.label)}
                                className="flex flex-col gap-1.5 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-md bg-card border border-border/60 hover:border-primary/35"
                            >
                                <span className="text-2xl">{cat.emoji}</span>
                                <span className="text-foreground text-[14px] font-bold">
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
