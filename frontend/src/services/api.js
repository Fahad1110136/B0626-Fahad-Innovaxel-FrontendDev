const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("verdant_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

// Auth
export const authApi = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  updateProfile: (body) => request("/auth/profile", { method: "PUT", body: JSON.stringify(body) }),
  changePassword: (body) => request("/auth/change-password", { method: "PUT", body: JSON.stringify(body) }),
};

// Expenses
export const expensesApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return request(`/expenses${qs ? `?${qs}` : ""}`);
  },
  create: (body) => request("/expenses", { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) => request(`/expenses/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  remove: (id) => request(`/expenses/${id}`, { method: "DELETE" }),
  stats: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return request(`/expenses/stats${qs ? `?${qs}` : ""}`);
  },
};
