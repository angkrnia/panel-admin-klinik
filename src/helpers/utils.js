import { ElLoading, ElMessage } from "element-plus";
import { useAppStore } from "../store/appStore";
import Cookies from "js-cookie";
import { axiosAuth } from "../config/axios";
import { jwtDecode } from "jwt-decode";
import { getDokterSelect } from "../api/dokterApi";

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

export function convertDate(dateString) {
  const date = new Date(dateString);

  // Daftar bulan dalam format singkat
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Mendapatkan tanggal, bulan, tahun, dan waktu
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Mendapatkan jam, menit, dan detik
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  // Menentukan AM atau PM
  const ampm = hours >= 12 ? "PM" : "AM";

  // Konversi jam ke format 12-jam
  hours = hours % 12 || 12;

  // Menggabungkan hasil dalam format yang diinginkan
  return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
}

export function labelPosition() {
  const isMobile = window.matchMedia(
    "only screen and (max-width: 760px)"
  ).matches;
  if (isMobile) return "top";
  return "left";
}

export function dialogWidth(params) {
  const isMobile = window.matchMedia(
    "only screen and (max-width: 760px)"
  ).matches;
  const isTablet = window.matchMedia(
    "only screen and (min-width: 761px) and (max-width: 1024px)"
  ).matches;
  const isLaptop = window.matchMedia(
    "only screen and (min-width: 1025px) and (max-width: 1440px)"
  ).matches;
  const isDesktop = window.matchMedia(
    "only screen and (min-width: 1441px)"
  ).matches;

  if (isMobile) return "95%";
  if (isTablet) return "65%";
  if (isLaptop) return "50%";
  if (isDesktop) {
    if (params?.onDesktop) return params?.onDesktop;
    return "45%";
  }

  return "45%";
}

export function paramPaging(url, pageIndex, pageSize, textSearch, newObj) {
  const params = new URLSearchParams();

  if (pageIndex) params.append("page", pageIndex);
  if (pageSize) params.append("limit", pageSize);
  if (textSearch) params.append("search", textSearch);

  // Tambahkan key-value dari newObj jika ada
  if (newObj && typeof newObj === "object") {
    Object.keys(newObj).forEach((key) => {
      if (newObj[key]) params.append(key, newObj[key]);
    });
  }

  return `${url}?${params.toString()}`;
}

export function doctorListHelper() {
  return new Promise(async (resolve) => {
    let load = loading();
    try {
      const result = await getDokterSelect();
      resolve(result.data.data);
    } catch (error) {
      console.error(error);
      resolve([]);
    } finally {
      load.close();
    }
  });
}

export function convertStatusName(status) {
  switch (status) {
    case "on waiting":
      return "Pemeriksaan Perawat";
    case "waiting":
      return "Menunggu Panggilan Dokter";
    case "on process":
      return "Diperiksa Dokter";
    case "done":
      return "Pengambilan Obat";
    case "canceled":
      return "Dibatalkan";
    case "completed":
      return "Selesai";
    default:
      return status;
  }
}
