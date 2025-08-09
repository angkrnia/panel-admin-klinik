<template>
    <div>
        <div class="mb-5 2xl:mb-10">
            <p class="text-gray-600 mb-1">Filter data berdasarkan tanggal:</p>
            <div class="flex items-center gap-x-2">
                <ElDateRangeInput v-model:startDate="startDate" v-model:endDate="endDate" />
                <el-button type="primary">Filter</el-button>
            </div>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3" v-role="['admin']">
            <div class="flex-1 border rounded-md overflow-hidden">
                <div class="px-2 py-1 bg-orange-400 border-b">
                    <h1 class="font-semibold text-sm text-white">JUMLAH TRANSAKSI</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div v-html="SVG.graphUpArrow" class="size-5 text-slate-600"></div>
                    <h1 class="font-bold text-gray-700">{{ formatRibuan(summaryCount.total_transaction) }}</h1>
                </div>
            </div>
            <div class="flex-1 border rounded-md overflow-hidden">
                <div class="px-2 py-1 bg-orange-400 border-b">
                    <h1 class="font-semibold text-sm text-white">TOTAL TRANSAKSI</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div v-html="SVG.graphUpArrow" class="size-5 text-slate-600"></div>
                    <h1 class="font-bold text-gray-700">{{ convertRp(summaryCount.total_sales) }}</h1>
                </div>
            </div>
            <div class="flex-1 border rounded-md overflow-hidden">
                <div class="px-2 py-1 bg-orange-400 border-b">
                    <h1 class="font-semibold text-sm text-white">QTY OBAT TERJUAL</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div v-html="SVG.graphUpArrow" class="size-5 text-slate-600"></div>
                    <h1 class="font-bold text-gray-700">{{ formatRibuan(summaryCount.total_quantity) }}</h1>
                </div>
            </div>
            <div class="flex-1 border rounded-md overflow-hidden">
                <div class="px-2 py-1 bg-orange-400 border-b">
                    <h1 class="font-semibold text-sm text-white">OBAT TERJUAL</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div v-html="SVG.graphUpArrow" class="size-5 text-slate-600"></div>
                    <h1 class="font-bold text-gray-700">{{ formatRibuan(summaryCount.total_product) }}</h1>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 my-3" v-role="['admin']">
            <div class="flex-1 border rounded-md overflow-hidden">
                <div class="px-2 py-1 bg-purple-400 border-b">
                    <h1 class="font-semibold text-sm text-white uppercase">Total Keuntungan Obat</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div v-html="SVG.graphUpArrow" class="size-5 text-slate-600"></div>
                    <h1 class="font-bold text-gray-700">{{ convertRp(summarySales.total_profit) }}</h1>
                </div>
            </div>
            <div class="flex-1 border rounded-md overflow-hidden">
                <div class="px-2 py-1 bg-purple-400 border-b">
                    <h1 class="font-semibold text-sm text-white uppercase">Total Pembelian Obat</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div v-html="SVG.graphUpArrow" class="size-5 text-slate-600"></div>
                    <h1 class="font-bold text-gray-700">{{ convertRp(summarySales.total_buy_price) }}</h1>
                </div>
            </div>
            <div class="flex-1 border rounded-md overflow-hidden">
                <div class="px-2 py-1 bg-purple-400 border-b">
                    <h1 class="font-semibold text-sm text-white uppercase">QTY OBAT Dibeli</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div v-html="SVG.graphUpArrow" class="size-5 text-slate-600"></div>
                    <h1 class="font-bold text-gray-700">{{ formatRibuan(summarySales.total_buy_quantity) }}</h1>
                </div>
            </div>
            <div class="flex-1 border rounded-md overflow-hidden">
                <div class="px-2 py-1 bg-purple-400 border-b">
                    <h1 class="font-semibold text-sm text-white uppercase">Obat Dibeli</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div v-html="SVG.graphUpArrow" class="size-5 text-slate-600"></div>
                    <h1 class="font-bold text-gray-700">{{ formatRibuan(summarySales.total_buy_product) }}</h1>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 my-3">
            <div class="flex-1 border rounded-md overflow-hidden">
                <div class="px-2 py-1 bg-amber-400 border-b">
                    <h1 class="font-semibold text-sm text-white">JUMLAH PRODUK</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div v-html="SVG.boxSeam" class="size-5 text-slate-600"></div>
                    <h1 class="font-bold text-gray-700">{{ formatRibuan(summaryProduct.total_unique_products) }}</h1>
                </div>
            </div>
            <div class="flex-1 border rounded-md overflow-hidden">
                <div class="px-2 py-1 bg-amber-400 border-b">
                    <h1 class="font-semibold text-sm text-white">JUMLAH QTY</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div v-html="SVG.boxSeam" class="size-5 text-slate-600"></div>
                    <h1 class="font-bold text-gray-700">{{ formatRibuan(summaryProduct.total_stock_onhand) }}</h1>
                </div>
            </div>
            <div class="flex-1 border rounded-md overflow-hidden">
                <div class="px-2 py-1 bg-amber-400 border-b">
                    <h1 class="font-semibold text-sm text-white">PRODUK STOK HABIS</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div v-html="SVG.boxSeam" class="size-5 text-slate-600"></div>
                    <h1 class="font-bold text-gray-700">{{ formatRibuan(summaryProduct.total_out_of_stock_products) }}</h1>
                </div>
            </div>
            <div class="flex-1 border rounded-md overflow-hidden">
                <div class="px-2 py-1 bg-amber-400 border-b">
                    <h1 class="font-semibold text-sm text-white">PRODUK STOK KRITIS</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div v-html="SVG.boxSeam" class="size-5 text-slate-600"></div>
                    <h1 class="font-bold text-gray-700">{{ formatRibuan(summaryProduct.total_critical_stock_products) }}</h1>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3" v-role="['admin']">
            <div class="flex-1 border rounded-md overflow-hidden">
                <div class="px-2 py-1 bg-red-400 border-b">
                    <h1 class="font-semibold text-sm text-white uppercase">Potensi Omzet Kotor</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div v-html="SVG.cashStack" class="size-5 text-slate-600"></div>
                    <h1 class="font-bold text-gray-700">{{ convertRp(summaryProduct.total_potential_omzet) }}</h1>
                </div>
            </div>
            <div class="flex-1 border rounded-md overflow-hidden">
                <div class="px-2 py-1 bg-red-400 border-b">
                    <h1 class="font-semibold text-sm text-white uppercase">Harga Pokok Penjualan</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div v-html="SVG.cashStack" class="size-5 text-slate-600"></div>
                    <h1 class="font-bold text-gray-700">{{ convertRp(summaryProduct.total_product_cost) }}</h1>
                </div>
            </div>
            <div class="flex-1 border rounded-md overflow-hidden">
                <div class="px-2 py-1 bg-red-400 border-b">
                    <h1 class="font-semibold text-sm text-white uppercase">Potensi Keuntungan</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div v-html="SVG.cashStack" class="size-5 text-slate-600"></div>
                    <h1 class="font-bold text-gray-700">{{ convertRp(summaryProduct.total_potential_profit) }}</h1>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import ElDateRangeInput from '../ElDateRangeInput.vue';
import { convertRp, formatRibuan } from '../../helpers/utils';
import SVG from '../../helpers/svg'
import { ref } from 'vue';
import { APISummaryProducts, APIsummarySales, APIsummaryTransaction, APITransactionDateByDate } from '../../api/apiChart';
import useGetData from '../../composables/useGetData';

const { 1: fetchData } = useGetData();

const summaryCount = ref({
    total_transaction: 0,
    total_sales: 0,
    total_quantity: 0,
    total_product: 0
});
const summaryProduct = ref({
    total_unique_products: 0,
    total_stock_onhand: 0,
    total_out_of_stock_products: 0,
    total_critical_stock_products: 0,
})
const summarySales = ref({
    total_profit: 0,
    total_buy_price: 0,
    total_buy_product: 0,
    total_buy_quantity: 0,
});
const startDate = ref(null);
const endDate = ref(null);

function getTransactionDateByDate() {
    fetchData(APITransactionDateByDate, false, true, (data) => {
        const date = data.map((item) => item.date);
        transactionSeries.value[0].data = data.map((item) => item.total);
        transactionOptions.value.xaxis.categories = date;
        salesSeries.value[0].data = data.map((item) => item.total_sales);
        if (profile.value.role === 'admin') {
            salesSeries.value[1].data = data.map((item) => item.total_profit);
        }
        salesOptions.value.xaxis.categories = date;
    });
}

function getSummaryData() {
    fetchData(() => APIsummaryTransaction({ start: startDate.value, end: endDate.value }), false, true, (data) => {
        if (data) {
            summaryCount.value = data;
        }
    });
    fetchData(APISummaryProducts, false, true, (data) => {
        if (data) {
            summaryProduct.value = data;
        }
    });
}

function getSalesData() {
    fetchData(() => APIsummarySales({ start: startDate.value, end: endDate.value }), false, true, (data) => {
        if (data) {
            summarySales.value = data;
        }
    })
}

// getTransactionDateByDate();
getSummaryData();
getSalesData();
</script>