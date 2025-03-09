import { axiosAuth } from "../config/axios";

export function apiListMedicineByQueue(id) {
    return axiosAuth.get(`/queue/${id}/medicines`);
}

export function apiAcceptMedicine(queueId, medsId, data) {
    return axiosAuth.put(`/queue/${queueId}/medicines/${medsId}/accept`, data);
}

export function apiRejectMedicine(queueId, medsId, data) {
    return axiosAuth.put(`/queue/${queueId}/medicines/${medsId}/reject`, data);
}
