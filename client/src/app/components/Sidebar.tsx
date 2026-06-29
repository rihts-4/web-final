import { Home, Compass, Bell, PenLine, Bookmark, User, Leaf } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCompose: () => void;
  currentUser: { name: string; handle: string; avatar: string };
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "notifications", label: "Ripples", icon: Bell },
  { id: "bookmarks", label: "Saved", icon: Bookmark },
  { id: "profile", label: "Profile", icon: User },
];

export function Sidebar({ activeTab, onTabChange, onCompose, currentUser }: SidebarProps) {
  return (
    <aside className="flex flex-col h-screen sticky top-0 w-[72px] items-center py-5 gap-2" style={{ borderRight: "1px solid rgba(42,42,37,0.1)" }}>
      {/* Grove Logo */}
      <button className="mb-3 w-10 h-10 rounded-2xl flex items-center justify-center transition-transform hover:scale-110"
        style={{ background: "#6B8F5E", boxShadow: "0 4px 12px rgba(107,143,94,0.35)" }}>
        <Leaf size={20} className="text-white" />
      </button>

      {/* Nav items */}
      <div className="flex flex-col gap-1 flex-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              title={label}
              className="relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all group"
              style={{
                background: isActive ? "rgba(107,143,94,0.15)" : "transparent",
                color: isActive ? "#6B8F5E" : "#B5B0A4",
              }}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-l-full" style={{ background: "#6B8F5E" }} />
              )}
              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg text-[12px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                style={{ background: "#2A2A25", color: "#F4F0E6", fontWeight: 600 }}>
                {label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Compose */}
      <button
        onClick={onCompose}
        title="New Thought"
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2 transition-all hover:scale-105"
        style={{ background: "#6B8F5E", boxShadow: "0 4px 14px rgba(107,143,94,0.4)", color: "white" }}
      >
        <PenLine size={20} />
      </button>

      {/* Avatar */}
      <button
        onClick={() => onTabChange("profile")}
        className="w-10 h-10 rounded-full overflow-hidden transition-transform hover:scale-105"
        style={{ outline: "2px solid rgba(107,143,94,0.4)", outlineOffset: 2 }}
      >
        <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
      </button>
    </aside>
  );
}
