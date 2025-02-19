import { axiosAuth } from "../config/axios";
import { paramPaging } from "../helpers/utils";
const pageSizeEnv = parseInt(import.meta.env.VITE_PAGE_SIZE);

// CRUD STOCK ENTRY HEADER
export function stockEntryHeaderPagination(pageIndex = 1, pageSize = pageSizeEnv, textSearch = "", newObj = {}) {
  return axiosAuth.get(paramPaging("/stock-entries", pageIndex, pageSize, textSearch, newObj));
}

export function APIstoreStockEntry(data) {
  return axiosAuth.post("/stock-entries", data);
}

export function APIupdateStockEntry(id, data) {
  return axiosAuth.put(`/stock-entries/${id}`, data);
}

export function APIdeleteStockEntry(id) {
  return axiosAuth.delete(`/stock-entries/${id}`);
}

export function APIStockEntryDetail(id) {
  return axiosAuth.get(`/stock-entries/${id}`);
}

export function APIStockEntryCommitted(id) {
  return axiosAuth.put(`/stock-entries/${id}/commit`);
}

// STOCK ENTRY LINE
export function stockEntryLinePagination(pageIndex = 1, pageSize = pageSizeEnv, textSearch = "", newObj = {}) {
  return axiosAuth.get(paramPaging(`/stock-entries/${newObj.headerId}/lines`, pageIndex, pageSize, textSearch, newObj));
}

export function APIstoreStockEntryLine(headerId, data) {
  return axiosAuth.post(`/stock-entries/${headerId}/lines`, data);
}

export function APIupdateStockEntryLine(headerId, id, data) {
  return axiosAuth.put(`/stock-entries/${headerId}/lines/${id}`, data);
}

export function APIdeleteStockEntryLine(headerId, id) {
  return axiosAuth.delete(`/stock-entries/${headerId}/lines/${id}`);
}

// STOCK OPNAME HEADER
export function stockOpnameHeaderPagination(pageIndex = 1, pageSize = pageSizeEnv, textSearch = "", newObj = {}) {
  return axiosAuth.get(paramPaging("/opname", pageIndex, pageSize, textSearch, newObj));
}

export function APIstoreStockOpname(data) {
  return axiosAuth.post("/opname", data);
}

export function APIupdateStockOpname(id, data) {
  return axiosAuth.put(`/opname/${id}`, data);
}

export function APIdeleteStockOpname(id) {
  return axiosAuth.delete(`/opname/${id}`);
}

export function APIStockOpnameDetail(id) {
  return axiosAuth.get(`/opname/${id}`);
}

export function APIStockOpnameCommitted(id) {
  return axiosAuth.put(`/opname/${id}/commit`);
}

// STOCK OPNAME DETAIL
export function stockOpnameLinePagination(pageIndex = 1, pageSize = pageSizeEnv, textSearch = "", newObj = {}) {
  return axiosAuth.get(paramPaging(`/opname/${newObj.headerId}/lines`, pageIndex, pageSize, textSearch, newObj));
}

export function APIstoreStockOpnameLine(headerId, data) {
  return axiosAuth.post(`/opname/${headerId}/lines`, data);
}

export function APIupdateStockOpnameLine(headerId, id, data) {
  return axiosAuth.put(`/opname/${headerId}/lines/${id}`, data);
}

export function APIdeleteStockOpnameLine(headerId, id) {
  return axiosAuth.delete(`/opname/${headerId}/lines/${id}`);
}