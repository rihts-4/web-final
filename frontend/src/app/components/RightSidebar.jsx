import { TrendingUp } from "lucide-react";

export function RightSidebar({ hashtags, users, onTopicClick }) {
  return (
    <aside className="w-[300px] pl-5 flex flex-col gap-5">
      {hashtags.length > 0 && (
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
          {hashtags.map((t, i) => (
            <div
              key={i}
              onClick={() => onTopicClick && onTopicClick(t.tag)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-secondary/60 rounded-xl mx-1"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  background: "rgba(107,143,94,0.12)",
                  color: "#6B8F5E",
                }}
              >
                #
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-foreground text-[14px] truncate"
                  style={{ fontWeight: 700 }}
                >
                  #{t.tag}
                </p>
                <p className="text-muted-foreground text-[12px]">
                  {t.count} {t.count === 1 ? "thought" : "thoughts"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {users.length > 0 && (
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "#FDFAF4",
            border: "1px solid rgba(42,42,37,0.08)",
          }}
        >
          <div className="px-4 pt-4 pb-2">
            <h2
              className="text-foreground text-[15px]"
              style={{ fontWeight: 800 }}
            >
              Top posters
            </h2>
          </div>
          {users.map((u, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-4 py-3 mx-1 rounded-xl"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs"
                style={{
                  background: "#6B8F5E",
                  color: "#FDFAF4",
                  outline: "2px solid rgba(107,143,94,0.25)",
                  outlineOffset: 1,
                }}
              >
                {u.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-foreground text-[14px] truncate"
                  style={{ fontWeight: 700 }}
                >
                  {u.display_name}
                </p>
                <p className="text-muted-foreground text-[12px]">
                  @{u.username} · {u.post_count}{" "}
                  {u.post_count === 1 ? "post" : "posts"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
