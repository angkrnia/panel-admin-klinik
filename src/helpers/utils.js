import { ElLoading, ElMessage } from "element-plus";
import { useAppStore } from "../store/appStore";
import Cookies from "js-cookie";
import { axiosAuth } from "../config/axios";
import { jwtDecode } from "jwt-decode";

export const isObjectEmpty = (object) => {
  if (!object) return true;
  return Object.keys(object).length === 0;
};

export const messageInfo = (message, type) => {
  return ElMessage({
    message: message,
    type: type || "error",
    grouping: true,
  });
};

export const loading = () => {
  const load = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  return load;
};

export function clearLocalStorage() {
  localStorage.clear();
}

export const isValElForm = (elForm) => {
  return new Promise((resolve) => {
    elForm.validate((isValid) => resolve(isValid));
  });
};

let timeout = null;
export const createDebounce = (fn = () => {}, time = 500) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    fn();
  }, time);
};

export const getDifferentObject = (object1, object2) => {
  let returnObj = {};
  Object.entries(object1).forEach((element) => {
    let arrayStr1;
    let arrayStr2;
    const [key, value] = element;
    if (Array.isArray(object1[key])) {
      arrayStr1 = JSON.stringify(object1[key]);
      arrayStr2 = JSON.stringify(object2[key]);
      if (arrayStr1 != arrayStr2) {
        returnObj[key] = value;
      }
    } else if (object1[key] != object2[key]) {
      returnObj[key] = value;
    }
  });
  return returnObj;
};

export function replaceNullWithEmptyString(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value === null ? "" : value,
    ])
  );
}

export function setAuthentication(token, refreshToken) {
  Cookies.set("TOKEN", token, { expires: 1 });
  axiosAuth.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  if (refreshToken) {
    localStorage.setItem("TOKEN", refreshToken);
  }

  const appStore = useAppStore();

  try {
    const decoded = jwtDecode(token);
    appStore.setProfileInfo(decoded);
    appStore.setAuthentication(true);
    appStore.setToken(token);
  } catch (error) {
    appStore.setAuthentication(false);
    appStore.setToken(null);
    Cookies.remove("TOKEN");
    localStorage.clear();
  }
}

export const getFromLocalStorage = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value !== null && value !== undefined ? value : null;
  } catch (error) {
    console.error(`Error retrieving key "${key}" from localStorage:`, error);
    return null;
  }
};

export function getRefreshToken() {
  return getFromLocalStorage("TOKEN");
}

export function onLogoutHandler() {
  const appStore = useAppStore();
  Cookies.remove("TOKEN");
  localStorage.clear();
  appStore.setToken(null);
  appStore.setAuthentication(false);
  window.location.href = "/login";
}
