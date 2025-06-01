<template>
    <template v-if="isLoading">
        <div class="bg-white mx-auto receipt-container max-w-[7.9cm] w-full rounded-lg shadow-sm">
            <!-- Header with Logo -->
            <div class="text-center mb-6">
                <div class="skeleton w-12 h-12 rounded-full mx-auto mb-3"></div>
                <div class="skeleton h-5 w-48 mx-auto mb-2 rounded"></div>
                <div class="skeleton h-4 w-56 mx-auto mb-1 rounded"></div>
                <div class="skeleton h-4 w-32 mx-auto rounded"></div>
            </div>

            <!-- Dotted Separator -->
            <div class="border-t-2 border-dotted border-gray-300 my-4"></div>

            <!-- Transaction Details -->
            <div class="space-y-2 mb-4">
                <div class="flex justify-between">
                    <div class="skeleton h-4 w-16 rounded"></div>
                    <div class="skeleton h-4 w-8 rounded"></div>
                </div>
                <div class="flex justify-between">
                    <div class="skeleton h-4 w-20 rounded"></div>
                    <div class="skeleton h-4 w-32 rounded"></div>
                </div>
                <div class="flex justify-between">
                    <div class="skeleton h-4 w-16 rounded"></div>
                    <div class="skeleton h-4 w-40 rounded"></div>
                </div>
                <div class="flex justify-between">
                    <div class="skeleton h-4 w-20 rounded"></div>
                    <div class="skeleton h-4 w-28 rounded"></div>
                </div>
            </div>

            <!-- Dotted Separator -->
            <div class="border-t-2 border-dotted border-gray-300 my-4"></div>

            <!-- Items List -->
            <div class="space-y-3 mb-4">
                <!-- Item 1 -->
                <div>
                    <div class="flex justify-between items-start mb-1">
                        <div class="skeleton h-4 w-32 rounded"></div>
                        <div class="skeleton h-4 w-20 rounded"></div>
                    </div>
                    <div class="flex justify-between text-sm">
                        <div class="skeleton h-3 w-24 rounded"></div>
                        <div class="skeleton h-3 w-20 rounded"></div>
                    </div>
                </div>

                <!-- Item 2 -->
                <div>
                    <div class="flex justify-between items-start mb-1">
                        <div class="skeleton h-4 w-28 rounded"></div>
                        <div class="skeleton h-4 w-20 rounded"></div>
                    </div>
                    <div class="flex justify-between text-sm">
                        <div class="skeleton h-3 w-24 rounded"></div>
                        <div class="skeleton h-3 w-20 rounded"></div>
                    </div>
                </div>
            </div>

            <!-- Dotted Separator -->
            <div class="border-t-2 border-dotted border-gray-300 my-4"></div>

            <!-- Totals -->
            <div class="space-y-2 mb-4">
                <div class="flex justify-between">
                    <div class="skeleton h-4 w-20 rounded"></div>
                    <div class="skeleton h-4 w-20 rounded"></div>
                </div>
                <div class="flex justify-between font-semibold">
                    <div class="skeleton h-5 w-12 rounded"></div>
                    <div class="skeleton h-5 w-24 rounded"></div>
                </div>
                <div class="flex justify-between text-sm">
                    <div class="skeleton h-3 w-24 rounded"></div>
                    <div class="skeleton h-3 w-24 rounded"></div>
                </div>
                <div class="flex justify-between text-sm">
                    <div class="skeleton h-3 w-16 rounded"></div>
                    <div class="skeleton h-3 w-16 rounded"></div>
                </div>
            </div>

            <!-- Dotted Separator -->
            <div class="border-t-2 border-dotted border-gray-300 my-4"></div>

            <!-- Footer Message -->
            <div class="text-center space-y-2">
                <div class="skeleton h-4 w-40 mx-auto rounded"></div>
                <div class="skeleton h-3 w-48 mx-auto rounded"></div>
                <div class="skeleton h-3 w-32 mx-auto rounded"></div>
            </div>
        </div>
    </template>

    <div v-else v-loading="isLoading" class="bg-white mx-auto receipt-container max-w-[7.9cm] w-full rounded-lg overflow-hidden text-xs">
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
            <div class="px-6 py-1" v-for="(item, index) in data?.sale_services" :key="index">
                <div class="flex justify-between">
                    <div class="font-semibold text-gray-800">{{ item.service_type_name }}</div>
                </div>
                <div class="flex justify-between text-gray-700">
                    <div>{{ item.quantity }} x {{ convertRp(item.service_type_price) }}</div>
                    <div>{{ convertRp(item.total_price) }}</div>
                </div>
            </div>
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

const [data, getData, isLoading] = useGetData({ defaultLoading: true });
const route = useRoute();
const trxId = computed(() => route.query.receipt_number || route.query.trxId)

function firstLoad() {
    if (!trxId.value) {
        messageInfo('Data tidak valid!')
    } else {
        getData(() => apiSalePrint(trxId.value), true, true);
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

@keyframes shimmer {
    0% {
        background-position: -200px 0;
    }

    100% {
        background-position: calc(200px + 100%) 0;
    }
}

.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200px 100%;
    animation: shimmer 1.5s infinite;
}
</style>