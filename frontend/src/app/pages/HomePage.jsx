import { DeckFeed } from "../components/DeckFeed";

export function HomePage({ posts, onLike, onRepost, onBookmark, onReply }) {
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
                onLike={onLike}
                onRepost={onRepost}
                onBookmark={onBookmark}
                onReply={onReply}
            />
        </div>
    );
}
