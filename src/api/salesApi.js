import { axiosAuth } from "../config/axios";
import { paramPaging } from "../helpers/utils";
const pageSizeEnv = parseInt(import.meta.env.VITE_PAGE_SIZE) || 10;

// SALE HEADER
export function saleHeadePagination(pageIndex = 1, pageSize = pageSizeEnv, textSearch = "", newObj = {}) {
    return axiosAuth.get(paramPaging("/sales", pageIndex, pageSize, textSearch, newObj));
}
