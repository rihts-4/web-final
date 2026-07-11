import { useState, useRef, useCallback } from "react";
import {
    Heart,
    UserPlus,
    Play,
    Pause,
    Volume2,
} from "lucide-react";

function formatCount(n) {
    if (n >= 1_000_000)
        return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return String(n);
}

/* ── Audio Player ─────────────────────────────────────── */
function AudioPlayer({ label, duration }) {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const timer = useRef(null);

    const toggle = (e) => {
        e.stopPropagation();
        if (playing) {
            if (timer.current) clearInterval(timer.current);
            setPlaying(false);
        } else {
            setPlaying(true);
            timer.current = setInterval(() => {
                setProgress((p) => {
                    if (p >= 100) {
                        if (timer.current) clearInterval(timer.current);
                        setPlaying(false);
                        return 0;
                    }
                    return p + 1;
                });
            }, 120);
        }
    };

    const bars = [
        3, 5, 4, 7, 3, 6, 4, 8, 5, 3, 6, 4, 7, 3, 5, 6, 4, 3, 7, 5, 4, 6, 3, 5,
    ];

    return (
        <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3 mt-3 cursor-pointer group select-none bg-primary/10 border border-primary/25"
            onClick={toggle}
        >
            <button
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 bg-primary"
            >
                {playing ? (
                    <Pause size={13} fill="white" className="text-white" />
                ) : (
                    <Play size={13} fill="white" className="text-white ml-0.5" />
                )}
            </button>

            <div className="flex-1 min-w-0">
                <p className="text-xs mb-1.5 truncate text-[#5A5A52]">
                    {label}
                </p>
                <div className="relative h-5 flex items-center">
                    <div className="absolute inset-0 flex items-center gap-px">
                        {bars.map((h, i) => (
                            <div
                                key={i}
                                className={`flex-1 rounded-full ${
                                    (i / bars.length) * 100 <= progress
                                        ? "bg-primary"
                                        : "bg-[rgba(42,42,37,0.12)]"
                                }`}
                                style={{ height: Math.max(h * 2, 4) }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0 text-switch-background">
                <Volume2 size={13} strokeWidth={2.2} />
                <span className="text-[11px]">{duration}</span>
            </div>
        </div>
    );
}

/* ── ThoughtCard ─────────────────────────────────────── */
export function ThoughtCard({
    post,
    onLike,
    onFollow,
    onSwipedAway,
    style,
    isTop,
    currentUserHandle,
}) {
    const cardRef = useRef(null);
    const origin = useRef(null);
    const moved = useRef(false);
    const [dragX, setDragX] = useState(0);
    const [dragging, setDragging] = useState(false);

    const [gesture, setGesture] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [actionError, setActionError] = useState(null);

    const THRESHOLD = 90;

    const onPointerDown = useCallback(
        (e) => {
            if (!isTop) return;
            if (e.target.closest("button") || e.target.closest("a")) return;
            origin.current = { x: e.clientX, y: e.clientY };
            moved.current = false;
            setDragging(true);
            cardRef.current?.setPointerCapture(e.pointerId);
        },
        [isTop],
    );

    const onPointerMove = useCallback(
        (e) => {
            if (!origin.current || !isTop) return;
            const dx = e.clientX - origin.current.x;
            const dy = Math.abs(e.clientY - origin.current.y);
            if (Math.abs(dx) > 8 || dy > 8) moved.current = true;
            setDragX(dx);
            if (dx > 30) setGesture("like");
            else if (dx < -30) setGesture("skip");
            else setGesture(null);
        },
        [isTop],
    );

    const onPointerUp = useCallback(() => {
        if (!origin.current || !isTop) return;
        if (moved.current) {
            if (dragX > THRESHOLD) {
                if (!actionLoading) {
                    setActionError(null);
                    setActionLoading('like');
                    onLike(post.id)
                        .catch((err) => setActionError(err.message))
                        .finally(() => setActionLoading(null));
                }
            } else if (dragX < -THRESHOLD) {
                onSwipedAway?.();
            }
        }
        setDragX(0);
        setDragging(false);
        setGesture(null);
        origin.current = null;
    }, [dragX, isTop, onLike, onSwipedAway, post.id, actionLoading]);

    const handleLikeAction = async (e) => {
        e.stopPropagation();
        if (actionLoading) return;
        setActionError(null);
        setActionLoading('like');
        try {
            await onLike(post.id);
        } catch (err) {
            setActionError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleFollowAction = async (e) => {
        e.stopPropagation();
        if (actionLoading) return;
        setActionError(null);
        setActionLoading('follow');
        try {
            await onFollow(post.id);
        } catch (err) {
            setActionError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const rotation = dragging ? dragX * 0.06 : 0;
    const washAlpha = Math.max(0, Math.abs(dragX) - 30) / 220;
    const gestureAlpha = gesture ? Math.min(1, (Math.abs(dragX) - 30) / 60) : 0;

    return (
        <div
            ref={cardRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className={`absolute inset-0 rounded-3xl overflow-hidden select-none bg-card ${
                isTop
                    ? "shadow-[0_20px_60px_rgba(42,42,37,0.13),0_4px_16px_rgba(42,42,37,0.07)]"
                    : "shadow-[0_8px_24px_rgba(42,42,37,0.07)]"
            }`}
            style={{
                ...style,
                transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
                transition: dragging ? "none" : "transform 0.45s cubic-bezier(0.34,1.4,0.64,1)",
                cursor: isTop ? (dragging ? "grabbing" : "grab") : "default",
                touchAction: "none",
            }}
        >
            {/* ── Colour wash (z:1) ─────────────────────────── */}
            {dragging && gesture && (
                <div
                    className="absolute inset-0 rounded-3xl pointer-events-none z-1"
                    style={{
                        background:
                            gesture === "like"
                                ? `rgba(107,143,94,${washAlpha})`
                                : `rgba(192,69,58,${washAlpha * 0.4})`,
                    }}
                />
            )}

            {/* ── Badge layer (z:10) ──────────────────────────── */}
            {isTop && (
                <div
                    className="absolute inset-0 pointer-events-none z-10"
                    aria-hidden
                >
                    {/* Like badge — top-left */}
                    <div
                        className="absolute top-4 left-3"
                        style={{
                            opacity: gesture === "like" ? gestureAlpha : 0,
                            transform: `rotate(-14deg) scale(${0.82 + gestureAlpha * 0.18})`,
                            transition: dragging ? "none" : "opacity 0.15s",
                        }}
                    >
                        <span className="inline-flex items-center gap-1.5 px-[14px] py-[7px] rounded-xl bg-card border-[2.5px] border-primary shadow-[0_4px_18px_rgba(107,143,94,0.28)] font-['Nunito',sans-serif] text-sm font-extrabold text-primary">
                            ❤️ Like
                        </span>
                    </div>

                    {/* Skip badge — top-right */}
                    <div
                        className="absolute top-4 right-3"
                        style={{
                            opacity: gesture === "skip" ? gestureAlpha : 0,
                            transform: `rotate(14deg) scale(${0.82 + gestureAlpha * 0.18})`,
                            transition: dragging ? "none" : "opacity 0.15s",
                        }}
                    >
                        <span className="inline-flex items-center gap-1.5 px-[14px] py-[7px] rounded-xl bg-card border-[2.5px] border-destructive shadow-[0_4px_18px_rgba(192,69,58,0.28)] font-['Nunito',sans-serif] text-sm font-extrabold text-destructive">
                            → Skip
                        </span>
                    </div>
                </div>
            )}

            {/* ── Card content (z:2) ──────────────────────────── */}
            <div className="h-full flex flex-col overflow-y-auto p-5 pb-4 relative z-2">
                {/* User header */}
                <div className="flex items-center gap-3 mb-4">
                    <UserAvatar
                        handle={post.user.handle}
                        name={post.user.name}
                        size={44}
                    />

                    <div className="flex-1 min-w-0">
                        <span className="block text-foreground text-sm md:text-[15px] truncate font-bold">
                            {post.user.name}
                        </span>
                        <span className="text-muted-foreground text-xs md:text-[13px]">
                            @{post.user.handle} · {post.timestamp}
                        </span>
                    </div>
                </div>

                {/* Post text */}
                <p className="text-foreground text-sm md:text-base leading-relaxed flex-1 mb-4 whitespace-pre-wrap font-['Nunito',sans-serif] font-normal">
                    {post.content}
                </p>

                {/* Hashtag row */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.map((t) => (
                            <span
                                key={t}
                                className="text-[11px] md:text-[12px] px-2.5 py-1 rounded-full bg-primary/12 text-primary font-semibold"
                            >
                                #{t}
                            </span>
                        ))}
                    </div>
                )}

                {/* Image */}
                {post.image && (
                    <div className="rounded-2xl overflow-hidden mb-4">
                        <img
                            src={post.image}
                            alt=""
                            className="w-full max-h-[300px] object-contain bg-[#EDE9DD]"
                        />
                    </div>
                )}

                {/* Audio */}
                {post.audioLabel && (
                    <AudioPlayer
                        label={post.audioLabel}
                        duration={post.audioDuration}
                    />
                )}

                {/* ── Action bar ───────────────────────────────────── */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
                    <ActionBtn
                        onClick={handleLikeAction}
                        icon={
                            <Heart
                                size={19}
                                strokeWidth={2.4}
                                fill={post.liked ? "currentColor" : "none"}
                            />
                        }
                        label={actionLoading === 'like' ? "..." : formatCount(post.likes)}
                        activeColor={post.liked ? "#C0453A" : null}
                        tooltip="Like — swipe right →"
                        disabled={!!actionLoading}
                    />

                    {currentUserHandle !== post.user.handle && (
                        <ActionBtn
                            onClick={handleFollowAction}
                            icon={<UserPlus size={19} strokeWidth={2.4} />}
                            label={actionLoading === 'follow' ? "..." : (post.isFollowing ? "Unfollow" : "Follow")}
                            activeColor={post.isFollowing ? "#6B8F5E" : null}
                            tooltip={post.isFollowing ? "Unfollow this user" : "Follow this user"}
                            disabled={!!actionLoading}
                        />
                    )}

                    <span className="text-[10px] whitespace-nowrap text-[#D4CFC6] font-semibold font-['Nunito',sans-serif]">
                        ← swipe →
                    </span>
                </div>
                {actionError && (
                    <p className="mt-2 text-xs text-destructive font-semibold">
                        {actionError}
                    </p>
                )}
            </div>
        </div>
    );
}

/* ── UserAvatar ───────────────────────────────────────── */

export function UserAvatar({ handle, name, size = 40, onClick }) {
    return (
        <div
            className="relative flex-shrink-0 rounded-full flex items-center justify-center font-bold bg-primary text-card outline outline-2.5 outline-primary/25 outline-offset-2"
            style={{
                width: size,
                height: size,
                cursor: onClick ? "pointer" : "default",
                fontSize: Math.round(size * 0.4),
            }}
            onClick={onClick}
        >
            {handle?.charAt(0).toUpperCase() || "U"}
        </div>
    );
}

/* ── ActionBtn ────────────────────────────────────────── */
function ActionBtn({ onClick, icon, label, activeColor, tooltip, disabled }) {
    const [hov, setHov] = useState(false);

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            title={tooltip}
            disabled={disabled}
            className="flex items-center gap-1.5 min-h-[44px] min-w-[44px] px-3 md:px-2 py-2.5 md:py-1.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
                color: activeColor ? activeColor : hov ? "#2A2A25" : "#B5B0A4",
                background: hov ? "rgba(42,42,37,0.06)" : "transparent",
            }}
        >
            {icon}
            {label && (
                <span className="text-xs md:text-[13px] font-semibold">
                    {label}
                </span>
            )}
        </button>
    );
}
