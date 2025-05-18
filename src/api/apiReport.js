import { axiosDownload } from '@/config/axios'

export function APIGetAllProducts() {
  return axiosDownload.get('/report/download/products')
}

export function APIGetStockInDetail(headerId) {
  return axiosDownload.get('/report/download/stock-in/' + headerId)
}

export function APIGetStockOpnameDetail(headerId) {
  return axiosDownload.get('/report/download/stock-opname/' + headerId)
}
