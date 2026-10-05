import BASE_URL from "./config";

const API_URL = `${BASE_URL}/api/expenses`;


export async function addExpense(data) {
  const res = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function getExpenses(userId) {
  const res = await fetch(`${API_URL}/list?userId=${userId}`);
  return res.json();
}
