import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { api } from "../../services/api";

export function NotificationsPage() {
    const [notifs, setNotifs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const data = await api.notifications.get();
                setNotifs(data);
            } catch (err) {
                console.error("Failed to load notifications:", err);
                setNotifs([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadNotifications();
    }, []);

    const mockNotifs = [
        {
            emoji: "❤️",
            user: "Amara Sol",
            handle: "amarasol",
            action: "liked your thought",
            time: "2h",
        },
        {
            emoji: "👁",
            user: "Rowan Ashby",
            handle: "rowanashby",
            action: "started following you",
            time: "4h",
        },
        {
            emoji: "🔁",
            user: "Zara Finch",
            handle: "zarafinch",
            action: "re-rooted your thought",
            time: "6h",
        },
        {
            emoji: "💬",
            user: "Felix Osei",
            handle: "felixosei",
            action: 'replied: "Couldn\'t agree more."',
            time: "8h",
        },
        {
            emoji: "❤️",
            user: "Mila Voss",
            handle: "milavoss",
            action: "liked your thought",
            time: "1d",
        },
    ];

    const displayNotifs = notifs.length > 0 ? notifs : mockNotifs;

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
            {isLoading ? (
                <div className="flex items-center justify-center flex-1">
                    <p className="text-muted-foreground">Loading notifications...</p>
                </div>
            ) : displayNotifs.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center px-8">
                    <span className="text-5xl mb-4">🔔</span>
                    <h2
                        className="text-foreground text-[18px] mb-2"
                        style={{ fontWeight: 800 }}
                    >
                        No notifications yet
                    </h2>
                    <p className="text-muted-foreground text-[14px] leading-relaxed">
                        When someone interacts with you, you'll see it here.
                    </p>
                </div>
            ) : (
                displayNotifs.map((n, i) => (
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
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs"
                        style={{
                            background: "#6B8F5E",
                            color: "#FDFAF4",
                            outline: "2px solid rgba(107,143,94,0.2)",
                            outlineOffset: 1,
                        }}
                    >
                        {n.handle?.charAt(0).toUpperCase() || "U"}
                    </div>

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
                ))
            )}
        </div>
    );
}
