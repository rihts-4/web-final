import { useState, useRef, useCallback } from "react";
import { MessageCircle, Repeat2, Bookmark, Play, Pause, Volume2 } from "lucide-react";
import { ThoughtPost } from "../data/posts";

interface ThoughtCardProps {
  post: ThoughtPost;
  onLike: (id: string) => void;
  onRepost: (id: string) => void;
  onBookmark: (id: string) => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  style?: React.CSSProperties;
  isTop?: boolean;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

function AudioPlayer({ label, duration }: { label: string; duration: string }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playing) {
      clearInterval(intervalRef.current!);
      setPlaying(false);
    } else {
      setPlaying(true);
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(intervalRef.current!);
            setPlaying(false);
            return 0;
          }
          return p + 1;
        });
      }, 120);
    }
  };

  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-4 py-3 mt-3 cursor-pointer group"
      style={{ background: "rgba(107,143,94,0.1)", border: "1px solid rgba(107,143,94,0.25)" }}
      onClick={toggle}
    >
      <button
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
        style={{ background: "#6B8F5E" }}
      >
        {playing ? <Pause size={14} fill="white" className="text-white" /> : <Play size={14} fill="white" className="text-white ml-0.5" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-foreground/70 mb-1 truncate">{label}</p>
        <div className="relative h-1 rounded-full bg-border overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-all"
            style={{ width: `${progress}%`, background: "#6B8F5E" }}
          />
          {/* Waveform decoration */}
          <div className="absolute inset-0 flex items-center gap-px px-1 opacity-30">
            {[3, 5, 4, 7, 3, 6, 4, 5, 3, 8, 5, 4, 6, 3, 5, 7, 4, 3, 6, 5].map((h, i) => (
              <div key={i} className="flex-1 rounded-full" style={{ height: h * 1.5, background: "#6B8F5E" }} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
        <Volume2 size={13} />
        <span className="text-[11px]">{duration}</span>
      </div>
    </div>
  );
}

export function ThoughtCard({ post, onLike, onRepost, onBookmark, onSwipeLeft, onSwipeRight, style, isTop }: ThoughtCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [swipeHint, setSwipeHint] = useState<"like" | "reply" | null>(null);

  const THRESHOLD = 80;

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!isTop) return;
    dragStart.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
    cardRef.current?.setPointerCapture(e.pointerId);
  }, [isTop]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragStart.current || !isTop) return;
    const dx = e.clientX - dragStart.current.x;
    setDragX(dx);
    if (dx > 30) setSwipeHint("like");
    else if (dx < -30) setSwipeHint("reply");
    else setSwipeHint(null);
  }, [isTop]);

  const onPointerUp = useCallback(() => {
    if (!dragStart.current || !isTop) return;
    if (dragX > THRESHOLD) {
      onSwipeRight?.();
      onLike(post.id);
    } else if (dragX < -THRESHOLD) {
      onSwipeLeft?.();
    }
    setDragX(0);
    setDragging(false);
    setSwipeHint(null);
    dragStart.current = null;
  }, [dragX, isTop, onSwipeLeft, onSwipeRight, onLike, post.id]);

  const rotation = dragging ? dragX * 0.08 : 0;
  const opacity = dragging ? Math.max(0.6, 1 - Math.abs(dragX) / 300) : 1;

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
        transition: dragging ? "none" : "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        opacity,
        cursor: isTop ? (dragging ? "grabbing" : "grab") : "default",
        background: "#FDFAF4",
        boxShadow: isTop
          ? "0 20px 60px rgba(42,42,37,0.12), 0 4px 16px rgba(42,42,37,0.08)"
          : "0 8px 24px rgba(42,42,37,0.08)",
        touchAction: "none",
      }}
    >
      {/* Swipe indicators */}
      {isTop && (
        <>
          <div
            className="absolute top-6 left-6 z-20 rounded-xl px-4 py-2 border-2 rotate-[-15deg] transition-opacity"
            style={{
              background: "rgba(107,143,94,0.15)",
              borderColor: "#6B8F5E",
              opacity: swipeHint === "like" ? 1 : 0,
            }}
          >
            <span className="text-[15px] text-primary" style={{ fontWeight: 800 }}>🌱 Sprout</span>
          </div>
          <div
            className="absolute top-6 right-6 z-20 rounded-xl px-4 py-2 border-2 rotate-[15deg] transition-opacity"
            style={{
              background: "rgba(192,69,58,0.1)",
              borderColor: "#C0453A",
              opacity: swipeHint === "reply" ? 1 : 0,
            }}
          >
            <span className="text-[15px] text-destructive" style={{ fontWeight: 800 }}>💬 Reply</span>
          </div>
        </>
      )}

      {/* Card Content */}
      <div className="h-full flex flex-col p-6 overflow-y-auto">
        {/* User */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <img
              src={post.user.avatar}
              alt={post.user.name}
              className="w-11 h-11 rounded-full object-cover"
              style={{ outline: "2.5px solid #EAE5D8", outlineOffset: 2 }}
            />
            {post.user.verified && (
              <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full flex items-center justify-center"
                style={{ width: 17, height: 17, background: "#6B8F5E" }}>
                <svg viewBox="0 0 10 10" width={9} height={9} fill="none">
                  <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-foreground text-[15px] truncate" style={{ fontWeight: 700 }}>{post.user.name}</span>
            </div>
            <span className="text-muted-foreground text-[13px]">@{post.user.handle} · {post.timestamp}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onBookmark(post.id); }}
            className="p-1.5 rounded-full transition-colors"
            style={{ color: post.bookmarked ? "#6B8F5E" : "#B5B0A4" }}
          >
            <Bookmark size={18} fill={post.bookmarked ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Text */}
        <p className="text-foreground text-[16px] leading-relaxed flex-1 mb-4 whitespace-pre-wrap" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {post.content}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.map((t) => (
              <span
                key={t}
                className="text-[12px] px-2.5 py-0.5 rounded-full"
                style={{ background: "rgba(107,143,94,0.12)", color: "#6B8F5E", fontWeight: 600 }}
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Image */}
        {post.image && (
          <div className="rounded-2xl overflow-hidden mb-3 max-h-[220px]">
            <img src={post.image} alt="Thought media" className="w-full object-cover" style={{ maxHeight: 220 }} />
          </div>
        )}

        {/* Audio */}
        {post.audioLabel && (
          <AudioPlayer label={post.audioLabel} duration={post.audioDuration!} />
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "1px solid rgba(42,42,37,0.08)" }}>
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle size={17} />
            <span className="text-[13px]">{formatCount(post.replies)}</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onRepost(post.id); }}
            className="flex items-center gap-1.5 transition-colors"
            style={{ color: post.reposted ? "#6B8F5E" : "#B5B0A4" }}
          >
            <Repeat2 size={17} />
            <span className="text-[13px]">{formatCount(post.reposts)}</span>
          </button>

          {/* Sprout (like) */}
          <button
            onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
            className="flex items-center gap-1.5 transition-colors"
            style={{ color: post.liked ? "#6B8F5E" : "#B5B0A4" }}
          >
            <SproutIcon filled={!!post.liked} />
            <span className="text-[13px]">{formatCount(post.likes + (post.liked ? 1 : 0))}</span>
          </button>

          {/* Swipe hint */}
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-[11px]" style={{ fontWeight: 500 }}>← reply · sprout →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SproutIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 20h10" />
      <path d="M10 20c5.5-2.5.8-6.4 3-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
    </svg>
  );
}
