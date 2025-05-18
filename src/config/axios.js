import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { getRefreshToken, setAuthentication } from "../helpers/utils";

const baseUrl = "https://api-klinik-adiyasa.adiyasamedicalcenter.com/api"
// const baseUrl =
//   import.meta.env.VITE_API_ENVIRONMENT == "production"
//     ? import.meta.env.VITE_API_URL_PROD
//     : import.meta.env.VITE_API_URL_DEV;

export const axiosNoAuth = axios.create({
  baseURL: baseUrl,
  timeout: 60000,
});
axiosNoAuth.defaults.headers.common["Content-Type"] = "application/json";

export const axiosAuth = axios.create({
  baseURL: baseUrl,
  timeout: 60000,
  // withCredentials: true,
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

  if (!refreshToken) {
    window.location.href = "/login";
    return Promise.resolve();
  }

  try {
    const { data } = await axios(options);
    const token = data.data.token;

    setAuthentication(token, refreshToken);

    return await Promise.resolve();
  } catch (e) {
    console.error(e);
  }
};

export const axiosDownload = axios.create({
  baseURL: baseUrl,
  timeout: 600000,
  responseType: 'blob',
})

export default { axiosNoAuth, axiosAuth, axiosDownload, refreshAuthLogic };
