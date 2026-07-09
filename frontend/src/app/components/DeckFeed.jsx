import { useState } from "react";
import { ThoughtCard } from "./ThoughtCard";

export function DeckFeed({ posts, onLike, onFollow, currentUserHandle }) {
  const [topIndex, setTopIndex] = useState(0);

  const advance = () => setTopIndex((i) => Math.min(i + 1, posts.length));
  const retreat = () => setTopIndex((i) => Math.max(i - 1, 0));
  const resetToStart = () => setTopIndex(0);

  const visible = posts.slice(topIndex, topIndex + 3);
  const isAllCaughtUp = topIndex >= posts.length && posts.length > 0;

  if (posts.length === 0 || isAllCaughtUp) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <div
          className="w-16 h-16 rounded-full mb-4 flex items-center justify-center"
          style={{ background: "rgba(107,143,94,0.15)" }}
        >
          <span className="text-2xl">🌱</span>
        </div>
        <h2
          className="text-foreground text-[22px] mb-2"
          style={{ fontWeight: 800 }}
        >
          All caught up
        </h2>
        <p className="text-muted-foreground text-[15px]">
          {posts.length === 0
            ? "You've read every thought. Come back later."
            : "You've seen all the thoughts in your feed."}
        </p>
        {isAllCaughtUp && (
          <button
            onClick={resetToStart}
            className="mt-5 px-6 py-2.5 rounded-xl text-[14px] transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "#6B8F5E",
              color: "#FDFAF4",
              fontWeight: 700,
            }}
          >
            ← Start over
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 pt-4 pb-3 flex-shrink-0">
        {posts.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === topIndex ? 20 : 6,
              height: 6,
              background:
                i === topIndex
                  ? "#6B8F5E"
                  : i < topIndex
                    ? "rgba(107,143,94,0.3)"
                    : "rgba(42,42,37,0.15)",
            }}
          />
        ))}
      </div>

      {/* Card stack */}
      <div className="relative flex-1 mx-4 mb-4">
        {[...visible].reverse().map((post, revIdx) => {
          const stackIdx = visible.length - 1 - revIdx;
          const isTop = stackIdx === 0;
          const scale = 1 - stackIdx * 0.04;
          const translateY = stackIdx * 12;
          return (
            <ThoughtCard
              key={post.id}
              post={post}
              onLike={(id) => {
                onLike(id);
              }}
              onFollow={onFollow}
              currentUserHandle={currentUserHandle}
              onSwipedAway={isTop ? advance : undefined}
              isTop={isTop}
              style={{
                transform: `scale(${scale}) translateY(${translateY}px)`,
                zIndex: visible.length - stackIdx,
                pointerEvents: isTop ? "auto" : "none",
              }}
            />
          );
        })}
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between px-6 pb-5 flex-shrink-0">
        <button
          onClick={retreat}
          disabled={topIndex === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all disabled:opacity-30"
          style={{
            borderColor: "rgba(42,42,37,0.15)",
            background: "#FDFAF4",
            fontWeight: 600,
            fontSize: 13,
            color: "#2A2A25",
          }}
        >
          ← Back
        </button>

        <div className="text-center">
          <p
            className="text-muted-foreground text-[12px]"
            style={{ fontWeight: 500 }}
          >
            {topIndex + 1} of {posts.length}
          </p>
          <p className="text-[11px] text-muted-foreground/60">
            swipe to interact
          </p>
        </div>

        <button
          onClick={advance}
          disabled={topIndex >= posts.length - 1}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all disabled:opacity-30"
          style={{
            background: "#6B8F5E",
            color: "#FDFAF4",
            fontWeight: 600,
            fontSize: 13,
            boxShadow: "0 4px 12px rgba(107,143,94,0.3)",
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
