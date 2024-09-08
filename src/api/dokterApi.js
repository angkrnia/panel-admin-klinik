import { axiosAuth } from "../config/axios";
import { paramPaging } from "../helpers/utils";
const pageSizeEnv = parseInt(import.meta.env.VITE_PAGE_SIZE);

export function listDokterPagination(
  pageIndex = 1,
  pageSize = pageSizeEnv,
  textSearch = "",
  newObj = {}
) {
  return axiosAuth.get(
    paramPaging("/doctors", pageIndex, pageSize, textSearch, newObj)
  );
}

export function tambahDokter(data) {
  axiosAuth.defaults.headers.common["Content-Type"] = "multipart/form-data";
  return axiosAuth.post("/doctors", data);
}

export function updateDokter(id, data) {
  return axiosAuth.put(`/doctors/${id}`, data);
}

export function deleteDokter(id) {
  return axiosAuth.delete(`/doctors/${id}`);
}
