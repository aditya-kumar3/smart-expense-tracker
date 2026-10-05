// frontend/src/services/config.js
const DEFAULT_API_BASE_URL = "https://smart-expense-tracker-0fnu.onrender.com";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, "");

export default BASE_URL;