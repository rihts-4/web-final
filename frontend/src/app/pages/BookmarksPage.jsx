import { DeckFeed } from "../components/DeckFeed";

export function BookmarksPage({ posts, onLike, onRepost, onBookmark, onReply }) {
    const savedPosts = posts.filter((p) => p.bookmarked);

    return (
        <div className="flex flex-col h-full">
            <div className="px-5 py-4 flex-shrink-0 border-b border-border/60">
                <h1 className="text-foreground text-[18px] font-extrabold">
                    Saved Thoughts
                </h1>
                <p className="text-muted-foreground text-[13px]">
                    {savedPosts.length} thought
                    {savedPosts.length !== 1 ? "s" : ""} saved
                </p>
            </div>
            {savedPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center px-8">
                    <span className="text-5xl mb-4">🌿</span>
                    <h2 className="text-foreground text-[20px] mb-2 font-extrabold">
                        Nothing saved yet
                    </h2>
                    <p className="text-muted-foreground text-[14px] leading-relaxed">
                        Tap the bookmark icon on any thought to save it
                        here.
                    </p>
                </div>
            ) : (
                <DeckFeed
                    posts={savedPosts}
                    onLike={onLike}
                    onRepost={onRepost}
                    onBookmark={onBookmark}
                    onReply={onReply}
                />
            )}
        </div>
    );
}
