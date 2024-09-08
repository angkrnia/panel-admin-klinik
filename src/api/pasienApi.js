import { axiosAuth } from "../config/axios";
const pageSizeEnv = parseInt(import.meta.env.VITE_PAGE_SIZE);

function paramPaging(url, pageIndex, pageSize, textSearch, newObj) {
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
