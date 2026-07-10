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
    <>
      {/* Desktop sidebar — hidden below md */}
      <aside
        className="hidden md:flex flex-col h-screen sticky top-0 w-[72px] items-center py-4 gap-1.5 flex-shrink-0 z-50 border-r border-border/80 font-['Nunito',sans-serif]"
      >
        {/* Grove logo - always routes to Home */}
        <button
          onClick={() => handleNavClick(NAV_ITEMS[0])}
          title="Home"
          className="mb-3 w-10 h-10 rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 bg-primary shadow-[0_4px_14px_rgba(107,143,94,0.35)]"
        >
          <GroveMark />
        </button>

        {/* Nav items */}
        <div className="flex flex-col gap-0.5 flex-1 w-full items-center">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => handleNavClick({ id })}
                title={label}
                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all group hover:bg-secondary active:scale-95 ${
                  active ? "bg-primary/15" : "bg-transparent"
                }`}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.8 : 2.2}
                  className={active ? "text-primary" : "text-switch-background"}
                />

                {/* Right-edge active indicator */}
                {active && (
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-l-full bg-primary"
                  />
                )}

                {/* Hover tooltip */}
                <span
                  className="absolute left-full ml-3 px-2.5 py-1 rounded-xl text-xs whitespace-nowrap pointer-events-none z-50 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background font-bold"
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Compose */}
        <button
          onClick={onCompose}
          title="New Thought"
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:opacity-90 active:scale-95 mb-1 bg-primary shadow-[0_4px_14px_rgba(107,143,94,0.4)] text-primary-foreground"
        >
          <PenLine size={20} strokeWidth={2.4} />
        </button>

        {/* User profile avatar */}
        <button
          onClick={() => onTabChange("profile")}
          title={currentUser ? `@${currentUser.username} - View profile` : "View profile"}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 bg-primary text-card outline outline-2 outline-primary/40 outline-offset-2 font-extrabold text-sm"
        >
          {currentUser?.username?.charAt(0).toUpperCase() || "U"}
        </button>

        {/* Help */}
        <button
          onClick={onShowOnboarding}
          title="How Grove works"
          className="w-7 h-7 rounded-full flex items-center justify-center mt-1 mb-1 transition-all hover:bg-secondary border border-border text-switch-background"
        >
          <span className="text-xs font-extrabold">?</span>
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          title="Sign out"
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-red-100 active:scale-95 border border-border text-switch-background"
        >
          <span className="text-xs font-extrabold">⌽</span>
        </button>
      </aside>

      {/* Mobile bottom navigation — shown only below md */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-card border-t border-border/80 font-['Nunito',sans-serif]"
      >
        <div className="flex items-center justify-around h-full px-2">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => handleNavClick({ id })}
                title={label}
                className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl transition-colors active:scale-90 ${
                  active ? "text-primary bg-primary/10" : "text-switch-background bg-transparent"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.8 : 2.2} />
              </button>
            );
          })}

          {/* Compose */}
          <button
            onClick={onCompose}
            title="New Thought"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl active:scale-90 text-primary-foreground bg-primary"
          >
            <PenLine size={20} strokeWidth={2.4} />
          </button>

          {/* Profile avatar */}
          <button
            onClick={() => onTabChange("profile")}
            title={currentUser ? `@${currentUser.username}` : "Profile"}
            className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center bg-primary text-card outline outline-2 outline-primary/40 outline-offset-2 font-extrabold text-sm"
          >
            {currentUser?.username?.charAt(0).toUpperCase() || "U"}
          </button>
        </div>
      </nav>
    </>
  );
}

function GroveMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 20V10" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M11 10C11 10 7 7 5 2c3 0 5.5 1.5 6.5 4.5C12.5 3.5 15 2 18 2c-2 5-7 8-7 8z" fill="white" opacity="0.9" />
      <path d="M11 15C11 15 8.5 12.5 7 9c2 0 3.5 1 4.5 2.5C12.5 10 14 9 16 9c-1.5 3.5-5 6-5 6z" fill="white" />
    </svg>
  );
}
