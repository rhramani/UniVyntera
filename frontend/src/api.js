// import axios from "axios";


// const Axios = axios.create({
//     headers: {
//         "Content-Type": "application/json",
//       },
// });

// axios.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`
//     }
//     return config;
// });

// export default Axios;


import axios from "axios";

const Axios = axios.create();

Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const isFormData = config.data instanceof FormData;

  config.headers["Content-Type"] = isFormData
    ? "multipart/form-data"
    : "application/json";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default Axios;
