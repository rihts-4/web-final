import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { api } from "../../services/api";

function timeAgo(dateStr) {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = Math.max(0, now - then);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d`;
    return `${Math.floor(days / 30)}mo`;
}

function formatNotif(n) {
    const emojiMap = {
        like: "❤️",
        follow: "👤",
        reply: "💬",
    };
    const actionMap = {
        like: n.post_content ? `liked your thought: "${n.post_content.slice(0, 60)}${n.post_content.length > 60 ? "…" : ""}"` : "liked your thought",
        follow: "started following you",
        reply: `replied: "${n.post_content?.slice(0, 60) || ""}${n.post_content?.length > 60 ? "…" : ""}"`,
    };
    return {
        id: n.id,
        emoji: emojiMap[n.type] || "🔔",
        user: n.display_name,
        handle: n.username,
        action: actionMap[n.type] || "interacted with you",
        time: timeAgo(n.created_at),
    };
}

export function NotificationsPage() {
    const [notifs, setNotifs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const data = await api.notifications.get();
                setNotifs(data.map(formatNotif));
            } catch (err) {
                console.error("Failed to load notifications:", err);
                setNotifs([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadNotifications();
    }, []);

    return (
        <div className="flex flex-col h-full overflow-y-auto font-['Nunito',sans-serif]">
            <div className="px-5 py-4 flex items-center gap-2 flex-shrink-0 border-b border-border/60">
                <Bell size={18} className="text-primary" />
                <h1 className="text-foreground text-lg font-extrabold">
                    Ripples
                </h1>
            </div>
            {isLoading ? (
                <div className="flex items-center justify-center flex-1">
                    <p className="text-muted-foreground">Loading notifications...</p>
                </div>
            ) : notifs.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center px-8">
                    <span className="text-5xl mb-4">🔔</span>
                    <h2 className="text-foreground text-lg mb-2 font-extrabold">
                        No notifications yet
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        When someone interacts with you, you'll see it here.
                    </p>
                </div>
            ) : (
                notifs.map((n) => (
                <div
                    key={n.id}
                    className="flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-secondary/40 border-b border-[rgba(42,42,37,0.06)]"
                >
                    <span className="text-xl flex-shrink-0">
                        {n.emoji}
                    </span>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs bg-primary text-card outline outline-2 outline-primary/20 outline-offset-1">
                        {n.handle?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div className="flex-1 min-w-0">
                        <span className="text-foreground text-sm font-bold">
                            {n.user}{" "}
                        </span>
                        <span className="text-foreground text-sm">
                            {n.action}
                        </span>
                        <p className="text-muted-foreground text-xs mt-0.5">
                            {n.time}
                        </p>
                    </div>
                </div>
                ))
            )}
        </div>
    );
}
