import { useState, useRef } from "react";
import { X, Image, Smile, Send } from "lucide-react";

const MOCK_REPLIES = {
  "1": [
    {
      id: "r1",
      user: {
        name: "Rowan Ashby",
        handle: "rowanashby",
      },
      content:
        "The sediment analogy is perfect. Some of my best ideas only surface after a long walk.",
      timestamp: "1h ago",
      likes: 14,
    },
    {
      id: "r2",
      user: {
        name: "Zara Finch",
        handle: "zarafinch",
      },
      content:
        'Bookmarking this. "Intelligence that only comes through stillness" — putting this on my wall.',
      timestamp: "45m ago",
      likes: 28,
    },
  ],
  "3": [
    {
      id: "r3",
      user: {
        name: "Felix Osei",
        handle: "felixosei",
      },
      content:
        "2.6 billion tons and we're still debating whether trees matter. Thank you for framing this so well.",
      timestamp: "3h ago",
      likes: 91,
    },
  ],
  default: [
    {
      id: "rd1",
      user: {
        name: "Mila Voss",
        handle: "milavoss",
      },
      content: "This really resonated with me. Thanks for sharing.",
      timestamp: "2h ago",
      likes: 5,
    },
  ],
};

export function ReplyModal({ post, currentUser, onClose }) {
  const [replies, setReplies] = useState(
    MOCK_REPLIES[post.id] ?? MOCK_REPLIES.default,
  );
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);

  const handleInput = (e) => {
    setContent(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const submitReply = () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    const newReply = {
      id: "rNew" + Date.now(),
      user: currentUser,
      content: content.trim(),
      timestamp: "just now",
      likes: 0,
    };
    setReplies((prev) => [...prev, newReply]);
    setContent("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setTimeout(() => setIsSubmitting(false), 300);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[rgba(42,42,37,0.45)] backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full sm:max-w-[540px] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl bg-card border border-border/80 max-h-[90vh] font-['Nunito',sans-serif]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0 border-b border-border/60">
          <h2 className="text-foreground text-base font-extrabold">
            Replies
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors text-switch-background"
          >
            <X size={16} />
          </button>
        </div>

        {/* Original thought (compact) */}
        <div className="px-5 py-4 flex-shrink-0 bg-[rgba(107,143,94,0.05)] border-b border-[rgba(42,42,37,0.06)]">
          <div className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs bg-primary text-card outline outline-2 outline-primary/25 outline-offset-1">
              {post.user.handle?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-foreground text-sm font-bold">
                  {post.user.name}
                </span>
                <span className="text-muted-foreground text-[13px]">
                  @{post.user.handle}
                </span>
                <span className="text-muted-foreground text-[13px]">
                  · {post.timestamp}
                </span>
              </div>
              <p className="text-foreground text-sm leading-relaxed line-clamp-3">
                {post.content}
              </p>
            </div>
          </div>
          {/* Thread line */}
          <div className="ml-[22px] mt-2 w-0.5 h-4 bg-primary/30" />
        </div>

        {/* Reply list (scrollable) */}
        <div className="flex-1 overflow-y-auto">
          {replies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <span className="text-4xl mb-3">💬</span>
              <p className="text-muted-foreground text-sm">
                No replies yet. Be the first to respond.
              </p>
            </div>
          ) : (
            replies.map((reply, i) => (
              <div
                key={reply.id}
                className={`px-5 py-4 transition-colors hover:bg-secondary/30 ${
                  i < replies.length - 1 ? "border-b border-[rgba(42,42,37,0.06)]" : ""
                }`}
              >
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs bg-primary text-card outline outline-2 outline-border outline-offset-1">
                    {reply.user.handle?.charAt(0).toUpperCase() || "U"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-foreground text-sm font-bold">
                        {reply.user.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        @{reply.user.handle}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        · {reply.timestamp}
                      </span>
                    </div>
                    <p className="text-foreground text-sm leading-relaxed mb-2">
                      {reply.content}
                    </p>
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors text-xs">
                      ❤️ <span>{reply.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Compose reply */}
        <div className="px-5 pt-4 pb-5 flex-shrink-0 border-t-[1.5px] border-border/60 bg-card">
          <p className="text-muted-foreground text-xs mb-3">
            Replying to{" "}
            <span className="text-primary font-bold">
              @{post.user.handle}
            </span>
          </p>
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs bg-primary text-card outline outline-2 outline-primary/30 outline-offset-1">
              {currentUser?.username?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleInput}
                placeholder="Add to the conversation..."
                rows={2}
                className="w-full bg-transparent resize-none outline-none text-[15px] leading-relaxed placeholder-muted-foreground text-foreground font-['Nunito',sans-serif]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                    submitReply();
                }}
              />

              <div className="flex items-center justify-between pt-2 border-t border-[rgba(42,42,37,0.07)]">
                <div className="flex gap-0.5 text-primary">
                  {[Image, Smile].map((Icon, i) => (
                    <button
                      key={i}
                      className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
                <button
                  onClick={submitReply}
                  disabled={!content.trim() || isSubmitting}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[13px] transition-all disabled:opacity-40 hover:opacity-90 bg-primary text-card font-bold ${
                    content.trim() ? "shadow-[0_3px_10px_rgba(107,143,94,0.35)]" : ""
                  }`}
                >
                  <Send size={13} />
                  {isSubmitting ? "Replying..." : "Reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
