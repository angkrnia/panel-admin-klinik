import Cookies from "js-cookie";
import { clearLocalStorage, loading, loadingScreen, messageInfo } from "./utils";

const getErrorMessageFromResponse = (response) => {
  const message = response?.data?.message;
  if (message) return message;
  return null;
};

const extractValidationErrors = (response) => {
  const errors = response?.data?.errors;
  if (!errors || typeof errors !== "object") return null;

  const lines = [];
  for (const [field, msgs] of Object.entries(errors)) {
    if (Array.isArray(msgs)) {
      msgs.forEach((m) => lines.push(`• ${m}`));
    } else if (msgs) {
      lines.push(`• ${String(msgs)}`);
    }
  }
  return lines.length ? lines.join("\n") : null;
};

export const errorMessage = (error) => {
  const status = error?.response?.status ?? error?.status;

  // TANGANI VALIDASI 422
  if (status === 422) {
    const base =
      getErrorMessageFromResponse(error.response) || "Validasi gagal";
    const detail = extractValidationErrors(error.response);
    return detail ? `${base}\n${detail}` : base;
  }

  const message = getErrorMessageFromResponse(error.response);
  if (message) return message;
  return error?.message || "Terjadi kesalahan";
};

export const catchError = (fn, cb) => {
  const load = loadingScreen();
  fn()
    .catch((error) => {
      const status = error?.response?.status ?? error?.status;
      if (status === 444) {
        clearLocalStorage();
        Cookies.remove("ACCESS");
        messageInfo("Sesi telah habis, silakan login kembali.", "warning");
      } else {
        messageInfo(errorMessage(error), "error");
      }
    })
    .finally(() => {
      load.close();
      if (cb) cb();
    });
};

export const catchErrorFinally = (fn1, fnFinally) => {
  fn1()
    .catch((error) => {
      const status = error?.response?.status ?? error?.status;
      if (status === 444) {
        clearLocalStorage();
        Cookies.remove("ACCESS");
        messageInfo("Sesi telah habis, silakan login kembali.", "warning");
      } else {
        messageInfo(errorMessage(error), "error");
      }
    })
    .finally(() => {
      fnFinally();
    });
};
