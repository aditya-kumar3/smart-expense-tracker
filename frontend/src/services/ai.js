// frontend/src/services/ai.js
import BASE_URL from "./config";

export async function fetchAiInsights(userId) {
  const res = await fetch(`${BASE_URL}/api/ai/insights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to load AI insight");
  }

  return data.text || "";
}

export async function chatWithAi(userId, question) {
  const res = await fetch(`${BASE_URL}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, question }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.answer || data.message || "AI chat error");
  }

  return data;
}