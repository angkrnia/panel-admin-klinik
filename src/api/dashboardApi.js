import { axiosAuth } from "../config/axios";

export function summaryData(data) {
  return axiosAuth.get("/chart/summary", data);
}

export function patientByDate() {
  return axiosAuth.get("/chart/patient-by-date");
}

export function historyByDate() {
  return axiosAuth.get("/chart/history-by-date");
}
