import { useState, useEffect } from "react";
import { Compass, Search } from "lucide-react";
import { api } from "../../services/api";
import { HashtagList } from "../HashtagList";

export function ExplorePage() {
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [trendingTags, setTrendingTags] = useState([]);

    useEffect(() => {
        const loadTrendingTags = async () => {
            try {
                const publicPosts = await api.feed.getPublic();
                const tagMap = {};
                
                publicPosts.forEach((post) => {
                    const content = post.content || "";
                    const matches = content.match(/#[a-zA-Z0-9_]+/g) || [];
                    matches.forEach((tag) => {
                        const cleanTag = tag.toLowerCase();
                        tagMap[cleanTag] = (tagMap[cleanTag] || 0) + 1;
                    });
                });
                
                const sortedTags = Object.entries(tagMap)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8)
                    .map(([tag]) => tag.substring(1));
                
                setTrendingTags(sortedTags);
            } catch (err) {
                console.error("Failed to load trending tags:", err);
                setTrendingTags([]);
            }
        };

        loadTrendingTags();
    }, []);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults(null);
            return;
        }
        
        try {
            setIsSearching(true);
            const results = await api.search.query(searchQuery);
            setSearchResults(results);
        } catch (err) {
            console.error("Search failed:", err);
            setSearchResults({ posts: [], users: [] });
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
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
                {searchResults && (
                    <div>
                        <h2
                            className="text-[13px] uppercase tracking-wider mb-3"
                            style={{ color: "#7D7D72", fontWeight: 700 }}
                        >
                            Search Results
                        </h2>
                        
                        {searchResults.posts && searchResults.posts.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-[12px] font-bold text-muted-foreground mb-2">Posts</h3>
                                {searchResults.posts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="p-3 rounded-xl mb-2 cursor-pointer transition-colors hover:bg-secondary/40"
                                        style={{ background: "#FDFAF4", border: "1px solid rgba(42,42,37,0.08)" }}
                                    >
                                        <p className="text-foreground text-[13px] line-clamp-2">{post.content}</p>
                                        <p className="text-muted-foreground text-[11px] mt-1">by @{post.user.username}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {searchResults.users && searchResults.users.length > 0 && (
                            <div>
                                <h3 className="text-[12px] font-bold text-muted-foreground mb-2">Users</h3>
                                {searchResults.users.map((u) => (
                                    <div
                                        key={u.id}
                                        className="p-3 rounded-xl mb-2 cursor-pointer transition-colors hover:bg-secondary/40"
                                        style={{ background: "#FDFAF4", border: "1px solid rgba(42,42,37,0.08)" }}
                                    >
                                        <p className="text-foreground text-[13px] font-bold">{u.display_name}</p>
                                        <p className="text-muted-foreground text-[11px]">@{u.username}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {(!searchResults.posts || searchResults.posts.length === 0) &&
                            (!searchResults.users || searchResults.users.length === 0) && (
                            <p className="text-muted-foreground text-[13px]">No results found</p>
                        )}
                    </div>
                )}

                {!searchResults && (
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

                    <HashtagList title="Trending tags" />
                </div>
                )}
            </div>
        </div>
    );
}
