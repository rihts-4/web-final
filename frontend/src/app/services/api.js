const BASE_URL = "http://localhost:3000/api";

async function request(endpoint, options = {}) {
    const token = localStorage.getItem("auth_token");

    const defaultHeaders = {};
    if (!(options.body instanceof FormData)) {
        defaultHeaders["Content-Type"] = "application/json";
    }
    if (token) {
        defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

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
        login: (credentials) =>
            request("/auth/login", {
                method: "POST",
                body: JSON.stringify(credentials),
            }),
        signup: (userData) =>
            request("/auth/register", {
                method: "POST",
                body: JSON.stringify(userData),
            }),
    },
    feed: {
        getPersonal: () => request("/feed"),
        getPublic: () => request("/feed/public"),
        getTrending: () => request("/feed/trending"),
    },
    posts: {
        create: (postData) => {
            const formData = new FormData();
            formData.append("content", postData.content);
            if (postData.image) {
                formData.append("image", postData.image);
            }
            return request("/posts", {
                method: "POST",
                body: formData,
            });
        },
        delete: (id) =>
            request(`/posts/${id}`, {
                method: "DELETE",
            }),
        like: (id) =>
            request(`/posts/${id}/like`, {
                method: "POST",
            }),
        unlike: (id) =>
            request(`/posts/${id}/like`, {
                method: "DELETE",
            }),
    },
    users: {
        getProfile: (username) => request(`/users/${username}`),
        follow: (id) =>
            request(`/users/${id}/follow`, {
                method: "POST",
            }),
        unfollow: (id) =>
            request(`/users/${id}/follow`, {
                method: "DELETE",
            }),
    },
    search: {
        query: (q) => request(`/search?q=${encodeURIComponent(q)}`),
        hashtag: (tag) => request(`/search/hashtag/${encodeURIComponent(tag)}`),
    },
    notifications: {
        get: () => request("/notifications"),
        markAsRead: (id) =>
            request(`/notifications/${id}/read`, {
                method: "PATCH",
            }),
    },
};
