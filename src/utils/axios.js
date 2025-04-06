import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);
// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  },
);
export default instance;
// Usage
// import axios from "@/utils/axios";
// axios.get("/api/user").then((response) => {
//   console.log(response);
// });
// axios.post("/api/user", { name: "John" }).then((response) => {
//   console.log(response);
// });
// axios.put("/api/user/1", { name: "John" }).then((response) => {
//   console.log(response);
// });
// axios.delete("/api/user/1").then((response) => {
//   console.log(response);
// });
// axios.get("/api/user").then((response) => {
//   console.log(response);
// });
