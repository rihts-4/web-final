import { useState, useRef } from "react";
import { X, Image, PenLine } from "lucide-react";

export function ComposeModal({ onClose, onPost, currentUser, isLoading, error }) {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const maxChars = 400;
  const remaining = maxChars - content.length;
  const overLimit = remaining < 0;

  const handlePost = () => {
    if (!content.trim() || overLimit) return;
    onPost(content.trim(), selectedImage);
    onClose();
  };

  const handleInput = (e) => {
    setContent(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedImage(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(42,42,37,0.4)] backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[520px] rounded-3xl overflow-hidden shadow-2xl bg-card border border-border/80">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2 text-primary">
            <PenLine size={18} />
            <span className="text-[15px] font-bold text-foreground">
              New Thought
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-secondary text-switch-background"
          >
            <X size={17} />
          </button>
        </div>

        {/* Compose area */}
        <div className="flex gap-3 px-5 pb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 font-bold bg-primary text-card outline outline-2 outline-primary/30 outline-offset-2">
            {currentUser?.username?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleInput}
              placeholder="What's growing in your mind?"
              rows={4}
              className="w-full bg-transparent resize-none outline-none text-lg leading-relaxed placeholder-muted-foreground text-foreground font-['Nunito',sans-serif] font-normal"
            />
          </div>
        </div>

        {/* Image preview */}
        {selectedImage && (
          <div className="px-5 pb-3">
            <div className="relative rounded-2xl overflow-hidden max-h-[200px]">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt=""
                className="w-full object-cover max-h-[200px]"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center bg-black/60 text-card"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Tag suggestions */}
        <div className="flex gap-2 px-5 pb-4 flex-wrap">
          {["#slowliving", "#ecology", "#design", "#mindfulness"].map((tag) => (
            <button
              key={tag}
              onClick={() => setContent((c) => c + " " + tag)}
              className="text-xs px-2.5 py-1 rounded-full transition-colors hover:opacity-80 bg-primary/12 text-primary font-semibold"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border/60">
          <div className="flex items-center gap-1 text-primary">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl transition-colors hover:bg-secondary"
              title="Attach image"
            >
              <Image size={17} />
            </button>
          </div>
          <div className="flex flex-col items-end gap-2">
            {error && (
              <p className="text-xs text-right text-destructive font-semibold">
                {error}
              </p>
            )}
            <div className="flex items-center gap-3">
              {content.length > 0 && (
                <span className={`text-xs font-semibold ${
                  overLimit
                    ? "text-destructive"
                    : remaining < 30
                      ? "text-[#B5A040]"
                      : "text-switch-background"
                }`}>
                  {remaining}
                </span>
              )}
              <button
                onClick={handlePost}
                disabled={!content.trim() || overLimit || isLoading}
                className={`px-5 py-2 rounded-2xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 bg-primary text-card font-bold ${
                  content.trim() ? "shadow-[0_4px_14px_rgba(107,143,94,0.4)]" : ""
                }`}
              >
                {isLoading ? "Planting..." : "Plant it 🌱"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
