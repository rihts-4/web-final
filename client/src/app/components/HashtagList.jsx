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
        <h3
          className="text-[13px] uppercase tracking-wider mb-3 px-1"
          style={{ fontWeight: 700, color: "#7D7D72", letterSpacing: "0.08em" }}
        >
          {title}
        </h3>
      )}

      {compact ? (
        /* Pill layout for sidebar / compact areas */
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag.name}
              onClick={() => onTagClick?.(tag.name)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] transition-all hover:opacity-80 active:scale-95"
              style={{
                background: tag.trending
                  ? "rgba(107,143,94,0.15)"
                  : "rgba(42,42,37,0.06)",
                color: tag.trending ? "#6B8F5E" : "#5A5A52",
                fontWeight: 600,
                border: tag.trending
                  ? "1px solid rgba(107,143,94,0.3)"
                  : "1px solid rgba(42,42,37,0.1)",
              }}
            >
              <span>{tag.emoji}</span>
              <span>#{tag.name}</span>
              {tag.trending && (
                <span
                  className="text-[10px]"
                  style={{ color: "#6B8F5E", opacity: 0.7 }}
                >
                  ↑
                </span>
              )}
            </button>
          ))}
        </div>
      ) : (
        /* Row layout for explore pages */
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
                  <span
                    className="text-foreground text-[14px]"
                    style={{ fontWeight: 700 }}
                  >
                    #{tag.name}
                  </span>
                  {tag.trending && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{
                        background: "rgba(107,143,94,0.12)",
                        color: "#6B8F5E",
                        fontWeight: 700,
                      }}
                    >
                      Trending
                    </span>
                  )}
                </div>
                <span className="text-muted-foreground text-[12px]">
                  {fmt(tag.count)} thoughts
                </span>
              </div>
              <span className="text-muted-foreground text-[12px] flex-shrink-0">
                #{i + 1}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
