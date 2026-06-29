interface ProfilePageProps {
  user: { name: string; handle: string; avatar: string };
}

const MEDIA_IMAGES = [
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=200&h=200&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=200&h=200&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?w=200&h=200&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=200&h=200&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1520962880247-cfaf541c8724?w=200&h=200&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=200&h=200&fit=crop&auto=format",
];

export function ProfilePage({ user }: ProfilePageProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header banner */}
      <div className="relative h-32 flex-shrink-0" style={{ background: "linear-gradient(135deg, #c8dfc2 0%, #e8f0e4 50%, #d4e6cd 100%)" }}>
        {/* Organic blob shapes */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 128" preserveAspectRatio="xMidYMid slice">
          <ellipse cx="120" cy="60" rx="90" ry="70" fill="rgba(107,143,94,0.15)" />
          <ellipse cx="480" cy="40" rx="120" ry="80" fill="rgba(107,143,94,0.1)" />
          <ellipse cx="300" cy="100" rx="150" ry="60" fill="rgba(143,171,128,0.12)" />
        </svg>
      </div>

      <div className="px-6 flex-shrink-0">
        {/* Avatar + edit */}
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div
            className="w-20 h-20 rounded-full overflow-hidden"
            style={{ outline: "3px solid #F4F0E6", outlineOffset: 0, boxShadow: "0 0 0 3px #6B8F5E" }}
          >
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <button
            className="rounded-2xl px-4 py-2 text-[13px] border transition-colors hover:bg-secondary"
            style={{ borderColor: "rgba(42,42,37,0.2)", fontWeight: 700, color: "#2A2A25" }}
          >
            Edit profile
          </button>
        </div>

        {/* Info */}
        <div className="mb-5">
          <h1 className="text-foreground text-[20px] mb-0.5" style={{ fontWeight: 800 }}>{user.name}</h1>
          <p className="text-muted-foreground text-[14px] mb-3">@{user.handle}</p>
          <p className="text-foreground text-[14px] leading-relaxed mb-3">
            Slow design advocate. Building with intention. Nature-first thinker. 🌿
          </p>
          <div className="flex items-center gap-5 text-[14px]">
            <span><b className="text-foreground">482</b> <span className="text-muted-foreground">following</span></span>
            <span><b className="text-foreground">12.3K</b> <span className="text-muted-foreground">followers</span></span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-5" style={{ borderColor: "rgba(42,42,37,0.1)" }}>
          {["Thoughts", "Media", "Sprouts"].map((tab, i) => (
            <button
              key={tab}
              className="flex-1 py-3 text-[13px] transition-colors relative"
              style={{
                fontWeight: i === 0 ? 700 : 500,
                color: i === 0 ? "#2A2A25" : "#B5B0A4",
              }}
            >
              {tab}
              {i === 0 && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full" style={{ background: "#6B8F5E" }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Circular media grid */}
      <div className="px-6">
        <h3 className="text-[13px] text-muted-foreground mb-4 uppercase tracking-wider" style={{ fontWeight: 600 }}>Media Garden</h3>

        {/* Circular grid — organic scattered layout */}
        <div className="relative" style={{ height: 320 }}>
          {/* Large center circle */}
          <div className="absolute rounded-full overflow-hidden"
            style={{ width: 140, height: 140, top: 80, left: "50%", transform: "translateX(-50%)", boxShadow: "0 8px 24px rgba(42,42,37,0.14)" }}>
            <img src={MEDIA_IMAGES[0]} className="w-full h-full object-cover" alt="media" />
          </div>

          {/* Orbit circles */}
          {[
            { size: 90, top: 10, left: "15%", img: 1 },
            { size: 80, top: 0, left: "62%", img: 2 },
            { size: 75, top: 130, left: "5%", img: 3 },
            { size: 85, top: 160, right: "8%", img: 4 },
            { size: 70, top: 240, left: "20%", img: 5 },
            { size: 68, top: 245, left: "58%", img: 6 },
          ].map((c, i) => (
            <div
              key={i}
              className="absolute rounded-full overflow-hidden hover:scale-105 transition-transform cursor-pointer"
              style={{
                width: c.size,
                height: c.size,
                top: c.top,
                left: "left" in c ? c.left : undefined,
                right: "right" in c ? c.right : undefined,
                boxShadow: "0 4px 14px rgba(42,42,37,0.12)",
                outline: "2px solid rgba(107,143,94,0.2)",
                outlineOffset: 2,
              }}
            >
              <img src={MEDIA_IMAGES[c.img]} className="w-full h-full object-cover" alt="media" />
            </div>
          ))}

          {/* Connecting lines (decorative) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
            <line x1="50%" y1="150" x2="20%" y2="55" stroke="rgba(107,143,94,0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="50%" y1="150" x2="75%" y2="40" stroke="rgba(107,143,94,0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="50%" y1="150" x2="10%" y2="185" stroke="rgba(107,143,94,0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="50%" y1="150" x2="88%" y2="200" stroke="rgba(107,143,94,0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
          </svg>
        </div>
      </div>
    </div>
  );
}
