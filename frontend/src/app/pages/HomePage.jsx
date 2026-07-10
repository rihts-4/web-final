import { DeckFeed } from "../components/DeckFeed";

export function HomePage({ posts, onLike, onRepost, onBookmark, onReply }) {
    return (
        <div className="flex flex-col h-full">
            <div className="px-5 py-3.5 flex items-center justify-between flex-shrink-0 border-b border-border/60">
                <div>
                    <h1 className="text-foreground text-[18px] font-extrabold">
                        Your Garden
                    </h1>
                    <p className="text-muted-foreground text-[11px]">
                        Swipe right to like · swipe left to reply
                    </p>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="px-3 py-1 rounded-full text-[12px] bg-primary/15 text-primary font-bold">
                        For you
                    </span>
                    <span className="px-3 py-1 rounded-full text-[12px] text-muted-foreground font-medium cursor-pointer hover:bg-secondary transition-colors">
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
