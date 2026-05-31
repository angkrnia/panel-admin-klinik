import { axiosAuth } from "../config/axios";

export function summaryData(params = {}) {
  return axiosAuth.get("/chart/summary", { params });
}

export function patientByDate() {
  return axiosAuth.get("/chart/patient-by-date");
}

export function historyByDate() {
  return axiosAuth.get("/chart/history-by-date");
}



