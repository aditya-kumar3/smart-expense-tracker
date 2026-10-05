import BASE_URL from "./config";

export async function fetchAlerts(userId) {
  const params = new URLSearchParams({ userId });

  const res = await fetch(`${BASE_URL}/api/alerts?${params}`);
  const data = await res.json();

  if (!data.success) throw new Error(data.message);

  return data.alerts;
}
