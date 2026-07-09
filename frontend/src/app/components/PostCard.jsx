import { useState } from "react";
import {
  MessageCircle,
  Repeat2,
  Share,
  Bookmark,
  MoreHorizontal,
  Zap,
} from "lucide-react";

function formatCount(n) {
  if (n >= 1_000_000)
    return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export function PostCard({ post, onLike, onRepost, onBookmark, onReply }) {
  const [showMenu, setShowMenu] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex gap-3 px-4 py-4 border-b border-border cursor-pointer relative transition-colors"
      style={{
        backgroundColor: hovered ? "rgba(139,92,246,0.04)" : "transparent",
      }}
    >
      {/* Subtle left accent on hover */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r transition-opacity duration-200"
        style={{
          background: "linear-gradient(180deg, #8B5CF6, #6366F1)",
          opacity: hovered ? 1 : 0,
        }}
      />

      <div className="relative flex-shrink-0">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-border text-sm font-bold"
          style={{
            background: "#6B8F5E",
            color: "#FDFAF4",
          }}
        >
          {post.user.handle?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
            <span
              className="text-foreground text-[15px] truncate"
              style={{ fontWeight: 700 }}
            >
              {post.user.name}
            </span>
            <span className="text-muted-foreground text-[14px] truncate">
              @{post.user.handle}
            </span>
            <span className="text-muted-foreground text-[14px]">·</span>
            <span className="text-muted-foreground text-[14px] flex-shrink-0">
              {post.timestamp}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground flex-shrink-0"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Content */}
        <p className="text-foreground text-[15px] leading-relaxed mb-3 whitespace-pre-wrap break-words">
          {post.content}
        </p>

        {/* Image */}
        {post.image && (
          <div className="rounded-xl overflow-hidden border border-border mb-3 max-h-[400px]">
            <img
              src={post.image}
              alt="Post media"
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 -ml-1.5">
          {/* Reply */}
          <ActionBtn
            onClick={(e) => {
              e.stopPropagation();
              onReply?.(post);
            }}
            icon={<MessageCircle size={17} />}
            count={post.replies}
            hoverColor="primary"
          />

          {/* Amplify (repost) */}
          <ActionBtn
            onClick={(e) => {
              e.stopPropagation();
              onRepost(post.id);
            }}
            icon={<Repeat2 size={17} />}
            count={post.reposts + (post.reposted ? 1 : 0)}
            active={post.reposted}
            activeColor="text-emerald-400"
            hoverColor="emerald"
          />

          {/* Resonate (like) */}
          <ActionBtn
            onClick={(e) => {
              e.stopPropagation();
              onLike(post.id);
            }}
            icon={<Zap size={17} fill={post.liked ? "currentColor" : "none"} />}
            count={post.likes + (post.liked ? 1 : 0)}
            active={post.liked}
            activeColor="text-amber-400"
            hoverColor="amber"
          />

          {/* Views */}
          <ActionBtn
            onClick={(e) => e.stopPropagation()}
            icon={
              <svg
                viewBox="0 0 24 24"
                width={17}
                height={17}
                fill="currentColor"
              >
                <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" />
              </svg>
            }
            count={post.views}
            hoverColor="primary"
          />

          <div className="flex items-center ml-auto gap-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark(post.id);
              }}
              className={`p-1.5 rounded-lg transition-colors ${post.bookmarked ? "text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
            >
              <Bookmark
                size={17}
                fill={post.bookmarked ? "currentColor" : "none"}
              />
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <Share size={17} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ActionBtn({ onClick, icon, count, active, activeColor, hoverColor }) {
  const hoverClasses = {
    primary: "hover:text-primary hover:bg-primary/10",
    emerald: "hover:text-emerald-400 hover:bg-emerald-400/10",
    amber: "hover:text-amber-400 hover:bg-amber-400/10",
  }[hoverColor];

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors ${
        active ? activeColor : `text-muted-foreground ${hoverClasses}`
      }`}
    >
      {icon}
      {count > 0 && <span className="text-[13px]">{formatCount(count)}</span>}
    </button>
  );
}
