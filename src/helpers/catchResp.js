import Cookies from "js-cookie";
import { clearLocalStorage, loading, messageInfo } from "./utils";

const getErrorMessageFromResponse = (response) => {
  const message = response?.data?.message;
  if (message) {
    return message;
  }
  return null;
};

export const errorMessage = (error) => {
  const message = getErrorMessageFromResponse(error.response);
  if (message) {
    return message;
  }
  return error.message || "Terjadi kesalahan";
};

export const catchError = (fn) => {
  const load = loading();
  fn()
    .catch((error) => {
      if (error?.status === 444) {
        Cookies.remove("ACCESS");
        clearLocalStorage();
        setTimeout(() => (window.location.href = "/login"), 1000);
      } else {
        messageInfo(errorMessage(error));
      }
    })
    .finally(() => {
      load.close();
    });
};

export const catchErrorFinally = (fn1, fnFinally) => {
  fn1()
    .catch((error) => {
      if (error?.status === 444) {
        Cookies.remove("ACCESS");
        clearLocalStorage();
        setTimeout(() => (window.location.href = "/login"), 1000);
      } else {
        messageInfo(errorMessage(error));
      }
    })
    .finally(() => {
      fnFinally();
    });
};
