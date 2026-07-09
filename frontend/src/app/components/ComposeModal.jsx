import { useState, useRef } from "react";
import { X, Image, Smile, BarChart2, Volume2, PenLine } from "lucide-react";

export function ComposeModal({ onClose, onPost, currentUser }) {
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);

  const maxChars = 400;
  const remaining = maxChars - content.length;
  const overLimit = remaining < 0;

  const handlePost = () => {
    if (!content.trim() || overLimit) return;
    onPost(content.trim());
    onClose();
  };

  const handleInput = (e) => {
    setContent(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(42,42,37,0.4)", backdropFilter: "blur(8px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-[520px] rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: "#FDFAF4",
          border: "1px solid rgba(42,42,37,0.1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2" style={{ color: "#6B8F5E" }}>
            <PenLine size={18} />
            <span
              className="text-[15px]"
              style={{ fontWeight: 700, color: "#2A2A25" }}
            >
              New Thought
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-secondary"
            style={{ color: "#B5B0A4" }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Compose area */}
        <div className="flex gap-3 px-5 pb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 font-bold"
            style={{
              background: "#6B8F5E",
              color: "#FDFAF4",
              outline: "2px solid rgba(107,143,94,0.3)",
              outlineOffset: 2,
            }}
          >
            {currentUser?.username?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleInput}
              placeholder="What's growing in your mind?"
              rows={4}
              className="w-full bg-transparent resize-none outline-none text-[17px] leading-relaxed placeholder-muted-foreground"
              style={{
                color: "#2A2A25",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 400,
              }}
            />
          </div>
        </div>

        {/* Tag suggestions */}
        <div className="flex gap-2 px-5 pb-4 flex-wrap">
          {["#slowliving", "#ecology", "#design", "#mindfulness"].map((tag) => (
            <button
              key={tag}
              onClick={() => setContent((c) => c + " " + tag)}
              className="text-[12px] px-2.5 py-1 rounded-full transition-colors hover:opacity-80"
              style={{
                background: "rgba(107,143,94,0.12)",
                color: "#6B8F5E",
                fontWeight: 600,
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: "1px solid rgba(42,42,37,0.08)" }}
        >
          <div className="flex items-center gap-1" style={{ color: "#6B8F5E" }}>
            {[Image, Smile, Volume2, BarChart2].map((Icon, i) => (
              <button
                key={i}
                className="p-2 rounded-xl transition-colors hover:bg-secondary"
              >
                <Icon size={17} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {content.length > 0 && (
              <span
                className="text-[12px]"
                style={{
                  color:
                    remaining < 30
                      ? overLimit
                        ? "#C0453A"
                        : "#B5A040"
                      : "#B5B0A4",
                  fontWeight: 600,
                }}
              >
                {remaining}
              </span>
            )}
            <button
              onClick={handlePost}
              disabled={!content.trim() || overLimit}
              className="px-5 py-2 rounded-2xl text-[14px] transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
              style={{
                background: "#6B8F5E",
                color: "#FDFAF4",
                fontWeight: 700,
                boxShadow: content.trim()
                  ? "0 4px 14px rgba(107,143,94,0.4)"
                  : "none",
              }}
            >
              Plant it 🌱
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
