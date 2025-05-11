<template>
    <section>
        <TitleDashboard title="Riwayat Transaksi" />
    </section>

    <section>
        <el-collapse>
            <el-collapse-item name="1">
                <template #title>
                    <h1 class="tracking-wide capitalize text-base">Filter</h1>
                </template>
                <el-form label-width="150px" label-position="top" :model="filterData">
                    <div class="rounded-lg border p-2 bg-slate-50">
                        <div class=" py-2 gap-2 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
                            <el-select v-model="filterData.doctor_id" clearable filterable placeholder="Pilih Dokter" @change="(val) => { onFilterData('doctor_id', val) }"
                                class="el-width-for-filter text-xs">
                                <el-option v-for="item in doctorList" :key="item.id" :label="item.fullname" :value="item.id"></el-option>
                            </el-select>
                            <el-select-v2 v-model="filterData.sort" :options="[
                                { label: 'Semua', value: '' },
                                { label: 'A-Z', value: 'ASC' },
                                { label: 'Z-A', value: 'DESC' },
                            ]" filterable placeholder="Pilih Urutan" @change="(val) => { onFilterData('sort', val) }" class="el-width-for-filter text-xs"></el-select-v2>
                            <el-select v-model="filterData.status" filterable placeholder="Pilih Status" @change="(val) => { onFilterData('status', val) }"
                                class="el-width-for-filter text-xs">
                                <el-option v-for="item in filters" :key="item.name" :label="item.label" :value="item.name"></el-option>
                            </el-select>
                            <ElDateRangeInput v-model:startDate="filterData.from" v-model:endDate="filterData.to" class="flex-1" @change="(val) => {
                                onFilterData('date', val)
                            }" />
                        </div>
                    </div>
                </el-form>
            </el-collapse-item>
        </el-collapse>
    </section>

    <section class="mt-5 space-y-3">
        <div v-for="(item, index) in listData" :key="index" class="bg-white shadow overflow-hidden rounded-lg">
            <div class="p-4 sm:px-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div v-html="people" class="size-5"></div>
                        <div class="ml-3">
                            <span class="text-sm font-medium text-gray-900">{{ item.patient_name }}</span>
                            <!-- <span class="ml-2 text-xs text-gray-500">(3 obat)</span> -->
                        </div>
                        <span class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">{{ convertPaymentStatus(item.status)
                        }}</span>
                    </div>
                    <div class="text-right">
                        <div class="text-sm text-gray-500">Nomor Transaksi: <span class="font-medium text-blue-600">{{ item.receipt_number }}</span></div>
                        <div class="text-sm text-gray-500">Waktu Dibuat: {{ dateFormatFull(item.created_at) }}</div>
                    </div>
                </div>
            </div>

            <div class="border-t border-gray-200">
                <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    <div class="p-4 sm:px-6">
                        <h4 class="text-xs font-medium text-gray-500 uppercase mb-2">DOKTER</h4>
                        <div class="flex items-center gap-4">
                            <div class="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden">
                                <img :src="item.doctor.avatar" alt="Doctor" class="w-full h-full object-cover" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900">{{ item.doctor_name }}</p>
                                <p class="text-sm text-gray-500 line-clamp-2">{{ item.doctor.description }}</p>
                                <p class="text-sm text-gray-500">{{ item.doctor.phone }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="p-4 sm:px-6">
                        <h4 class="text-xs font-medium text-gray-500 uppercase mb-2">Pasien</h4>
                        <p class="text-sm font-medium text-gray-900">{{ item.patient_name }}</p>
                        <p class="text-sm text-gray-500 mt-2">Antrian #{{ item.queue.queue }}</p>
                        <p class="text-sm text-gray-500 mt-2">Datang: {{ dateFormatFull(item.queue.created_at) }}</p>
                        <p class="text-sm text-gray-500 mt-2">Status Antrian: <span class="text-green-600 font-medium">{{ convertStatusName(item.queue.status) }}</span></p>
                    </div>

                    <div class="p-4 sm:px-6">
                        <div class="flex flex-col gap-4">
                            <div>
                                <h4 class="text-xs font-medium text-gray-500 uppercase mb-2">Pembayaran</h4>
                                <p class="text-sm text-gray-900">{{ item.payment_method || '-' }}</p>
                            </div>
                            <div>
                                <h4 class="text-xs font-medium text-gray-500 uppercase mb-2">Status Transaksi</h4>
                                <p class="text-sm text-yellow-600 font-medium">{{ convertPaymentStatus(item.status) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center">
                <div class="flex space-x-3">
                    <button @click="onDetailSale(item)" class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"><i class="fas fa-edit mr-1"></i>
                        Detail</button>
                    <button class="text-sm text-green-600 hover:text-green-800 font-medium flex items-center"><i class="fas fa-print mr-1"></i> Cetak</button>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-500">Total Pembayaran</p>
                    <p class="text-lg font-bold text-gray-900">{{ convertRp(item.grand_total || 0) }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { saleHeaderPagination } from '../../api/salesApi';
import useListDataPaginate from '../../composables/usePagination';
import { people } from '../../helpers/svg';
import { convertDate, convertPaymentStatus, convertRp, convertStatusName, dateFormatFull } from '../../helpers/utils';

const router = useRouter();
const { listData, rowTotal, pageIndex, pageSize, getListData, changeIndex, loading, filterData, search } = useListDataPaginate();

function doPaginate(index, pSize) {
    getListData(saleHeaderPagination, index, pSize ? pSize : pageSize.value, search.value, filterData.value);
}

function onSearch(textSearch) {
    search.value = textSearch;
    changePage();
}

function onPaginate(pageSize) {
    changeIndex(() => doPaginate(1, pageSize), 1, pageSize);
}

function changePage(index = 1) {
    changeIndex(() => doPaginate(index), index);
}

function onDetailSale(sale) {
    router.push({ name: 'sales-detail', query: { qId: sale.queue.id } });
}

doPaginate();
</script>