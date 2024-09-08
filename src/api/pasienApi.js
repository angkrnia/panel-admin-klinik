import { axiosAuth } from "../config/axios";
import { paramPaging } from "../helpers/utils";
const pageSizeEnv = parseInt(import.meta.env.VITE_PAGE_SIZE);

export function listPasienPagination(
  pageIndex = 1,
  pageSize = pageSizeEnv,
  textSearch = "",
  newObj = {}
) {
  return axiosAuth.get(
    paramPaging("/patients", pageIndex, pageSize, textSearch, newObj)
  );
}

export function tambahPasien(data) {
  return axiosAuth.post("/patients", data);
}

export function updatePasien(id, data) {
  return axiosAuth.put(`/patients/${id}`, data);
}

export function deletePasien(id) {
  return axiosAuth.delete(`/patients/${id}`);
}

export function listPasienSelect(search = "") {
  return axiosAuth.get("/patients?limit=10&search=" + search);
}
