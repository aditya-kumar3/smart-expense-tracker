// frontend/src/services/transactions.js
const API_URL = "http://localhost:5000/api/expenses";

function getUserId() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.id || user._id || null;
  } catch {
    return null;
  }
}

export async function fetchTransactions({ month, year }) {
  const userId = getUserId();
  if (!userId) throw new Error("User not found. Please login again.");

  const params = new URLSearchParams({
    userId,
    month: String(month),
    year: String(year),
  }).toString();

  const res = await fetch(`${API_URL}/summary?${params}`);
  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error("Summary JSON parse error. Response text:", text);
    throw new Error("Failed to parse summary response");
  }

  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Failed to load transactions");
  }

  return data;
}

export async function createTransaction(payload) {
  const userId = getUserId();
  if (!userId) throw new Error("User not found. Please login again.");

  const body = { userId, ...payload };

  const res = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error("Add JSON parse error. Response text:", text);
    throw new Error("Failed to parse add transaction response");
  }

  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Failed to add transaction");
  }

  return data;
}
