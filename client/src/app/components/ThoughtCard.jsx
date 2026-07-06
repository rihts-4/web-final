import { useState, useRef, useCallback } from "react";
import {
  Heart,
  Repeat2,
  Bookmark,
  MessageCircle,
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
      className="flex items-center gap-3 rounded-2xl px-4 py-3 mt-3 cursor-pointer group select-none"
      style={{
        background: "rgba(107,143,94,0.1)",
        border: "1px solid rgba(107,143,94,0.25)",
      }}
      onClick={toggle}
    >
      <button
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
        style={{ background: "#6B8F5E" }}
      >
        {playing ? (
          <Pause size={13} fill="white" className="text-white" />
        ) : (
          <Play size={13} fill="white" className="text-white ml-0.5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-[12px] mb-1.5 truncate" style={{ color: "#5A5A52" }}>
          {label}
        </p>
        <div className="relative h-5 flex items-center">
          <div className="absolute inset-0 flex items-center gap-px">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-full"
                style={{
                  height: Math.max(h * 2, 4),
                  background:
                    (i / bars.length) * 100 <= progress
                      ? "#6B8F5E"
                      : "rgba(42,42,37,0.12)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className="flex items-center gap-1 flex-shrink-0"
        style={{ color: "#B5B0A4" }}
      >
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
  onRepost,
  onBookmark,
  onReply,
  onSwipedAway,
  style,
  isTop,
}) {
  const cardRef = useRef(null);
  const origin = useRef(null);
  const moved = useRef(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  // "like" = dragging right | "repost" = dragging left | null = neutral
  const [gesture, setGesture] = useState(null);

  const THRESHOLD = 90;

  const onPointerDown = useCallback(
    (e) => {
      if (!isTop) return;
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
      setGesture(dx > 30 ? "like" : dx < -30 ? "repost" : null);
    },
    [isTop],
  );

  const onPointerUp = useCallback(() => {
    if (!origin.current || !isTop) return;
    if (moved.current) {
      if (dragX > THRESHOLD) {
        onLike(post.id);
        onSwipedAway?.();
      } else if (dragX < -THRESHOLD) {
        onRepost(post.id);
        onSwipedAway?.();
      }
    }
    setDragX(0);
    setDragging(false);
    setGesture(null);
    origin.current = null;
  }, [dragX, isTop, onLike, onRepost, onSwipedAway, post.id]);

  const rotation = dragging ? dragX * 0.06 : 0;
  const washAlpha = Math.max(0, Math.abs(dragX) - 30) / 220;
  const likeAlpha = gesture === "like" ? Math.min(1, (dragX - 30) / 60) : 0;
  const repostAlpha =
    gesture === "repost" ? Math.min(1, (-dragX - 30) / 60) : 0;

  return (
    <div
      ref={cardRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="absolute inset-0 rounded-3xl overflow-hidden select-none"
      style={{
        ...style,
        transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
        transition: dragging
          ? "none"
          : "transform 0.45s cubic-bezier(0.34,1.4,0.64,1)",
        cursor: isTop ? (dragging ? "grabbing" : "grab") : "default",
        background: "#FDFAF4",
        boxShadow: isTop
          ? "0 20px 60px rgba(42,42,37,0.13), 0 4px 16px rgba(42,42,37,0.07)"
          : "0 8px 24px rgba(42,42,37,0.07)",
        touchAction: "none",
      }}
    >
      {/* ── Colour wash (z:1) ─────────────────────────── */}
      {dragging && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            zIndex: 1,
            background:
              gesture === "like"
                ? `rgba(107,143,94,${washAlpha})`
                : gesture === "repost"
                  ? `rgba(59,130,246,${washAlpha})`
                  : "transparent",
          }}
        />
      )}

      {/* ── Badge layer (z:10) ────────────────────────────
           Completely isolated above all card content.
           Opaque card-coloured background + shadow means
           zero bleed-through from post text or hashtags.
        ─────────────────────────────────────────────────── */}
      {isTop && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 10 }}
          aria-hidden
        >
          {/* Like badge — top-left */}
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 12,
              opacity: likeAlpha,
              transform: `rotate(-14deg) scale(${0.82 + likeAlpha * 0.18})`,
              transition: dragging ? "none" : "opacity 0.15s",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 14,
                background: "#FDFAF4" /* fully opaque */,
                border: "2.5px solid #6B8F5E",
                boxShadow: "0 4px 18px rgba(107,143,94,0.28)",
                fontFamily: "'Nunito', sans-serif",
                fontSize: 14,
                fontWeight: 800,
                color: "#6B8F5E",
              }}
            >
              ❤️ Like
            </span>
          </div>

          {/* Re-root badge — top-right */}
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 12,
              opacity: repostAlpha,
              transform: `rotate(14deg) scale(${0.82 + repostAlpha * 0.18})`,
              transition: dragging ? "none" : "opacity 0.15s",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 14,
                background: "#FDFAF4" /* fully opaque */,
                border: "2.5px solid #3B82F6",
                boxShadow: "0 4px 18px rgba(59,130,246,0.22)",
                fontFamily: "'Nunito', sans-serif",
                fontSize: 14,
                fontWeight: 800,
                color: "#3B82F6",
              }}
            >
              🔁 Re-root
            </span>
          </div>
        </div>
      )}

      {/* ── Card content (z:2) ────────────────────────────
           Padding keeps content well below the badge corners.
           Post text and hashtag row have their own spacing
           and will never overlap the badge layer.
        ─────────────────────────────────────────────────── */}
      <div
        className="h-full flex flex-col overflow-y-auto"
        style={{ padding: "20px 20px 16px", position: "relative", zIndex: 2 }}
      >
        {/* User header */}
        <div className="flex items-center gap-3 mb-4">
          <UserAvatar
            avatar={post.user.avatar}
            name={post.user.name}
            size={44}
            verified={post.user.verified}
          />

          <div className="flex-1 min-w-0">
            <span
              className="block text-foreground text-[15px] truncate"
              style={{ fontWeight: 700 }}
            >
              {post.user.name}
            </span>
            <span className="text-muted-foreground text-[13px]">
              @{post.user.handle} · {post.timestamp}
            </span>
          </div>
        </div>

        {/* Post text — isolated below header, clear of badge corners */}
        <p
          className="text-foreground text-[16px] leading-relaxed flex-1 mb-4 whitespace-pre-wrap"
          style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 400 }}
        >
          {post.content}
        </p>

        {/* Hashtag row — own row with bottom margin, no badge overlap */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((t) => (
              <span
                key={t}
                className="text-[12px] px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(107,143,94,0.12)",
                  color: "#6B8F5E",
                  fontWeight: 600,
                }}
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Image */}
        {post.image && (
          <div
            className="rounded-2xl overflow-hidden mb-4"
            style={{ maxHeight: 200 }}
          >
            <img
              src={post.image}
              alt=""
              className="w-full object-cover"
              style={{ maxHeight: 200 }}
            />
          </div>
        )}

        {/* Audio */}
        {post.audioLabel && (
          <AudioPlayer label={post.audioLabel} duration={post.audioDuration} />
        )}

        {/* ── Action bar ─────────────────────────────────────
             Two swipe gestures: right → Like, left → Re-root.
             Four tap buttons for non-swipe interactions.
          ──────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between mt-4"
          style={{ paddingTop: 12, borderTop: "1px solid rgba(42,42,37,0.08)" }}
        >
          <ActionBtn
            onClick={(e) => {
              e.stopPropagation();
              onReply(post);
            }}
            icon={<MessageCircle size={19} strokeWidth={2.4} />}
            label={formatCount(post.replies)}
            activeColor={null}
            tooltip="Reply"
          />

          <ActionBtn
            onClick={(e) => {
              e.stopPropagation();
              onLike(post.id);
            }}
            icon={
              <Heart
                size={19}
                strokeWidth={2.4}
                fill={post.liked ? "currentColor" : "none"}
              />
            }
            label={formatCount(post.likes + (post.liked ? 1 : 0))}
            activeColor={post.liked ? "#C0453A" : null}
            tooltip="Like — or swipe right →"
          />

          <ActionBtn
            onClick={(e) => {
              e.stopPropagation();
              onRepost(post.id);
            }}
            icon={<Repeat2 size={19} strokeWidth={2.4} />}
            label={formatCount(post.reposts + (post.reposted ? 1 : 0))}
            activeColor={post.reposted ? "#3B82F6" : null}
            tooltip="Re-root — or swipe left ←"
          />

          <ActionBtn
            onClick={(e) => {
              e.stopPropagation();
              onBookmark(post.id);
            }}
            icon={
              <Bookmark
                size={19}
                strokeWidth={2.4}
                fill={post.bookmarked ? "currentColor" : "none"}
              />
            }
            label=""
            activeColor={post.bookmarked ? "#6B8F5E" : null}
            tooltip="Save"
          />

          <span
            className="text-[10px] whitespace-nowrap"
            style={{
              color: "#D4CFC6",
              fontWeight: 600,
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            ← swipe →
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── UserAvatar ───────────────────────────────────────── */

export function UserAvatar({ avatar, name, size = 40, verified, onClick }) {
  const badge = Math.round(size * 0.38);
  return (
    <div
      className="relative flex-shrink-0"
      style={{
        width: size,
        height: size,
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      <img
        src={avatar}
        alt={name}
        className="rounded-full object-cover w-full h-full"
        style={{
          outline: "2.5px solid rgba(107,143,94,0.25)",
          outlineOffset: 2,
        }}
      />

      {verified && (
        <div
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: badge,
            height: badge,
            bottom: -1,
            right: -1,
            background: "#6B8F5E",
            border: "2px solid #F4F0E6",
          }}
        >
          <svg
            viewBox="0 0 10 10"
            width={badge * 0.58}
            height={badge * 0.58}
            fill="none"
          >
            <path
              d="M2 5l2 2 4-4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

/* ── ActionBtn ────────────────────────────────────────── */
function ActionBtn({ onClick, icon, label, activeColor, tooltip }) {
  const [hov, setHov] = useState(false);
  const active = activeColor !== null;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={tooltip}
      className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl transition-all"
      style={{
        color: active ? activeColor : hov ? "#2A2A25" : "#B5B0A4",
        background: hov ? "rgba(42,42,37,0.06)" : "transparent",
      }}
    >
      {icon}
      {label && (
        <span className="text-[13px]" style={{ fontWeight: 600 }}>
          {label}
        </span>
      )}
    </button>
  );
}
