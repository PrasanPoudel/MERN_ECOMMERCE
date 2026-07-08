import axios from "axios";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthRequest =
      err.config?.url?.includes("/auth/login") ||
      err.config?.url?.includes("/auth/signup");

    if (err.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem("token");

      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  },
);

export default api;
