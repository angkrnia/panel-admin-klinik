import { axiosAuth } from "../config/axios";

export function apiListMedicineByQueue(id) {
    return axiosAuth.get(`/queue/${id}/medicines`);
}

export function apiListTindakanByQueue(id) {
    return axiosAuth.get(`/queue/${id}/tindakan`);
}

export function apiListServiceByQueue(id) {
    return axiosAuth.get(`/queue/${id}/layanan`);
}

export function apiAcceptMedicine(queueId, medsId, data) {
    return axiosAuth.put(`/queue/${queueId}/medicines/${medsId}/accept`, data);
}

export function apiRejectMedicine(queueId, medsId, data) {
    return axiosAuth.put(`/queue/${queueId}/medicines/${medsId}/reject`, data);
}

export function apiPostTindakan(data) {
    return axiosAuth.post(`/queue/${data.queueId}/tindakan`, data);
}

export function apiDeleteTindakan(data) {
    return axiosAuth.delete(`/queue/${data.queueId}/tindakan/${data.id}`);
}

export function apiPostService(data) {
    return axiosAuth.post(`/queue/${data.queueId}/layanan`, data);
}

export function apiDeleteService(data) {
    return axiosAuth.delete(`/queue/${data.queueId}/layanan/${data.id}`);
}

export function apiMasterTindakan() {
    return axiosAuth.get(`/tindakan-list`);
}
