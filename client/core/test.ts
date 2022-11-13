import axios from "axios"

const axiosConfig = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/test`,
  headers: {
    "Access-Control-Allow-Origin": `*`,
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Content-Type": "application/json"
  }
})

export default axiosConfig
