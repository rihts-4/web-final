import { Home, Compass, Bell, User, PenLine } from "lucide-react";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "notifications", label: "Ripples", icon: Bell },
  { id: "profile", label: "Profile", icon: User },
];

export function Sidebar({
  activeTab,
  onTabChange,
  onCompose,
  onShowOnboarding,
  onLogout,
  currentUser,
}) {
  const handleNavClick = (item) => {
    onTabChange?.(item.id);
  };

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 w-[72px] items-center py-4 gap-1.5 flex-shrink-0 z-50"
      style={{
        borderRight: "1px solid rgba(42,42,37,0.1)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Grove logo - always routes to Home */}
      <button
        onClick={() => handleNavClick(NAV_ITEMS[0])}
        title="Home"
        className="mb-3 w-10 h-10 rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style={{
          background: "#6B8F5E",
          boxShadow: "0 4px 14px rgba(107,143,94,0.35)",
        }}
      >
        <GroveMark />
      </button>

      {/* Nav items
           Inactive:  strokeWidth 2.2  (visibly solid, not hairline)
           Active:    strokeWidth 2.8  (noticeably bolder)
        */}
      <div className="flex flex-col gap-0.5 flex-1 w-full items-center">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => handleNavClick({ id })}
              title={label}
              className="relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all group hover:bg-secondary active:scale-95"
              style={{
                background: active ? "rgba(107,143,94,0.15)" : "transparent",
              }}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.8 : 2.2}
                style={{
                  color: active ? "#6B8F5E" : "#B5B0A4",
                }}
              />

              {/* Right-edge active indicator */}
              {active && (
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-l-full"
                  style={{ background: "#6B8F5E" }}
                />
              )}

              {/* Hover tooltip */}
              <span
                className="absolute left-full ml-3 px-2.5 py-1 rounded-xl text-[12px] whitespace-nowrap pointer-events-none z-50 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: "#2A2A25",
                  color: "#F4F0E6",
                  fontWeight: 700,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Compose - routes to new-thought modal */}
      <button
        onClick={onCompose}
        title="New Thought"
        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:opacity-90 active:scale-95 mb-1"
        style={{
          background: "#6B8F5E",
          boxShadow: "0 4px 14px rgba(107,143,94,0.4)",
          color: "white",
        }}
      >
        <PenLine size={20} strokeWidth={2.4} />
      </button>

      {/* User profile - routes to Profile */}
      <button
        onClick={() => onTabChange("profile")}
        title={currentUser ? `@${currentUser.username} - View profile` : "View profile"}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style={{
          background: "#6B8F5E",
          color: "#FDFAF4",
          outline: "2px solid rgba(107,143,94,0.4)",
          outlineOffset: 2,
          fontWeight: 800,
          fontSize: "14px",
        }}
      >
        {currentUser?.username?.charAt(0).toUpperCase() || "U"}
      </button>

      {/* Help button - reopens onboarding */}
      <button
        onClick={onShowOnboarding}
        title="How Grove works"
        className="w-7 h-7 rounded-full flex items-center justify-center mt-1 mb-1 transition-all hover:bg-secondary"
        style={{
          border: "1.5px solid rgba(42,42,37,0.15)",
          color: "#B5B0A4",
        }}
      >
        <span className="text-[12px]" style={{ fontWeight: 800 }}>
          ?
        </span>
      </button>

      {/* Logout button */}
      <button
        onClick={onLogout}
        title="Sign out"
        className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-red-100 active:scale-95"
        style={{
          border: "1.5px solid rgba(42,42,37,0.15)",
          color: "#B5B0A4",
        }}
      >
        <span className="text-[12px]" style={{ fontWeight: 800 }}>
          ⌽
        </span>
      </button>
    </aside>
  );
}

function GroveMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M11 20V10"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      <path
        d="M11 10C11 10 7 7 5 2c3 0 5.5 1.5 6.5 4.5C12.5 3.5 15 2 18 2c-2 5-7 8-7 8z"
        fill="white"
        opacity="0.9"
      />

      <path
        d="M11 15C11 15 8.5 12.5 7 9c2 0 3.5 1 4.5 2.5C12.5 10 14 9 16 9c-1.5 3.5-5 6-5 6z"
        fill="white"
      />
    </svg>
  );
}
