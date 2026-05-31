import { axiosAuth } from "../config/axios";

export function getPrescriptionPrintPatients(params) {
    return axiosAuth.get("/queue/pharmacy/prescription-print-patients", { params });
}

export function getPrescriptionPrintDetail(data) {
    return axiosAuth.post("/queue/pharmacy/prescriptions/print-detail", data);
}
