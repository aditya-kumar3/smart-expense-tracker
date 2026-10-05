// frontend/src/services/prediction.js

import BASE_URL from "./config";

const API_URL = `${BASE_URL}/api/prediction`;


export async function fetchPrediction(userId) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to load prediction");
  }

  return data;
}
