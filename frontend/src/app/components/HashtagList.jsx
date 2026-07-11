const TAGS = [
  { name: "slowliving", count: 24800, emoji: "🍃", trending: true },
  { name: "ecology", count: 12400, emoji: "🌿", trending: true },
  { name: "mindfulness", count: 8900, emoji: "🧘", trending: false },
  { name: "design", count: 55000, emoji: "✏️", trending: false },
  { name: "sustainability", count: 41000, emoji: "♻️", trending: true },
  { name: "science", count: 18000, emoji: "🔬", trending: false },
  { name: "writing", count: 9200, emoji: "📝", trending: false },
  { name: "nature", count: 33000, emoji: "🌳", trending: false },
];

function fmt(n) {
  return n >= 1000
    ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "K"
    : String(n);
}

export function HashtagList({
  title = "Related tags",
  compact = false,
  onTagClick,
}) {
  return (
    <div>
      {title && (
        <h3 className="text-xs uppercase tracking-[0.08em] mb-3 px-1 font-bold text-muted-foreground">
          {title}
        </h3>
      )}

      {compact ? (
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag.name}
              onClick={() => onTagClick?.(tag.name)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all hover:opacity-80 active:scale-95 font-semibold ${
                tag.trending
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "bg-[rgba(42,42,37,0.06)] text-[#5A5A52] border border-[rgba(42,42,37,0.1)]"
              }`}
            >
              <span>{tag.emoji}</span>
              <span>#{tag.name}</span>
              {tag.trending && (
                <span className="text-[10px] text-primary opacity-70">↑</span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-0.5">
          {TAGS.map((tag, i) => (
            <button
              key={tag.name}
              onClick={() => onTagClick?.(tag.name)}
              className="flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors hover:bg-secondary/50 text-left w-full"
            >
              <span className="text-lg w-6 flex-shrink-0">{tag.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-foreground text-sm font-bold">
                    #{tag.name}
                  </span>
                  {tag.trending && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/12 text-primary font-bold">
                      Trending
                    </span>
                  )}
                </div>
                <span className="text-muted-foreground text-xs">
                  {fmt(tag.count)} thoughts
                </span>
              </div>
              <span className="text-muted-foreground text-xs flex-shrink-0">
                #{i + 1}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
