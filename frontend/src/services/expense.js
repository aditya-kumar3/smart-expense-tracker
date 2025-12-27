const API_URL = "http://localhost:5000/api/expenses";

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
