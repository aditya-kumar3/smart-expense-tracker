const API_URL =
  "https://smart-expense-tracker-0fnu.onrender.com/api/expenses";


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
