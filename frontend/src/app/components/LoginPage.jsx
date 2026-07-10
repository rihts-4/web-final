import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useUser } from "../context/UserContext";

export function LoginPage() {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [display, setDisplay] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const isLoginValid = username.trim() !== "" && password.trim() !== "";
    const isSignUpValid =
        username.trim() !== "" &&
        display.trim() !== "" &&
        password.trim() !== "" &&
        password === confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isSignUp && isSignUpValid) {
                await api.auth.signup({
                    username,
                    display_name: display,
                    password,
                });
                window.location.href = "/login";
            } else if (!isSignUp && isLoginValid) {
                const response = await api.auth.login({ username, password });
                localStorage.setItem("auth_token", response.token);
                localStorage.setItem("user", JSON.stringify(response.user));
                setUser(response.user);
                navigate("/");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background font-['Nunito',sans-serif]">
            {/* Organic background blobs */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 1200 800"
                preserveAspectRatio="xMidYMid slice"
            >
                <ellipse cx="100" cy="150" rx="250" ry="200" fill="rgba(107,143,94,0.08)" />
                <ellipse cx="1100" cy="650" rx="300" ry="220" fill="rgba(107,143,94,0.06)" />
                <ellipse cx="600" cy="720" rx="400" ry="160" fill="rgba(143,171,128,0.07)" />
                <ellipse cx="950" cy="100" rx="180" ry="140" fill="rgba(107,143,94,0.05)" />
                <ellipse cx="200" cy="680" rx="160" ry="120" fill="rgba(107,143,94,0.06)" />
            </svg>

            {/* Floating leaves */}
            <div className="absolute top-12 left-16 opacity-20 text-6xl rotate-[-20deg]">🌿</div>
            <div className="absolute bottom-20 right-20 opacity-15 text-5xl rotate-[15deg]">🍃</div>
            <div className="absolute top-1/3 right-10 opacity-10 text-4xl rotate-[-10deg]">🌱</div>

            {/* Main card */}
            <div className="relative z-10 w-full max-w-[440px] mx-4 rounded-3xl p-10 shadow-xl bg-card border border-border/60">
                {/* Logo */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-primary shadow-[0_8px_24px_rgba(107,143,94,0.35)]">
                        <GroveLogo />
                    </div>
                    <h1 className="text-[32px] tracking-tight mb-1 font-extrabold text-foreground">
                        grove
                    </h1>
                    <p className="text-center text-sm leading-relaxed text-muted-foreground max-w-[280px]">
                        {isSignUp
                            ? "Plant your roots and start sharing thoughts."
                            : "A slower, more intentional space for thoughts."}
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-3 mb-6"
                >
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl outline-none transition-all bg-input-background border-2 border-transparent text-foreground focus:border-primary focus:bg-card"
                    />

                    {isSignUp && (
                        <input
                            type="text"
                            placeholder="Display name"
                            value={display}
                            onChange={(e) => setDisplay(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl outline-none transition-all bg-input-background border-2 border-transparent text-foreground focus:border-primary focus:bg-card"
                        />
                    )}

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl outline-none transition-all bg-input-background border-2 border-transparent text-foreground focus:border-primary focus:bg-card"
                    />

                    {isSignUp && (
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl outline-none transition-all bg-input-background border-2 border-transparent text-foreground focus:border-primary focus:bg-card"
                        />
                    )}

                    {error && (
                        <p className="text-xs text-center text-destructive font-semibold">
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading || (isSignUp ? !isSignUpValid : !isLoginValid)}
                        className="w-full py-3.5 rounded-2xl text-base transition-all hover:opacity-90 active:scale-[0.98] mt-2 disabled:opacity-40 bg-primary text-card font-extrabold shadow-[0_6px_20px_rgba(107,143,94,0.35)]"
                    >
                        {isLoading ? "Loading..." : (isSignUp ? "Create account" : "Sign in to Grove")}
                    </button>
                </form>

                <button
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError(null);
                        setUsername("");
                        setPassword("");
                        setDisplay("");
                        setConfirmPassword("");
                    }}
                    className="w-full text-center text-xs font-bold transition-opacity hover:opacity-70 text-primary"
                    type="button"
                >
                    {isSignUp
                        ? "Already have an account? Sign in"
                        : "Need an account? Create one"}
                </button>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2 justify-center mt-7">
                    {[
                        "🍃 Slow feed",
                        "🎙️ Audio thoughts",
                        "🌱 Swipe to like",
                        "🔁 Re-root",
                    ].map((f) => (
                        <span
                            key={f}
                            className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold"
                        >
                            {f}
                        </span>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 mt-6 flex gap-4">
                {["Terms", "Privacy", "About"].map((item) => (
                    <a
                        key={item}
                        href="#"
                        className="text-xs hover:underline text-switch-background"
                    >
                        {item}
                    </a>
                ))}
            </div>
        </div>
    );
}

function GroveLogo() {
    return (
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <path d="M17 28V14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M17 14C17 14 11 10 8 4c4 0 7.5 2 9 5.5C18.5 6 22 4 26 4c-3 6-9 10-9 10z" fill="white" opacity="0.9" />
            <path d="M17 20C17 20 13 17 11 13c2.5 0 4.5 1.2 6 3.3C18.5 14.2 20.5 13 23 13c-2 4-6 7-6 7z" fill="white" />
        </svg>
    );
}
