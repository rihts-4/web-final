import { Bell } from "lucide-react";
import { DeckFeed } from "../components/DeckFeed";

export function NotificationsPage({ posts, onLike, onRepost, onBookmark, onReply }) {
    const notifs = [
        {
            emoji: "❤️",
            user: "Amara Sol",
            action: "liked your thought",
            time: "2h",
            avatar: posts[0]?.user.avatar,
        },
        {
            emoji: "👁",
            user: "Rowan Ashby",
            action: "started following you",
            time: "4h",
            avatar: posts[1]?.user.avatar,
        },
        {
            emoji: "🔁",
            user: "Zara Finch",
            action: "re-rooted your thought",
            time: "6h",
            avatar: posts[2]?.user.avatar,
        },
        {
            emoji: "💬",
            user: "Felix Osei",
            action: 'replied: "Couldn't agree more."',
            time: "8h",
            avatar: posts[3]?.user.avatar,
        },
        {
            emoji: "❤️",
            user: "Mila Voss",
            action: "liked your thought",
            time: "1d",
            avatar: posts[4]?.user.avatar,
        },
    ];

    return (
        <div
            className="flex flex-col h-full overflow-y-auto"
            style={{ fontFamily: "'Nunito', sans-serif" }}
        >
            <div
                className="px-5 py-4 flex items-center gap-2 flex-shrink-0"
                style={{
                    borderBottom: "1px solid rgba(42,42,37,0.08)",
                }}
            >
                <Bell size={18} style={{ color: "#6B8F5E" }} />
                <h1
                    className="text-foreground text-[18px]"
                    style={{ fontWeight: 800 }}
                >
                    Ripples
                </h1>
            </div>
            {notifs.map((n, i) => (
                <div
                    key={i}
                    className="flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-secondary/40"
                    style={{
                        borderBottom: "1px solid rgba(42,42,37,0.06)",
                    }}
                >
                    <span className="text-xl flex-shrink-0">
                        {n.emoji}
                    </span>
                    <img
                        src={n.avatar}
                        alt={n.user}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                        style={{
                            outline: "2px solid rgba(107,143,94,0.2)",
                            outlineOffset: 1,
                        }}
                    />

                    <div className="flex-1 min-w-0">
                        <span
                            className="text-foreground text-[14px]"
                            style={{ fontWeight: 700 }}
                        >
                            {n.user}{" "}
                        </span>
                        <span className="text-foreground text-[14px]">
                            {n.action}
                        </span>
                        <p className="text-muted-foreground text-[12px] mt-0.5">
                            {n.time}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
