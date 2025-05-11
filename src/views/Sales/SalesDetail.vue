<template>
    <section>
        <div class="block border-b md:flex justify-between my-2 pb-2.5 text-center space-y-2">
            <div class="flex items-center">
                <button class="mr-2" @click="onBack">
                    <div v-html="backArrow" class="size-7"></div>
                </button>
                <h1 class="capitalize">Detail Transaksi</h1>
            </div>
            <!-- Button save -->
            <div class="flex items-center justify-end">
                <el-button type="warning" :icon="Printer" @click="onPrint(data)">Print</el-button>
                <el-button type="primary" :icon="Wallet" @click="onClickBayar" v-if="data.status != 'done'">Bayar</el-button>
            </div>
        </div>

        <div v-if="isLoading" class="flex items-center justify-center flex-1">
            <h1 class="font-semibold text-sm">Loading...</h1>
        </div>

        <div class="space-y-3" v-if="data && !isLoading">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <!-- Informasi Transaksi -->
                <el-card shadow="never">
                    <template #header>
                        <div class="font-semibold text-lg text-gray-700">Informasi Transaksi</div>
                    </template>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InfoItem label="No. Transaksi" :value="data.receipt_number" />
                        <InfoItem label="Status Pembayaran" :value="convertPaymentStatus(data.status)" />
                        <InfoItem label="Metode Pembayaran" :value="data.payment_method || '-'" />
                        <InfoItem label="Dibuat Oleh" :value="data.created_by" />
                        <InfoItem label="Tanggal" :value="dateFormatFull(data.created_at)" />
                    </div>
                </el-card>

                <!-- Informasi Pasien -->
                <el-card shadow="never">
                    <template #header>
                        <div class="font-semibold text-lg text-gray-700">Informasi Pasien</div>
                    </template>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InfoItem label="Nama Pasien" :value="data.patient_name" />
                        <InfoItem label="Status Antrian" :value="convertStatusName(data.queue.status)" />
                        <InfoItem label="Nomor Antrian" :value="`#${data.queue.queue}`" />
                    </div>
                </el-card>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <!-- Pemeriksaan -->
                <el-card shadow="never">
                    <template #header>
                        <div class="font-semibold text-lg text-gray-700">Pemeriksaan & Diagnosa</div>
                    </template>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InfoItem label="Tekanan Darah" :value="data.queue.history.blood_pressure" />
                        <InfoItem label="Tinggi Badan (cm)" :value="data.queue.history.height" />
                        <InfoItem label="Berat Badan (kg)" :value="data.queue.history.weight" />
                        <InfoItem label="Suhu Tubuh (°C)" :value="data.queue.history.temperature" />
                        <InfoItem label="Keluhan" :value="data.queue.history.complaint" />
                        <InfoItem label="Catatan" :value="data.queue.history.note || '-'" />
                        <InfoItem label="Diagnosa" :value="data.queue.history.diagnosa" />
                        <InfoItem label="Pemeriksaan" :value="data.queue.history.pemeriksaan || '-'" />
                        <InfoItem label="Saran" :value="data.queue.history.saran || '-'" />
                    </div>
                </el-card>

                <!-- Informasi Dokter -->
                <el-card shadow="never">
                    <template #header>
                        <div class="font-semibold text-lg text-gray-700">Informasi Dokter</div>
                    </template>
                    <div class="flex gap-5 items-center">
                        <div class="md:col-span-1 flex justify-center">
                            <img :src="data.doctor.avatar" class="w-24 h-24 rounded-full object-cover" alt="Foto Dokter" />
                        </div>
                        <div class="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoItem label="Nama Dokter" :value="data.doctor_name" />
                            <InfoItem label="No. HP" :value="data.doctor.phone" />
                            <InfoItem label="Deskripsi" :value="data.doctor.description" />
                        </div>
                    </div>
                </el-card>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <!-- Daftar Obat -->
                <el-card shadow="never">
                    <template #header>
                        <div class="font-semibold text-lg text-gray-700">Daftar Obat</div>
                    </template>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ObatList :medicineList="medicineList" />
                    </div>
                </el-card>

                <!-- Daftar Tindakan -->
                <el-card shadow="never">
                    <template #header>
                        <div class="font-semibold text-lg text-gray-700">Daftar Tindakan</div>
                    </template>
                    <TindakanList :procedureList="tindakanList" />
                </el-card>
            </div>

            <!-- Ringkasan Pembayaran -->
            <div class="flex justify-end py-5">
                <div class="w-full md:w-1/2 lg:w-1/3 space-y-2">
                    <div class="flex justify-between">
                        <span class="text-gray-500">Grand Total</span>
                        <span class="font-semibold">{{ convertRp(data.grand_total) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Bayar <span class="capitalize">({{ data.payment_method }})</span></span>
                        <span class="font-semibold">{{ convertRp(data.paid_amount) }}</span>
                    </div>
                    <div class="flex justify-between border-t pt-2">
                        <span class="text-gray-500">Kembalian</span>
                        <span class="font-semibold text-green-600">{{ convertRp(data.change) }}</span>
                    </div>
                    <div class="flex items-center justify-end">
                        <el-button @click="onClickBayar" type="primary" :icon="Wallet" v-if="data.status != 'done'">Bayar</el-button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <DialogBayar v-model="dialogBayar" :grandTotal="data.grand_total" @refresh="firstLoad" />
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { convertPaymentStatus, convertRp, convertStatusName, dateFormatFull, messageInfo } from '../../helpers/utils';
import { backArrow } from '../../helpers/svg';
import { Printer, Wallet } from '@element-plus/icons-vue';
import useGetData from '../../composables/useGetData';
import { saleDetailApi } from '../../api/salesApi';
import InfoItem from './partials/InfoItem.vue';
import { apiListMedicineByQueue, apiListTindakanByQueue } from '../../api/apiMedicine';
import ObatList from './partials/ObatList.vue';
import TindakanList from './partials/TindakanList.vue';
import DialogBayar from './partials/DialogBayar.vue';

const route = useRoute();
const router = useRouter();
const qId = computed(() => route.query.qId);
const dialogBayar = ref(false);

const [data, getData, isLoading] = useGetData();
const [medicineList, getMedicineList, isLoadingGetMedicine] = useGetData();
const [tindakanList, getTindakanList, isLoadingGetTindakan] = useGetData();

function firstLoad() {
    if (!qId.value) {
        messageInfo("Data tidak ditemukan", "warning");
        router.back();
        return;
    }

    getData(() => saleDetailApi(qId.value), true, true);
    fetchMedicine(qId.value);
    fetchTindakan(qId.value);
}

function onBack() {
    router.back();
}

function fetchMedicine(id = qId.value) {
    getMedicineList(() => apiListMedicineByQueue(id), false, true);
}

function fetchTindakan(id = qId.value) {
    getTindakanList(() => apiListTindakanByQueue(id), false, true);
}

function onClickBayar() {
    dialogBayar.value = true;
}

function onPrint(item) {
    window.open('/sales/print?trxId=' + item.receipt_number, '_blank');
}

firstLoad()
</script>

<style scoped>
/* Optional tambahan kalau mau kasih efek invoice-ish */
.el-card {
    border-radius: 8px;
}
</style>