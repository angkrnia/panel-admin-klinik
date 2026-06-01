import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { getRefreshToken, setAuthentication } from "../helpers/utils";
import Cookies from "js-cookie";

export const baseUrl =
  import.meta.env.VITE_API_ENVIRONMENT == "production"
    ? import.meta.env.VITE_API_URL_PROD
    : import.meta.env.VITE_API_URL_DEV;

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

function isLoginRequiredResponse(response) {
  const data = response?.data;
  return (
    data?.code === 401 &&
    data?.status === false &&
    data?.message === "Anda harus login terlebih dahulu"
  );
}

function redirectToLogin() {
  Cookies.remove("TOKEN");
  Cookies.remove("ACCESS");
  localStorage.clear();

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

function handleLoginRequired(response) {
  if (isLoginRequiredResponse(response)) {
    redirectToLogin();
    return true;
  }

  return false;
}

axiosAuth.interceptors.response.use(
  (response) => {
    if (handleLoginRequired(response)) return Promise.reject(response);
    return response;
  },
  (error) => {
    handleLoginRequired(error?.response);
    return Promise.reject(error);
  }
);

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

axiosDownload.interceptors.response.use(
  (response) => {
    if (handleLoginRequired(response)) return Promise.reject(response);
    return response;
  },
  (error) => {
    handleLoginRequired(error?.response);
    return Promise.reject(error);
  }
);

export default { axiosNoAuth, axiosAuth, axiosDownload, refreshAuthLogic };
