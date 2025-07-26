import { axiosAuth } from "../config/axios";

export function APIsummaryTransaction(params = {}) {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      urlParams.append(key, value);
    }
  });

  return axiosAuth.get(`/chart/summary-transaction?${urlParams.toString()}`);
}

export function APIsummarySales(params = {}) {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      urlParams.append(key, value);
    }
  });

  return axiosAuth.get(`/chart/summary-sales?${urlParams.toString()}`);
}

export function APITransactionDateByDate() {
  return axiosAuth.get("/chart/transaction-date-by-date");
}

export function APISummaryProducts() {
  return axiosAuth.get("chart/summary-product");
}

export function APISummaryDoctor(params = {}) {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      urlParams.append(key, value);
    }
  });
  return axiosAuth.get(`/chart/summary-doctor?${urlParams.toString()}`);
}

export function APISummaryTindakan(params = {}) {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      urlParams.append(key, value);
    }
  });
  return axiosAuth.get(`/chart/summary-tindakan?${urlParams.toString()}`);
}

export function APISummaryLayanan(params = {}) {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      urlParams.append(key, value);
    }
  });
  return axiosAuth.get(`/chart/summary-layanan?${urlParams.toString()}`);
}
