import { useState, useEffect } from "react";
import { MapPin, Link2, Calendar } from "lucide-react";
import { UserAvatar } from "./ThoughtCard";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";
import { DeckFeed } from "./DeckFeed";

export function ProfilePage() {
  const { user, setUser } = useUser();
  const [posts, setPosts] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
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
  }, [user, setUser]);

  useEffect(() => {
    if (user) {
      const fetchProfileData = async () => {
        try {
          const data = await api.users.getProfile(user.username);
          setProfileData(data);
          
          const transformedPosts = (data.posts || []).map((post) => ({
            id: String(post.id),
            user: {
              name: user.display_name,
              handle: user.username,
            },
            content: post.content,
            image: post.image_path,
            timestamp: new Date(post.created_at).toLocaleDateString(),
            likes: post.like_count || 0,
            liked: false,
          }));
          setPosts(transformedPosts);
        } catch (err) {
          console.error("Failed to fetch profile data:", err);
        }
      };
      fetchProfileData();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const handleLike = async (id) => {
    console.log("Like post:", id);
  };

  const handleRepost = async (id) => {
    console.log("Repost:", id);
  };

  const handleBookmark = async (id) => {
    console.log("Bookmark:", id);
  };

  const handleFollowToggle = async () => {
    try {
      setIsLoading(true);
      if (isFollowing) {
        await api.users.unfollow(user.id);
        setIsFollowing(false);
      } else {
        await api.users.follow(user.id);
        setIsFollowing(true);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {/* Profile Header */}
      <div
        className="px-5 pt-4 pb-4 flex-shrink-0"
        style={{
          borderBottom: "1px solid rgba(42,42,37,0.08)",
        }}
      >
        <div className="flex items-start gap-4 justify-between">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <UserAvatar handle={user.username} name={user.display_name} size={64} />

            {/* User Info */}
            <div className="flex-1 min-w-0">
            <h1
              className="text-foreground text-[20px] mb-0.5"
              style={{ fontWeight: 800 }}
            >
              {user.display_name}
            </h1>
            <p className="text-muted-foreground text-[14px] mb-3">
              @{user.username}
            </p>

            {/* Bio */}
            <p className="text-foreground text-[14px] leading-relaxed mb-3">
              Thoughts matter. Ideas grow in good soil.
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1 text-muted-foreground text-[13px]">
                <span style={{ fontWeight: 700, color: "#2A2A25" }}>
                  {profileData?.followers || 0}
                </span>
                <span>Followers</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-[13px]">
                <span style={{ fontWeight: 700, color: "#2A2A25" }}>
                  {profileData?.following || 0}
                </span>
                <span>Following</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-[13px]">
                <Calendar size={14} />
                <span>Joined {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          </div>

          {/* Follow Button */}
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
            {isLoading ? "..." : isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      </div>

      {/* Posts Tab */}
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
          Your Thoughts
        </h2>
      </div>

      {/* Posts Feed */}
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
            Start sharing your thoughts to grow your garden.
          </p>
        </div>
      ) : (
        <DeckFeed
          posts={posts}
          onLike={handleLike}
          onRepost={handleRepost}
          onBookmark={handleBookmark}
        />
      )}
    </div>
  );
}
