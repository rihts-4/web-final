import { useState } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

const STEPS = [
  {
    emoji: "🌿",
    title: "Welcome to Grove",
    body: "Grove is a slow, intentional microblogging space — designed to help you share ideas without noise. Read one thought at a time, share what matters, and tend your garden.",
    highlight: null,
  },
  {
    emoji: "🃏",
    title: "Thought Cards",
    body: "Posts appear as stacked cards — one at a time — so you can focus. Use the Back / Next buttons below the card, or swipe left to move to the next thought.",
    highlight: "One thought at a time. Read it. Then decide.",
  },
  {
    emoji: "👆",
    title: "Swipe to interact",
    body: "Swipe a card right to Like it. Swipe left to skip to the next thought. You can also tap the buttons on the card — swiping is just a shortcut.",
    visual: "swipe",
    highlight: null,
  },
  {
    emoji: "❤️",
    title: "Likes & Following",
    body: "Tap the heart to Like a thought. Follow other users to see their thoughts in your Following feed. The Follow button appears on every card from someone you don't follow yet.",
    highlight: "Follow the gardeners whose thoughts you want to see.",
  },
  {
    emoji: "🏷️",
    title: "Explore & Discover",
    body: "Use the Explore page to search for users and topics. Find new voices and add them to your garden.",
    highlight: null,
  },
  {
    emoji: "🌱",
    title: "You're all set",
    body: "Your feed has two tabs: For you and Following. Post your own thoughts from the compose button. Tend your garden thoughtfully.",
    highlight: null,
  },
];

export function OnboardingModal({ onDismiss }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(42,42,37,0.45)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-[460px] rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: "#FDFAF4",
          border: "1px solid rgba(42,42,37,0.1)",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <span
            className="text-[12px] uppercase tracking-widest"
            style={{ color: "#6B8F5E", fontWeight: 700 }}
          >
            Getting started · {step + 1}/{STEPS.length}
          </span>
          <button
            onClick={onDismiss}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            style={{ color: "#B5B0A4" }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 mb-5">
          <div
            className="h-1 rounded-full"
            style={{ background: "rgba(42,42,37,0.1)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((step + 1) / STEPS.length) * 100}%`,
                background: "#6B8F5E",
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-2 min-h-[220px]">
          <div className="text-5xl mb-4">{current.emoji}</div>
          <h2
            className="text-foreground text-[22px] mb-3"
            style={{ fontWeight: 800 }}
          >
            {current.title}
          </h2>
          <p
            className="text-[15px] leading-relaxed"
            style={{ color: "#5A5A52" }}
          >
            {current.body}
          </p>

          {/* Swipe visual */}
          {current.visual === "swipe" && (
            <div className="mt-4 flex items-center gap-4 justify-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-[13px]"
                  style={{
                    borderColor: "#C0453A",
                    color: "#C0453A",
                    fontWeight: 700,
                  }}
                >
                  ← Swipe left
                </div>
                <span className="text-[12px] text-muted-foreground">
                  Next thought
                </span>
              </div>
              <div
                className="w-12 h-16 rounded-xl shadow-md flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #FDFAF4, #EAE5D8)",
                  border: "1.5px solid rgba(42,42,37,0.12)",
                }}
              />
              <div className="flex flex-col items-center gap-1">
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-[13px]"
                  style={{
                    borderColor: "#6B8F5E",
                    color: "#6B8F5E",
                    fontWeight: 700,
                  }}
                >
                  Swipe right →
                </div>
                <span className="text-[12px] text-muted-foreground">Like</span>
              </div>
            </div>
          )}

          {/* Highlight box */}
          {current.highlight && (
            <div
              className="mt-4 px-4 py-3 rounded-2xl text-[13px] leading-relaxed"
              style={{
                background: "rgba(107,143,94,0.1)",
                borderLeft: "3px solid #6B8F5E",
                color: "#4A6B3F",
                fontWeight: 600,
              }}
            >
              {current.highlight}
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="flex items-center justify-between px-6 py-5">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[14px] transition-all disabled:opacity-0"
            style={{ color: "#7D7D72", fontWeight: 600 }}
          >
            <ChevronLeft size={16} />
            Back
          </button>

          {/* Dot indicators */}
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === step ? 20 : 7,
                  height: 7,
                  background:
                    i === step
                      ? "#6B8F5E"
                      : i < step
                        ? "rgba(107,143,94,0.4)"
                        : "rgba(42,42,37,0.15)",
                }}
              />
            ))}
          </div>

          {isLast ? (
            <button
              onClick={onDismiss}
              className="flex items-center gap-1.5 px-5 py-2 rounded-2xl text-[14px] transition-all hover:opacity-90"
              style={{
                background: "#6B8F5E",
                color: "#FDFAF4",
                fontWeight: 700,
                boxShadow: "0 4px 12px rgba(107,143,94,0.3)",
              }}
            >
              Enter Grove 🌿
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[14px] transition-all hover:opacity-90"
              style={{
                background: "#6B8F5E",
                color: "#FDFAF4",
                fontWeight: 700,
              }}
            >
              Next
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
