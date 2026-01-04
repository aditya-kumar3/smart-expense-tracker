// frontend/src/services/auth.js

const BASE_URL =
  "https://smart-expense-tracker-0fnu.onrender.com";

// LOGIN
export async function loginUser(credentials) {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const raw = await res.text();
    console.log("Login raw response:", raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      throw new Error("Server ne JSON ke bajay invalid response bheja.");
    }

    if (!res.ok) {
      throw new Error(data?.message || "Login failed");
    }

    if (data.token && data.user) {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return {
      success: true,
      ...data,
    };
  } catch (err) {
    console.error("Login error:", err);
    return {
      success: false,
      message: err.message || "Login failed",
    };
  }
}

// SIGNUP
export async function registerUser(payload) {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const raw = await res.text();
    console.log("Signup raw response:", raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      throw new Error("Server ne JSON ke bajay invalid response bheja.");
    }

    if (!res.ok) {
      throw new Error(data?.message || "Signup failed");
    }

    if (data.token && data.user) {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return {
      success: true,
      ...data,
    };
  } catch (err) {
    console.error("Signup error:", err);
    return {
      success: false,
      message: err.message || "Signup failed",
    };
  }
}
