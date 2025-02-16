import { axiosAuth } from "../config/axios";
import { paramPaging } from "../helpers/utils";
const pageSizeEnv = parseInt(import.meta.env.VITE_PAGE_SIZE);

// CRUD UNITS
export function listUnitsPagination(pageIndex = 1, pageSize = pageSizeEnv, textSearch = "", newObj = {}) {
  return axiosAuth.get(paramPaging("/units", pageIndex, pageSize, textSearch, newObj));
}

export function APIstoreUnit(data) {
  return axiosAuth.post("/units", data);
}

export function APIupdateUnit(id, data) {
  return axiosAuth.put(`/units/${id}`, data);
}

export function APIdeleteUnit(id) {
  return axiosAuth.delete(`/units/${id}`);
}

// CRUD GROUPS
export function listGroupsPagination(pageIndex = 1, pageSize = pageSizeEnv, textSearch = "", newObj = {}) {
  return axiosAuth.get(paramPaging("/groups", pageIndex, pageSize, textSearch, newObj));
}

export function APIstoreGroup(data) {
  return axiosAuth.post("/groups", data);
}

export function APIupdateGroup(id, data) {
  return axiosAuth.put(`/groups/${id}`, data);
}

export function APIdeleteGroup(id) {
  return axiosAuth.delete(`/groups/${id}`);
}

// CRUD CATEGORIES
export function listCategoriesPagination(pageIndex = 1, pageSize = pageSizeEnv, textSearch = "", newObj = {}) {
  return axiosAuth.get(paramPaging("/categories", pageIndex, pageSize, textSearch, newObj));
}

export function APIstoreCategory(data) {
  return axiosAuth.post("/categories", data);
}

export function APIupdateCategory(id, data) {
  return axiosAuth.put(`/categories/${id}`, data);
}

export function APIdeleteCategory(id) {
  return axiosAuth.delete(`/categories/${id}`);
}

// CRUD MASTER OBAT
export function listMedicinesPagination(pageIndex = 1, pageSize = pageSizeEnv, textSearch = "", newObj = {}) {
  return axiosAuth.get(paramPaging("/products", pageIndex, pageSize, textSearch, newObj));
}

export function APIstoreMedicine(data) {
  return axiosAuth.post("/products", data);
}

export function APIupdateMedicine(id, data) {
  return axiosAuth.put(`/products/${id}`, data);
}

export function APIdeleteMedicine(id) {
  return axiosAuth.delete(`/products/${id}`);
}

// LIST SELECT
export function APIGetUnitsSelect() {
  return axiosAuth.get("/units-list");
}

export function APIGetGroupsSelect() {
  return axiosAuth.get("/groups-list");
}

export function APIGetCategoriesSelect() {
  return axiosAuth.get("/categories-list");
}
