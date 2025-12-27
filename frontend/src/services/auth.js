// frontend/src/services/auth.js

import { API_BASE_URL } from "./api";

// LOGIN
export async function loginUser(credentials) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
      throw new Error("Server ne JSON ke bajay HTML / invalid data bheja.");
    }

    if (!res.ok) {
      throw new Error(data?.message || "Login failed");
    }

    // Expecting: { token, user: { id, name, email } }
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

// SIGNUP / REGISTER
export async function registerUser(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
      throw new Error("Server ne JSON ke bajay HTML / invalid data bheja.");
    }

    if (!res.ok) {
      throw new Error(data?.message || "Signup failed");
    }

    // Optionally yahan bhi token/user mil sakta hai
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
