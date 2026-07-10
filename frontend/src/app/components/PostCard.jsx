import { useState } from "react";
import {
  UserPlus,
  Share,
  MoreHorizontal,
  Zap,
} from "lucide-react";

function formatCount(n) {
  if (n >= 1_000_000)
    return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export function PostCard({ post, onLike, onFollow, currentUserHandle }) {
  const [showMenu, setShowMenu] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [actionError, setActionError] = useState(null);

  const handleLikeAction = async (e) => {
    e.stopPropagation();
    if (actionLoading) return;
    setActionError(null);
    setActionLoading("like");
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
    setActionLoading("follow");
    try {
      await onFollow(post.id);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex gap-3 px-4 py-4 border-b border-border cursor-pointer relative transition-colors ${
        hovered ? "bg-[rgba(139,92,246,0.04)]" : "bg-transparent"
      }`}
    >
      {/* Subtle left accent on hover */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-r transition-opacity duration-200 bg-gradient-to-b from-[#8B5CF6] to-[#6366F1] ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative flex-shrink-0">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-border text-sm font-bold bg-primary text-card"
        >
          {post.user.handle?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
            <span
              className="text-foreground text-sm md:text-[15px] truncate font-bold"
            >
              {post.user.name}
            </span>
            <span className="text-muted-foreground text-xs md:text-[14px] truncate">
              @{post.user.handle}
            </span>
            <span className="text-muted-foreground text-xs md:text-[14px]">·</span>
            <span className="text-muted-foreground text-xs md:text-[14px] flex-shrink-0">
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
        <p className="text-foreground text-sm md:text-[15px] leading-relaxed mb-3 whitespace-pre-wrap break-words">
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
            {/* Resonate (like) */}
            <ActionBtn
              onClick={handleLikeAction}
              icon={<Zap size={17} fill={post.liked ? "currentColor" : "none"} />}
              count={actionLoading === "like" ? "..." : post.likes + (post.liked ? 1 : 0)}
              active={post.liked}
              activeColor="text-amber-400"
              hoverColor="amber"
              disabled={!!actionLoading}
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

            {currentUserHandle !== post.user.handle && (
              <button
                onClick={handleFollowAction}
                disabled={!!actionLoading}
                className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors ${
                  actionLoading === "follow"
                    ? "opacity-40 cursor-not-allowed"
                    : post.isFollowing
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                }`}
                title={post.isFollowing ? "Unfollow this user" : "Follow this user"}
              >
                <UserPlus size={17} />
              </button>
            )}

            <div className="flex items-center ml-auto gap-0.5">
              <button
                onClick={(e) => e.stopPropagation()}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Share size={17} />
              </button>
            </div>
         </div>
          {actionError && (
            <p className="text-xs mt-1 px-1 text-destructive font-semibold">
              {actionError}
            </p>
          )}
      </div>
    </article>
  );
}

function ActionBtn({ onClick, icon, count, active, activeColor, hoverColor, disabled }) {
  const hoverClasses = {
    primary: "hover:text-primary hover:bg-primary/10",
    emerald: "hover:text-emerald-400 hover:bg-emerald-400/10",
    amber: "hover:text-amber-400 hover:bg-amber-400/10",
  }[hoverColor];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 min-h-[44px] min-w-[44px] px-3 md:px-2 py-2 md:py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        active ? activeColor : `text-muted-foreground ${hoverClasses}`
      }`}
    >
      {icon}
      {count > 0 && <span className="text-xs md:text-[13px]">{formatCount(count)}</span>}
    </button>
  );
}