<template>
    <div>
        <!-- Tombol Kembali -->
        <router-link :to="{ name: 'transaksi-penjualan' }" class="flex items-center gap-2 font-bold hover:text-blue-500 text-gray-600 mb-2">
            <ArrowLeft class="h-4 w-4" />
            Kembali
        </router-link>

        <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
            <div>
                <Loader2 class="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                <p class="text-gray-600 font-medium">Loading...</p>
            </div>
        </div>

        <template v-else>
            <!-- HERO -->
            <InfoPasien :data="data" />
            <!-- CONTENT -->
            <section class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <!-- Col kiri 2/3 -->
                <div class="lg:col-span-2 space-y-4">
                    <!-- Detail Pasien -->
                    <DetailPasien :data="data?.patient" :queue="data?.queue" />
                    <!-- Vital Sign -->
                    <VitalSign :data="data?.queue?.history" />
                    <!-- Dokter -->
                    <DetailDokter :data="data?.doctor" :saran="data?.queue?.history?.saran" />
                    <!-- OBAT -->
                    <DetailObat :data="data?.sale_details || []" />
                    <!-- LAYANAN -->
                    <DetailLayanan :data="data?.sale_services || []" />
                    <!-- TINDAKAN -->
                    <DetailTindakan :data="data?.sale_tindakans || []" />
                </div>
                <!-- Col kanan 1/3: Ringkasan -->
                <InfoPembayaran :data="data" @click-bayar="onClickBayar" />
            </section>
        </template>
    </div>

    <DialogBayar v-model="dialogBayar" :grandTotal="data.grand_total" @refresh="firstLoad" />
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { convertPaymentStatus, convertRp, convertStatusName, dateFormatFull, loading, messageInfo } from '../../helpers/utils';
import { backArrow } from '../../helpers/svg';
import { Printer, Wallet } from '@element-plus/icons-vue';
import useGetData from '../../composables/useGetData';
import { apiSaleDetail, saleDetailApi } from '../../api/salesApi';
import InfoItem from './partials/InfoItem.vue';
import { apiListMedicineByQueue, apiListMedicineBySales, apiListServiceByQueue, apiListServiceBySales, apiListTindakanByQueue, apiListTindakanBySales } from '../../api/apiMedicine';
import ObatList from './partials/ObatList.vue';
import TindakanList from './partials/TindakanList.vue';
import DialogBayar from './partials/DialogBayar.vue';
import LayananList from './partials/LayananList.vue';
import SaleDetailV2 from './partials/SaleDetailV2.vue';
import { Loader2 } from 'lucide-vue-next';
import InfoPasien from './partials/components/InfoPasien.vue';
import DetailPasien from './partials/components/DetailPasien.vue';
import VitalSign from './partials/components/VitalSign.vue';
import DetailDokter from './partials/components/DetailDokter.vue';
import DetailObat from './partials/components/DetailObat.vue';
import DetailLayanan from './partials/components/DetailLayanan.vue';
import DetailTindakan from './partials/components/DetailTindakan.vue';
import InfoPembayaran from './partials/components/InfoPembayaran.vue';

const route = useRoute();
const router = useRouter();
const sId = computed(() => route.query.sId);
const dialogBayar = ref(false);

const [data, getData, isLoading] = useGetData();
const [medicineList, getMedicineList, isLoadingGetMedicine] = useGetData({ defaultLoading: true });
const [tindakanList, getTindakanList, isLoadingGetTindakan] = useGetData({ defaultLoading: true });
const [layananList, getLayananList, isLoadingGetLayanan] = useGetData({ defaultLoading: true });

function firstLoad() {
    if (!sId.value) {
        messageInfo("Data tidak ditemukan", "warning");
        router.back();
        return;
    }

    getData(() => apiSaleDetail(sId.value), true, true);
    // fetchMedicine(sId.value);
    // fetchTindakan(sId.value);
    // fetchLayanan(sId.value);
}

function onBack() {
    router.back();
}

function fetchMedicine(id = sId.value) {
    getMedicineList(() => apiListMedicineBySales(id), false, true);
}

function fetchTindakan(id = sId.value) {
    getTindakanList(() => apiListTindakanBySales(id), false, true);
}

function fetchLayanan(id = sId.value) {
    getLayananList(() => apiListServiceBySales(id), false, true);
}

function onClickBayar() {
    dialogBayar.value = true;
}

function onPrint(item) {
    window.open('/sales/print?receipt_number=' + item.receipt_number, '_blank');
}

firstLoad()
</script>

<style scoped>
/* Optional tambahan kalau mau kasih efek invoice-ish */
.el-card {
    border-radius: 8px;
}
</style>