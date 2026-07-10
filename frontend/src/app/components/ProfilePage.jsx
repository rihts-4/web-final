import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { UserAvatar } from "./ThoughtCard";
import { useUser } from "../context/UserContext";
import { api, IMAGE_BASE } from "../services/api";
import { DeckFeed } from "./DeckFeed";

export function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: contextUser, setUser } = useUser();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [followError, setFollowError] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const targetUsername = username || contextUser?.username;

  useEffect(() => {
    if (!contextUser) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (err) {
          console.error("Failed to parse stored user:", err);
        }
      }
    }
  }, [contextUser, setUser]);

  useEffect(() => {
    if (targetUsername) {
      const fetchProfile = async () => {
        setProfileLoading(true);
        try {
          const data = await api.users.getProfile(targetUsername);
          setProfile(data);
          setIsFollowing(data.isFollowing || false);

          const isOwnProfile = !username || username === contextUser?.username;
          const displayUser = isOwnProfile ? contextUser : data.user;

          const transformedPosts = (data.posts || []).map((post) => ({
            id: String(post.id),
            userId: post.user_id,
            user: {
              name: displayUser?.display_name || data.user.display_name,
              handle: displayUser?.username || data.user.username,
            },
            content: post.content,
            image: post.image_path ? `${IMAGE_BASE}${post.image_path}` : null,
            timestamp: new Date(post.created_at).toLocaleDateString(),
            likes: post.like_count || 0,
            liked: post.liked === 1,
            isFollowing: post.is_following === 1,
          }));
          setPosts(transformedPosts);
        } catch (err) {
          console.error("Failed to fetch profile:", err);
        } finally {
          setProfileLoading(false);
        }
      };
      fetchProfile();
    }
  }, [targetUsername, username, contextUser]);

  if (profileLoading || !profile) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const isOwnProfile = !username || username === contextUser?.username;

  const handleFollowToggle = async () => {
    setFollowError(null);
    setIsLoading(true);
    try {
      if (isFollowing) {
        await api.users.unfollow(profile.user.id);
        setIsFollowing(false);
      } else {
        await api.users.follow(profile.user.id);
        setIsFollowing(true);
      }
    } catch (err) {
      setFollowError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (id) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    if (post.liked) {
      await api.posts.unlike(id);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, liked: false, likes: Math.max(0, p.likes - 1) }
            : p,
        ),
      );
    } else {
      await api.posts.like(id);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, liked: true, likes: p.likes + 1 } : p,
        ),
      );
    }
  };

  const handlePostFollow = async (id) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    if (post.isFollowing) {
      await api.users.unfollow(post.userId);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isFollowing: false } : p
        ),
      );
    } else {
      await api.users.follow(post.userId);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isFollowing: true } : p
        ),
      );
    }
  };

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {!isOwnProfile && (
        <div
          className="px-5 py-3 flex-shrink-0"
          style={{
            borderBottom: "1px solid rgba(42,42,37,0.08)",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[14px]"
            style={{ color: "#6B8F5E", fontWeight: 700 }}
          >
            ← Back
          </button>
        </div>
      )}

      <div
        className="px-5 pt-4 pb-4 flex-shrink-0"
        style={{
          borderBottom: "1px solid rgba(42,42,37,0.08)",
        }}
      >
        <div className="flex items-start gap-4 justify-between">
          <div className="flex items-start gap-4">
            <UserAvatar handle={profile.user.username} name={profile.user.display_name} size={64} />

            <div className="flex-1 min-w-0">
              <h1
                className="text-foreground text-[20px] mb-0.5"
                style={{ fontWeight: 800 }}
              >
                {profile.user.display_name}
              </h1>
              <p className="text-muted-foreground text-[14px] mb-3">
                @{profile.user.username}
              </p>

              <p className="text-foreground text-[14px] leading-relaxed mb-3">
                Thoughts matter. Ideas grow in good soil.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1 text-muted-foreground text-[13px]">
                  <span style={{ fontWeight: 700, color: "#2A2A25" }}>
                    {profile.followers || 0}
                  </span>
                  <span>Followers</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-[13px]">
                  <span style={{ fontWeight: 700, color: "#2A2A25" }}>
                    {profile.following || 0}
                  </span>
                  <span>Following</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-[13px]">
                  <Calendar size={14} />
                  <span>Joined {new Date(profile.user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {!isOwnProfile && (
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={handleFollowToggle}
                disabled={isLoading}
                className="px-6 py-2 rounded-xl text-[14px] transition-all hover:opacity-90 active:scale-95 flex-shrink-0"
                style={{
                  background: isFollowing ? "rgba(107,143,94,0.12)" : "#6B8F5E",
                  color: isFollowing ? "#6B8F5E" : "#FDFAF4",
                  fontWeight: 700,
                  border: isFollowing ? "1.5px solid #6B8F5E" : "none",
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                {isLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
              </button>
              {followError && (
                <p className="text-[12px] text-right" style={{ color: "#C0453A", fontWeight: 600 }}>
                  {followError}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        className="px-5 py-3 flex-shrink-0"
        style={{
          borderBottom: "1px solid rgba(42,42,37,0.08)",
        }}
      >
        <h2
          className="text-foreground text-[15px]"
          style={{ fontWeight: 700 }}
        >
          {isOwnProfile ? "Your Thoughts" : "Thoughts"}
        </h2>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center px-8">
          <span className="text-5xl mb-4">🌱</span>
          <h2
            className="text-foreground text-[18px] mb-2"
            style={{ fontWeight: 800 }}
          >
            No thoughts yet
          </h2>
          <p className="text-muted-foreground text-[14px] leading-relaxed">
            {isOwnProfile
              ? "Start sharing your thoughts to grow your garden."
              : "This user hasn't shared any thoughts yet."}
          </p>
        </div>
      ) : (
        <DeckFeed
          posts={posts}
          onLike={handleLike}
          onFollow={handlePostFollow}
          currentUserHandle={contextUser?.username}
        />
      )}
    </div>
  );
}
