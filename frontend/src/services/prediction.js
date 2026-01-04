// frontend/src/services/prediction.js

const API_URL =
  "https://smart-expense-tracker-0fnu.onrender.com/api/prediction";


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
