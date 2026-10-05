import BASE_URL from "./config";

export async function fetchInsights(userId) {
  try {
    const res = await fetch(`${BASE_URL}/api/insights/summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch insights");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("fetchInsights error:", err);
    throw err;
  }
}
