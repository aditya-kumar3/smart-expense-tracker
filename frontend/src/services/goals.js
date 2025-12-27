// frontend/src/services/goals.js

const API_URL = "http://localhost:5000/api/goals";

export async function saveGoal(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to save goal");
  }
  return data;
}

export async function fetchGoalStatus(userId) {
  const params = new URLSearchParams({ userId });
  const res = await fetch(`${API_URL}?${params.toString()}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to load goal");
  }
  return data;
}
