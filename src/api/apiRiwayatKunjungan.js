import { axiosAuth } from "../config/axios";
import { paramPaging } from "../helpers/utils";
const pageSizeEnv = parseInt(import.meta.env.VITE_PAGE_SIZE);

export function riwayatKunjunganPagination(
  pageIndex = 1,
  pageSize = pageSizeEnv,
  textSearch = "",
  newObj = {}
) {
  return axiosAuth.get(
    paramPaging("/histories", pageIndex, pageSize, textSearch, newObj)
  );
}
