<template>
    <div class="bg-white mx-auto receipt-container max-w-[7.9cm] w-full rounded-lg overflow-hidden text-xs">
        <!-- Logo and pharmacy name -->
        <div class="pt-6 pb-4 flex flex-col items-center">
            <img src="/images/logo.png" alt="Logo" width="80" />
            <h1 class="text-sm font-bold text-gray-800 leading-4">KLINIK ADIYASA MEDIKA</h1>
            <p class="text-xs text-gray-600 mt-1 px-8 text-center leading-4">Jl. Raya Cisoka - Adiyasa, Kel. Cikuya, Kec. Solear, Kabupaten Tangerang, Banten </p>
        </div>

        <!-- Divider -->
        <div class="border-b border-dashed border-black mx-4"></div>

        <!-- Receipt details -->
        <div class="px-6 py-3 text-gray-700">
            <div>
                <p>Antrian: {{ data.queue.queue }}</p>
                <p>Kode: #{{ data.receipt_number }}</p>
                <p class="text-xs">Tanggal: {{ convertDate(data.created_at) }}</p>
            </div>
            <div>
                <p>Dokter: {{ data.created_by }}</p>
            </div>
        </div>

        <!-- Divider -->
        <div class="border-b border-dashed border-black mx-4"></div>

        <!-- Item details -->
        <div>
            <div class="px-6 py-1" v-for="(item, index) in data?.sale_tindakans" :key="index">
                <div class="flex justify-between">
                    <div class="font-semibold text-gray-800">{{ item.tindakan_name }}</div>
                </div>
                <div class="flex justify-between text-gray-700">
                    <div>{{ item.quantity }} x {{ convertRp(item.tindakan_price) }}</div>
                    <div>{{ convertRp(item.total_price) }}</div>
                </div>
            </div>
            <div class="px-6 py-1" v-for="(item, index) in data?.sale_details" :key="index">
                <div class="flex justify-between">
                    <div class="font-semibold text-gray-800">{{ item.product_name }}</div>
                </div>
                <div class="flex justify-between text-gray-700">
                    <div>{{ item.quantity }} {{ item.product_unit }} x {{ convertRp(item.unit_price) }}</div>
                    <div>{{ convertRp(item.total_price) }}</div>
                </div>
            </div>
        </div>

        <!-- Divider -->
        <div class="border-b border-dashed border-black mx-4"></div>

        <!-- Subtotal -->
        <div class="px-6 pt-3 flex justify-between text-gray-700">
            <div>Sub Total</div>
            <div>{{ convertRp(data?.grand_total) }}</div>
        </div>

        <!-- Total -->
        <div class="px-6 flex justify-between font-bold text-sm">
            <div>Total</div>
            <div>{{ convertRp(data?.grand_total) }}</div>
        </div>

        <!-- Payment details -->
        <div class="px-6 pb-3">
            <div class="flex justify-between text-gray-700">
                <div>Bayar ({{ data.payment_method }})</div>
                <div>{{ convertRp(data.paid_amount) }}</div>
            </div>
            <div class="flex justify-between text-gray-700">
                <div>Kembali</div>
                <div>{{ convertRp(data.change) }}</div>
            </div>
        </div>

        <!-- Divider -->
        <div class="border-b border-dashed border-black mx-4"></div>

        <!-- Footer -->
        <div class="p-4 text-center">
            <p class="text-emerald-600 font-semibold">Semoga Lekas Sembuh</p>
            <p class="text-gray-500 text-xs">Terima kasih atas kepercayaan Anda</p>
            <p class="text-gray-500 text-xs">Keluhan: 08221057618</p>
        </div>

        <div class="print:hidden flex items-center w-full justify-center mb-3">
            <el-button class="print:hidden" type="primary" @click="onClickPrint">Print</el-button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { apiSalePrint } from '../../api/salesApi';
import { convertDate, convertRp, messageInfo } from '../../helpers/utils';
import useGetData from '../../composables/useGetData';

const [data, getData] = useGetData();
const route = useRoute();
const trxId = computed(() => route.query.trxId)

function firstLoad() {
    if (!trxId.value) {
        messageInfo('Data tidak valid!')
    } else {
        getData(() => apiSalePrint(trxId.value))
    }
}

function onClickPrint() {
    window.print()
}

firstLoad()
</script>

<style scoped>
@media print {
    body {
        width: 7.9cm;
        padding-top: 20mm;
        page-break-before: always;
    }

    img {
        filter: grayscale(100%);
    }

    .receipt-container {
        width: 7.9cm;
        height: auto;
    }

    * {
        font-size: 12px !important;
    }
}
</style>