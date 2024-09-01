import { axiosNoAuth } from "../config/axios";

export function loginApi(data) {
  return axiosNoAuth.post("/login", data);
}
