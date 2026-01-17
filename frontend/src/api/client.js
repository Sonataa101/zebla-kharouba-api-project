const API_BASE = "http://localhost:5000";

export function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("access_token");

  return fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  }).then(res => {
    if (!res.ok) throw new Error("API error");
    return res.json();
  });
}
