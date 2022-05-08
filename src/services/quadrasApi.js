import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.43.117:5000"
});

export default api;