import { axiosAuth } from "../config/axios";
import { paramPaging } from "../helpers/utils";
const pageSizeEnv = parseInt(import.meta.env.VITE_PAGE_SIZE) || 10;

// SALE HEADER
export function saleHeaderPagination(pageIndex = 1, pageSize = pageSizeEnv, textSearch = "", newObj = {}) {
    return axiosAuth.get(paramPaging("/sales", pageIndex, pageSize, textSearch, newObj));
}

export function saleDetailApi(queueId) {
    return axiosAuth.get(`/queue/${queueId}/sales`);
}

export function salePaidApi(data) {
    return axiosAuth.post(`/queue/${data.queueId}/paid`, data);
}

export function apiSalePrint(trxId) {
    return axiosAuth.get(`/sales/print/${trxId}`);
}
