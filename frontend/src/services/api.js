
import axios from "axios";

// Reusable Axios instance for backend requests
const api = axios.create({
    baseURL: "https://url-shortener-backend-tdc9.onrender.com",
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;
