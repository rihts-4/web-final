import { useState, useRef } from "react";
import { Image, X, Zap } from "lucide-react";

export function ComposeBox({
  currentUser,
  onPost,
  placeholder = "What's resonating with you?",
  replyTo,
  isLoading,
  error,
}) {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handlePost = () => {
    if (!content.trim()) return;
    onPost(content.trim(), selectedImage);
    setContent("");
    setSelectedImage(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedImage(file);
  };

  const handleInput = (e) => {
    setContent(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const maxChars = 400;
  const charCount = content.length;
  const remaining = maxChars - charCount;
  const overLimit = remaining < 0;
  const nearLimit = remaining <= 30;
  const circumference = 2 * Math.PI * 11;
  const dashOffset = circumference * (1 - Math.min(charCount / maxChars, 1));

  return (
    <div className="px-4 pt-4 pb-2 border-b border-border">
      {replyTo && (
        <p className="text-muted-foreground text-sm mb-3 pl-13">
          Replying to <span className="text-primary">@{replyTo}</span>
        </p>
      )}
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ring-2 ring-border font-bold bg-primary text-card">
          {currentUser?.username?.charAt(0).toUpperCase() || "U"}
        </div>

        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleInput}
            placeholder={placeholder}
            rows={3}
            className="w-full bg-transparent text-foreground placeholder-muted-foreground resize-none outline-none text-lg leading-relaxed min-h-[80px] font-normal"
          />

          {/* Image preview */}
          {selectedImage && (
            <div className="relative rounded-2xl overflow-hidden mb-3 max-h-[180px]">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt=""
                className="w-full object-cover max-h-[180px]"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center bg-black/60 text-card"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-border mb-3" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5 text-primary">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Attach image"
                className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <Image size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {charCount > 0 && (
                <div className="relative w-7 h-7">
                  <svg className="w-7 h-7 -rotate-90" viewBox="0 0 28 28">
                    <circle
                      cx="14"
                      cy="14"
                      r="11"
                      fill="none"
                      stroke="#1E2030"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="14"
                      cy="14"
                      r="11"
                      fill="none"
                      stroke={
                        overLimit
                          ? "#F43F5E"
                          : nearLimit
                            ? "#F59E0B"
                            : "#8B5CF6"
                      }
                      strokeWidth="2.5"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  {nearLimit && (
                    <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${
                      overLimit ? "text-destructive" : "text-muted-foreground"
                    }`}>
                      {remaining}
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={handlePost}
                disabled={!content.trim() || overLimit || isLoading}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-opacity hover:opacity-90 font-bold text-white bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] ${
                  content.trim() ? "shadow-[0_0_16px_rgba(139,92,246,0.4)]" : ""
                }`}
              >
                <Zap size={14} fill="white" />
                {isLoading ? "Echoing..." : "Echo"}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-xs mt-2 text-destructive font-semibold">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
