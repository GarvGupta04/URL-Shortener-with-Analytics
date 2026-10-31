
import axios from "axios";

// Reusable Axios instance for backend requests
const api = axios.create({
    baseURL: "http://localhost:5001",
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;
