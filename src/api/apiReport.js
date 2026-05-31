import { axiosAuth, axiosDownload } from '@/config/axios'

export function APIGetDoctorFeeDetail(params = {}) {
  return axiosAuth.get('/reports/doctor-fees/detail', { params })
}

export function APIExportDoctorFeeDetail(params = {}) {
  return axiosDownload.get('/reports/doctor-fees/detail/export', { params })
}

export function APIGetAllProducts(params = {}) {
  return axiosDownload.get('/report/download/products', { params })
}

export function APIGetStockInDetail(headerId) {
  return axiosDownload.get('/report/download/stock-in/' + headerId)
}

export function APIGetStockOpnameDetail(headerId) {
  return axiosDownload.get('/report/download/stock-opname/' + headerId)
}

