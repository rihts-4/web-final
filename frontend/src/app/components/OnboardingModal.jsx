import { useState, useRef, useCallback, useEffect } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

const STEPS = [
  { emoji: "🌿", title: "Welcome to Grove", body: "Grove is a slow, intentional microblogging space — designed to help you share ideas without noise. Read one thought at a time, share what matters, and tend your garden.", highlight: null },
  { emoji: "🃏", title: "Thought Cards", body: "Posts appear as stacked cards — one at a time — so you can focus. Use the Back / Next buttons below the card, or swipe left to move to the next thought.", highlight: "One thought at a time. Read it. Then decide." },
  { emoji: "👆", title: "Swipe to interact", body: "Swipe a card right to Like it. Swipe left to skip to the next thought. You can also tap the buttons on the card — swiping is just a shortcut.", visual: "swipe", highlight: null },
  { emoji: "❤️", title: "Likes & Following", body: "Tap the heart to Like a thought. Follow other users to see their thoughts in your Following feed. The Follow button appears on every card from someone you don't follow yet.", highlight: "Follow the gardeners whose thoughts you want to see." },
  { emoji: "🏷️", title: "Explore & Discover", body: "Use the Explore page to search for users and topics. Find new voices and add them to your garden.", highlight: null },
  { emoji: "🌱", title: "You're all set", body: "Your feed has two tabs: For you and Following. Post your own thoughts from the compose button. Tend your garden thoughtfully.", highlight: null },
];

export function OnboardingModal({ onDismiss }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const modalRef = useRef(null);
  const previousFocus = useRef(null);

  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    return Array.from(
      modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );
  }, []);

  const trapFocus = useCallback((e) => {
    const focusable = getFocusableElements();
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, [getFocusableElements]);

  useEffect(() => {
    previousFocus.current = document.activeElement;
    const timer = setTimeout(() => {
      const focusable = getFocusableElements();
      if (focusable.length > 0) focusable[0].focus();
    }, 0);
    document.addEventListener("keydown", trapFocus);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", trapFocus);
      previousFocus.current?.focus();
    };
  }, [trapFocus, getFocusableElements]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(42,42,37,0.45)] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Getting started with Grove"
    >
      <div
        ref={modalRef}
        className="w-full max-w-[460px] rounded-3xl overflow-hidden shadow-2xl bg-card border border-border/80 font-['Nunito',sans-serif]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">
            Getting started · {step + 1}/{STEPS.length}
          </span>
          <button
            onClick={onDismiss}
            aria-label="Close onboarding"
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-secondary transition-colors text-switch-background"
          >
            <X size={15} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 mb-5">
          <div className="h-1 rounded-full bg-[rgba(42,42,37,0.1)]">
            <div
              className="h-full rounded-full transition-all duration-500 bg-primary"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-2 min-h-[220px]">
          <div className="text-5xl mb-4">{current.emoji}</div>
          <h2 className="text-foreground text-[22px] mb-3 font-extrabold">
            {current.title}
          </h2>
          <p className="text-[15px] leading-relaxed text-[#5A5A52]">
            {current.body}
          </p>

          {/* Swipe visual */}
          {current.visual === "swipe" && (
            <div className="mt-4 flex items-center gap-4 justify-center">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-[13px] border-destructive text-destructive font-bold">
                  ← Swipe left
                </div>
                <span className="text-xs text-muted-foreground">Next thought</span>
              </div>
              <div className="w-12 h-16 rounded-xl shadow-md flex-shrink-0 bg-gradient-to-br from-card to-secondary border-[1.5px] border-border" />
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-[13px] border-primary text-primary font-bold">
                  Swipe right →
                </div>
                <span className="text-xs text-muted-foreground">Like</span>
              </div>
            </div>
          )}

          {/* Highlight box */}
          {current.highlight && (
            <div className="mt-4 px-4 py-3 rounded-2xl text-[13px] leading-relaxed bg-primary/10 border-l-[3px] border-primary text-[#4A6B3F] font-semibold">
              {current.highlight}
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="flex items-center justify-between px-6 py-5">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            aria-label="Previous step"
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm transition-all disabled:opacity-0 text-muted-foreground font-semibold"
          >
            <ChevronLeft size={16} />
            Back
          </button>

          {/* Dot indicators */}
          <div className="flex gap-1.5" role="tablist" aria-label="Onboarding steps">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                role="tab"
                aria-selected={i === step}
                aria-label={`Step ${i + 1}: ${STEPS[i].title}`}
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
              aria-label="Finish and close onboarding"
              className="flex items-center gap-1.5 px-5 py-2 rounded-2xl text-sm transition-all hover:opacity-90 bg-primary text-card font-bold shadow-[0_4px_12px_rgba(107,143,94,0.3)]"
            >
              Enter Grove 🌿
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => s + 1)}
              aria-label="Next step"
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm transition-all hover:opacity-90 bg-primary text-card font-bold"
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
