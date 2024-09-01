import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { getRefreshToken, setAuthentication } from "../helpers/utils";

const baseUrl =
  import.meta.env.VITE_API_ENVIRONMENT == "production"
    ? import.meta.env.VITE_API_URL_PROD
    : import.meta.env.VITE_API_URL_DEV;

export const axiosNoAuth = axios.create({
  baseURL: baseUrl,
  timeout: 30000,
});
axiosNoAuth.defaults.headers.common["Content-Type"] = "application/json";

export const axiosAuth = axios.create({
  baseURL: baseUrl,
  timeout: 30000,
  withCredentials: true,
});
axiosAuth.defaults.headers.common["Content-Type"] = "application/json";

export const refreshAuthLogic = async () => {
  const refreshToken = getRefreshToken();
  const data = {
    refresh_token: refreshToken,
  };

  const options = {
    method: "PUT",
    data,
    url: baseUrl + "/refresh-token",
  };

  try {
    const { data } = await axios(options);
    const token = data.data.token;

    setAuthentication(token, refreshToken);

    return await Promise.resolve();
  } catch (e) {
    console.error(e);
  }
};

export default { axiosNoAuth, axiosAuth, refreshAuthLogic };
