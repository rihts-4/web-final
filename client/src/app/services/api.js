const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
    const token = localStorage.getItem("auth_token");

    const defaultHeaders = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ message: "An unexpected error occurred" }));
        throw new Error(error.message || "Network response was not ok");
    }

    return response.json();
}

export const api = {
    auth: {
        // login: (credentials) => request('/auth/login', {
        //   method: 'POST',
        //   body: JSON.stringify(credentials),
        // }),
        login: (credentials) => ({
            name: "",
            handle: "",
            avatar: "",
            verified: true,
        }),
        // signup: (userData) => request('/auth/signup', {
        //   method: 'POST',
        //   body: JSON.stringify(userData),
        // }),
        signup: (userData) => ({
            name: "",
            handle: "",
            avatar: "",
            verified: true,
        }),
        // me: () => request('/auth/me'),
        me: () => ({
            name: "",
            handle: "",
            avatar: "",
            verified: true,
        }),
    },
    posts: {
        // getAll: (params = {}) => {
        //   const query = new URLSearchParams(params).toString();
        //   return request(`/posts${query ? `?${query}` : ''}`);
        // },
        getAll: (params = {}) => [
            {
                id: "1",
                user: {
                    name: "Amara Sol",
                    handle: "amarasol",
                    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&auto=format",
                    verified: true,
                },
                content:
                    "Slow mornings are underrated. There's a kind of intelligence that only comes through stillness — ideas don't rush, they settle like sediment.",
                audioLabel: "Morning Reflection — 1:24",
                audioDuration: "1:24",
                timestamp: "2h ago",
                likes: 4820,
                replies: 430,
                reposts: 980,
                tags: ["mindfulness", "slowliving"],
                liked: false,
            },
            {
                id: "2",
                user: {
                    name: "Rowan Ashby",
                    handle: "rowanashby",
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
                    verified: false,
                },
                content:
                    "Every great design begins with restraint. The feature you don't build is often the one that saves the product.\n\nThe best interfaces are the ones people don't notice.",
                image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=340&fit=crop&auto=format",
                timestamp: "4h ago",
                likes: 7210,
                replies: 890,
                reposts: 1840,
                tags: ["design", "ux"],
                liked: true,
            },
            {
                id: "3",
                user: {
                    name: "Zara Finch",
                    handle: "zarafinch",
                    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format",
                    verified: true,
                },
                content:
                    "Our forests absorb 2.6 billion tons of CO₂ per year. Not through technology. Through patience, root systems, and time.\n\nNature built the original carbon capture system. We're still learning from it.",
                audioLabel: "Forest Soundscape — 3:07",
                audioDuration: "3:07",
                timestamp: "6h ago",
                likes: 15400,
                replies: 1200,
                reposts: 4700,
                tags: ["ecology", "climate"],
                liked: false,
                bookmarked: true,
            },
            {
                id: "4",
                user: {
                    name: "Felix Osei",
                    handle: "felixosei",
                    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format",
                    verified: false,
                },
                content:
                    "Shipped a feature today that required removing 400 lines of code. The team cheered. That's how you know the culture is healthy.",
                timestamp: "8h ago",
                likes: 8900,
                replies: 430,
                reposts: 2100,
                tags: ["engineering"],
                liked: false,
            },
            {
                id: "5",
                user: {
                    name: "Mila Voss",
                    handle: "milavoss",
                    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=80&h=80&fit=crop&auto=format",
                    verified: true,
                },
                content:
                    "Walking 10,000 steps today instead of going to a meeting. The problems I was asked to solve in the meeting solved themselves by the time I got back.",
                image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=380&fit=crop&auto=format",
                audioLabel: "Walk Ambient — 0:48",
                audioDuration: "0:48",
                timestamp: "12h ago",
                likes: 11200,
                replies: 2800,
                reposts: 3400,
                tags: ["nature", "slowliving"],
                liked: false,
            },
            {
                id: "6",
                user: {
                    name: "Idris Kamara",
                    handle: "idriskamara",
                    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=80&h=80&fit=crop&auto=format",
                    verified: true,
                },
                content:
                    "The most sustainable thing you can build is something people actually want to keep. Not because they're locked in — because they'd miss it.",
                timestamp: "1d ago",
                likes: 22000,
                replies: 5400,
                reposts: 6800,
                tags: ["product", "sustainability"],
                liked: false,
            },
        ],
        // create: (postData) =>
        //     request("/posts", {
        //         method: "POST",
        //         body: JSON.stringify(postData),
        //     }),
        create: (postData) => console.log(postData),
        // like: (id) => request(`/posts/${id}/like`, { method: 'POST' }),
        like: (id) => console.log(id),
        // repost: (id) => request(`/posts/${id}/repost`, { method: 'POST' }),
        repost: (id) => console.log(id),
        // bookmark: (id) => request(`/posts/${id}/bookmark`, { method: 'POST' }),
        bookmark: (id) => console.log(id),
    },
    topics: {
        // getTrending: () => request('/topics'),
        getTrending: () => console.log(),
    },
    notifications: {
        // get: () => request('/notifications'),
        get: () => console.log(),
    },
    user: {
        // getProfile: (handle) => request(`/user/${handle}`),
        getProfile: (handle) => console.log(handle),
    },
};
