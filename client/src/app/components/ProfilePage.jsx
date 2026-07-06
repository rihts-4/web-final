import { useState } from "react";
import { Camera, MapPin, Link2, Calendar } from "lucide-react";
import { UserAvatar } from "./ThoughtCard";

const MEDIA_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop&auto=format",
    size: 130,
    top: 72,
    left: "calc(50% - 65px)",
  },
  {
    src: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=200&h=200&fit=crop&auto=format",
    size: 88,
    top: 8,
    left: "12%",
  },
  {
    src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=200&h=200&fit=crop&auto=format",
    size: 82,
    top: 5,
    left: "62%",
  },
  {
    src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=200&h=200&fit=crop&auto=format",
    size: 76,
    top: 125,
    left: "5%",
  },
  {
    src: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=200&h=200&fit=crop&auto=format",
    size: 80,
    top: 140,
    right: "5%",
  },
  {
    src: "https://images.unsplash.com/photo-1520962880247-cfaf541c8724?w=200&h=200&fit=crop&auto=format",
    size: 70,
    top: 228,
    left: "18%",
  },
  {
    src: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=200&h=200&fit=crop&auto=format",
    size: 70,
    top: 235,
    right: "15%",
  },
];

export function ProfilePage({ user }) {
  const [tab, setTab] = useState("Thoughts");
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(
    "Slow design advocate. Building with intention. Nature-first thinker. 🌿",
  );

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {/* Banner */}
      <div
        className="relative h-32 flex-shrink-0"
        style={{
          background:
            "linear-gradient(135deg, #c8dfc2 0%, #e8f0e4 60%, #d4e6cd 100%)",
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 600 128"
          preserveAspectRatio="xMidYMid slice"
        >
          <ellipse
            cx="100"
            cy="60"
            rx="100"
            ry="80"
            fill="rgba(107,143,94,0.14)"
          />
          <ellipse
            cx="480"
            cy="40"
            rx="130"
            ry="90"
            fill="rgba(107,143,94,0.1)"
          />
          <ellipse
            cx="300"
            cy="110"
            rx="170"
            ry="65"
            fill="rgba(143,171,128,0.11)"
          />
        </svg>
        {/* Banner edit hint */}
        <button
          className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] transition-colors hover:bg-black/10"
          style={{
            background: "rgba(255,255,255,0.5)",
            color: "#4A6B3F",
            fontWeight: 600,
            backdropFilter: "blur(4px)",
          }}
        >
          <Camera size={13} />
          Edit banner
        </button>
      </div>

      <div className="px-5 flex-shrink-0">
        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div className="relative group cursor-pointer">
            <UserAvatar
              avatar={user.avatar}
              name={user.name}
              size={80}
              verified
            />
            <div
              className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(42,42,37,0.35)" }}
            >
              <Camera size={18} className="text-white" />
            </div>
          </div>

          <button
            className="rounded-2xl px-4 py-2 text-[13px] border transition-all hover:bg-secondary active:scale-[0.97]"
            style={{
              borderColor: "rgba(42,42,37,0.18)",
              fontWeight: 700,
              color: "#2A2A25",
            }}
          >
            Edit profile
          </button>
        </div>

        {/* Info */}
        <div className="mb-5">
          <h1
            className="text-foreground text-[20px] mb-0.5"
            style={{ fontWeight: 800 }}
          >
            {user.name}
          </h1>
          <p className="text-muted-foreground text-[14px] mb-3">
            @{user.handle}
          </p>

          {editingBio ? (
            <div className="mb-3">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full rounded-2xl px-3 py-2 text-[14px] resize-none outline-none"
                style={{
                  background: "#EAE5D8",
                  color: "#2A2A25",
                  border: "1.5px solid #6B8F5E",
                }}
              />

              <div className="flex gap-2 mt-1.5">
                <button
                  onClick={() => setEditingBio(false)}
                  className="px-3 py-1 rounded-xl text-[12px]"
                  style={{
                    background: "#6B8F5E",
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingBio(false)}
                  className="px-3 py-1 rounded-xl text-[12px]"
                  style={{
                    background: "rgba(42,42,37,0.08)",
                    color: "#7D7D72",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p
              className="text-foreground text-[14px] leading-relaxed mb-3 cursor-text"
              onClick={() => setEditingBio(true)}
              title="Click to edit"
            >
              {bio}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3 text-[13px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin size={13} /> San Francisco, CA
            </span>
            <span className="flex items-center gap-1">
              <Link2 size={13} /> grove.app/@{user.handle}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={13} /> Joined March 2024
            </span>
          </div>

          <div className="flex items-center gap-5 text-[14px]">
            <button className="hover:underline">
              <b className="text-foreground">482</b>{" "}
              <span className="text-muted-foreground">following</span>
            </button>
            <button className="hover:underline">
              <b className="text-foreground">12.3K</b>{" "}
              <span className="text-muted-foreground">followers</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex"
          style={{ borderBottom: "1px solid rgba(42,42,37,0.1)" }}
        >
          {["Thoughts", "Media", "Sprouts"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-3 text-[13px] relative transition-colors"
              style={{
                fontWeight: t === tab ? 700 : 500,
                color: t === tab ? "#2A2A25" : "#B5B0A4",
              }}
            >
              {t}
              {t === tab && (
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full"
                  style={{ background: "#6B8F5E" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {tab === "Media" ? (
        <div className="px-5 py-5">
          <p
            className="text-[12px] uppercase tracking-wider mb-4"
            style={{ color: "#7D7D72", fontWeight: 700 }}
          >
            Media Garden — {MEDIA_IMAGES.length} photos
          </p>

          {/* Circular constellation grid */}
          <div className="relative" style={{ height: 330 }}>
            {/* Dashed connection lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 0 }}
            >
              <line
                x1="50%"
                y1="137"
                x2="12%"
                y2="52"
                stroke="rgba(107,143,94,0.2)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1="50%"
                y1="137"
                x2="62%"
                y2="46"
                stroke="rgba(107,143,94,0.2)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1="50%"
                y1="137"
                x2="5%"
                y2="163"
                stroke="rgba(107,143,94,0.2)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1="50%"
                y1="137"
                x2="95%"
                y2="180"
                stroke="rgba(107,143,94,0.2)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1="50%"
                y1="137"
                x2="18%"
                y2="263"
                stroke="rgba(107,143,94,0.2)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1="50%"
                y1="137"
                x2="85%"
                y2="270"
                stroke="rgba(107,143,94,0.2)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </svg>

            {MEDIA_IMAGES.map((img, i) => (
              <div
                key={i}
                className="absolute rounded-full overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                style={{
                  width: img.size,
                  height: img.size,
                  top: img.top,
                  left: "left" in img ? img.left : undefined,
                  right: "right" in img ? img.right : undefined,
                  boxShadow:
                    i === 0
                      ? "0 8px 28px rgba(42,42,37,0.18)"
                      : "0 4px 14px rgba(42,42,37,0.11)",
                  outline: "2.5px solid rgba(107,143,94,0.2)",
                  outlineOffset: 3,
                  zIndex: i === 0 ? 2 : 1,
                }}
              >
                <img
                  src={img.src}
                  alt={`Media ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      ) : tab === "Sprouts" ? (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <span className="text-5xl mb-4">❤️</span>
          <h3
            className="text-foreground text-[18px] mb-2"
            style={{ fontWeight: 800 }}
          >
            Liked thoughts
          </h3>
          <p className="text-muted-foreground text-[14px] leading-relaxed">
            Thoughts you've liked (sprouted) will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <span className="text-5xl mb-4">🌱</span>
          <h3
            className="text-foreground text-[18px] mb-2"
            style={{ fontWeight: 800 }}
          >
            No thoughts yet
          </h3>
          <p className="text-muted-foreground text-[14px] leading-relaxed">
            Plant your first thought — your posts will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
