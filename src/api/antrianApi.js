import { axiosAuth } from "../config/axios";
import { paramPaging } from "../helpers/utils";
const pageSizeEnv = parseInt(import.meta.env.VITE_PAGE_SIZE);

export function listAntrianPagination(
  pageIndex = 1,
  pageSize = pageSizeEnv,
  textSearch = "",
  newObj = {}
) {
  return axiosAuth.get(
    paramPaging("/queue", pageIndex, pageSize, textSearch, newObj)
  );
}

export function pharmacyPagination(
  pageIndex = 1,
  pageSize = pageSizeEnv,
  textSearch = "",
  newObj = {}
) {
  return axiosAuth.get(
    paramPaging("/queue/pharmacy", pageIndex, pageSize, textSearch, newObj)
  );
}

export function detailKunjungan(id) {
  return axiosAuth.get("/queue/pharmacy/" + id);
}

export function tambahAntrian(data) {
  return axiosAuth.post("/queue", data);
}

export function updateAntrian(id, data) {
  return axiosAuth.put(`/queue/${id}`, data);
}

export function deleteAntrian(id) {
  return axiosAuth.delete(`/queue/${id}`);
}

export function insertVitalSign(id, data) {
  return axiosAuth.put("/queue/" + id + "/vital-sign", data);
}

export function updateVitalSign(id, data) {
  return axiosAuth.put("/queue/" + id + "/update-vital-sign", data);
}

export function completedQueue(id, data) {
  return axiosAuth.put("/queue/" + id + "/completed", data);
}
