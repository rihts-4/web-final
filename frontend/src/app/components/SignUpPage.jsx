import { useState } from "react";
import { ArrowLeft, User, AtSign, Leaf } from "lucide-react";

export function SignUpPage({ onComplete, onBack }) {
    const [step, setStep] = useState("info");
    const [name, setName] = useState("");
    const [handle, setHandle] = useState("");

    const INTERESTS = [
        { label: "Slow Living", emoji: "🍃" },
        { label: "Ecology", emoji: "🌿" },
        { label: "Design", emoji: "✏️" },
        { label: "Mindfulness", emoji: "🧘" },
        { label: "Science", emoji: "🔬" },
        { label: "Writing", emoji: "📝" },
        { label: "Nature", emoji: "🌳" },
        { label: "Sustainability", emoji: "♻️" },
    ];
    const [selected, setSelected] = useState(new Set());

    const toggle = (label) =>
        setSelected((s) => {
            const next = new Set(s);
            next.has(label) ? next.delete(label) : next.add(label);
            return next;
        });

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background font-['Nunito',sans-serif]">
            {/* Background blobs */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
                <ellipse cx="200" cy="200" rx="260" ry="200" fill="rgba(107,143,94,0.07)" />
                <ellipse cx="1000" cy="600" rx="300" ry="220" fill="rgba(107,143,94,0.05)" />
                <ellipse cx="600" cy="700" rx="400" ry="150" fill="rgba(143,171,128,0.06)" />
            </svg>

            <div className="relative z-10 w-full max-w-[440px] mx-4 rounded-3xl shadow-xl overflow-hidden bg-card border border-border/60">
                {/* Header */}
                <div className="flex items-center gap-3 px-6 pt-6 pb-2">
                    <button
                        onClick={step === "info" ? onBack : () => setStep("info")}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-secondary text-muted-foreground"
                    >
                        <ArrowLeft size={17} strokeWidth={2.3} />
                    </button>
                    <div className="flex-1">
                        <div className="flex gap-1.5">
                            {["info", "interests"].map((s, i) => (
                                <div
                                    key={s}
                                    className={`h-1 flex-1 rounded-full transition-all ${
                                        (step === "info" && i === 0) || step === "interests"
                                            ? "bg-primary"
                                            : "bg-[rgba(42,42,37,0.12)]"
                                    }`}
                                />
                            ))}
                        </div>
                        <p className="text-[11px] mt-1 text-switch-background font-medium">
                            Step {step === "info" ? 1 : 2} of 2
                        </p>
                    </div>
                </div>

                <div className="px-6 pt-4 pb-6">
                    {step === "info" ? (
                        <>
                            {/* Step 1 — basic info */}
                            <div className="flex items-center gap-2 mb-1">
                                <Leaf size={18} strokeWidth={2.2} className="text-primary" />
                                <h2 className="text-foreground text-[22px] font-extrabold">
                                    Plant your seed
                                </h2>
                            </div>
                            <p className="text-sm mb-6 text-muted-foreground">
                                Tell us a little about yourself. Nothing is required.
                            </p>

                            <div className="flex flex-col gap-3 mb-6">
                                {/* Name */}
                                <div className="relative">
                                    <User size={15} strokeWidth={2.2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-switch-background" />
                                    <input
                                        type="text"
                                        placeholder="Display name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full rounded-2xl pl-10 pr-4 py-3 text-[15px] outline-none transition-all bg-input-background text-foreground border-[1.5px] border-transparent font-['Nunito',sans-serif] focus:border-primary focus:bg-card"
                                    />
                                </div>

                                {/* Handle */}
                                <div className="relative">
                                    <AtSign size={15} strokeWidth={2.2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-switch-background" />
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={handle}
                                        onChange={(e) => setHandle(e.target.value.replace(/[^a-z0-9_]/gi, "").toLowerCase())}
                                        className="w-full rounded-2xl pl-10 pr-4 py-3 text-[15px] outline-none transition-all bg-input-background text-foreground border-[1.5px] border-transparent font-['Nunito',sans-serif] focus:border-primary focus:bg-card"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => setStep("interests")}
                                className="w-full py-3.5 rounded-2xl text-[15px] transition-all hover:opacity-90 active:scale-[0.98] bg-primary text-card font-extrabold shadow-[0_6px_18px_rgba(107,143,94,0.35)]"
                            >
                                Continue →
                            </button>
                            <button
                                onClick={onComplete}
                                className="w-full py-2 mt-2 text-[13px] transition-colors hover:underline text-switch-background font-medium"
                            >
                                Skip for now
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Step 2 — interests */}
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">🌱</span>
                                <h2 className="text-foreground text-[22px] font-extrabold">
                                    Pick your garden
                                </h2>
                            </div>
                            <p className="text-sm mb-5 text-muted-foreground">
                                Choose topics you care about. We'll seed your feed with them.
                            </p>

                            <div className="grid grid-cols-2 gap-2 mb-6">
                                {INTERESTS.map(({ label, emoji }) => {
                                    const on = selected.has(label);
                                    return (
                                        <button
                                            key={label}
                                            onClick={() => toggle(label)}
                                            className="flex items-center gap-2 px-3.5 py-3 rounded-2xl text-left transition-all active:scale-95"
                                            style={{
                                                background: on ? "rgba(107,143,94,0.15)" : "#EAE5D8",
                                                border: `1.5px solid ${on ? "#6B8F5E" : "transparent"}`,
                                                color: on ? "#4A6B3F" : "#5A5A52",
                                                fontWeight: on ? 700 : 500,
                                            }}
                                        >
                                            <span className="text-lg">{emoji}</span>
                                            <span className="text-[13px]">{label}</span>
                                            {on && (
                                                <span className="ml-auto text-sm text-primary">✓</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={onComplete}
                                className="w-full py-3.5 rounded-2xl text-[15px] transition-all hover:opacity-90 active:scale-[0.98] bg-primary text-card font-extrabold shadow-[0_6px_18px_rgba(107,143,94,0.35)]"
                            >
                                Enter Grove 🌿
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
