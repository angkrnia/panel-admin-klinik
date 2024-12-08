<template>
    <section>
        <TitleDashboard title="Riwayat Kunjungan" />
    </section>

    <section v-if="false">
        <el-collapse>
            <el-collapse-item name="1">
                <template #title>
                    <h1 class="tracking-wide capitalize text-base">Filter</h1>
                </template>
                <el-form label-width="150px" label-position="top" :model="filterData">
                    <div class="rounded-lg border p-2 bg-slate-50">
                        <div class=" py-2 gap-2 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
                            <el-select-v2 v-model="filterData.SORT" :options="[
                                { label: 'Semua', value: '' },
                                { label: 'A-Z', value: 'ASC' },
                                { label: 'Z-A', value: 'DESC' },
                            ]" filterable placeholder="Pilih Dokter" @change="(val) => { onFilterData('DOCTOR', val) }" class="el-width-for-filter text-xs"></el-select-v2>
                            <el-select-v2 v-model="filterData.SORT" :options="[
                                { label: 'Semua', value: '' },
                                { label: 'A-Z', value: 'ASC' },
                                { label: 'Z-A', value: 'DESC' },
                            ]" filterable placeholder="Pilih Urutan" @change="(val) => { onFilterData('SORT', val) }" class="el-width-for-filter text-xs"></el-select-v2>
                            <el-select-v2 v-model="filterData.ORDER_BY" :options="[
                                { label: 'Semua', value: '' },
                                { label: 'Tanggal', value: 'DATE' },
                            ]
                                " filterable placeholder="Pilih Filter" @change="(val) => { onFilterData('ORDER_BY', val) }" class="el-width-for-filter text-xs"></el-select-v2>
                            <ElDateRangeInput v-model:startDate="filterData.EFF_DATE" v-model:endDate="filterData.EXP_DATE" class="flex-1" @change="(val) => {
                                onFilterData('DATE', val)
                            }" />
                        </div>
                    </div>
                </el-form>
            </el-collapse-item>
        </el-collapse>
    </section>

    <div id="stickyElement" class="bg-white w-full sticky -top-3 z-10">
        <SearchAndPagination2 :row-total="rowTotal" :page-size="pageSize" :page-index="pageIndex" @change-page="changePage" @search="onSearch" @paginate="onPaginate" />
    </div>
    <div class="py-5">
        <el-table :data="listData" v-loading="loading" stripe border style="width: 100%">
            <el-table-column prop="queue.created_at" label="Tanggal" min-width="150">
                <template #default="scope">
                    {{ convertDate(scope.row.queue.created_at) }}
                </template>
            </el-table-column>
            <el-table-column prop="queue.queue" label="Antrian" />
            <el-table-column prop="patient.record_no" label="No. RM" />
            <el-table-column prop="patient.fullname" label="Nama Pasien" min-width="170" />
            <el-table-column prop="queue.doctor.fullname" label="Nama Dokter" min-width="170" />
            <el-table-column prop="patient.nama_keluarga" label="Nama Keluarga" min-width="170" />
            <el-table-column prop="patient.gender" label="Gender" min-width="90" />
            <el-table-column prop="patient.phone" label="No. HP" min-width="150" />
            <el-table-column prop="diagnosa" label="Diagnosa" min-width="150" />
            <el-table-column prop="pemeriksaan" label="Pemeriksaan" min-width="150" />
            <!-- Untuk kolom aksi -->
            <TableColumnAction show-view @click-view="onViewDialog" />
        </el-table>
    </div>

    <el-dialog v-model="viewDialog" :width="dialogWidth()" top="5vh">
        <div class="space-y-2">
            <section class="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <div class="border rounded-md overflow-hidden">
                    <div class="p-2 bg-blue-500">
                        <h1 class="font-semibold text-white text-sm">Detail Pasien</h1>
                    </div>
                    <div class="p-2 text-sm space-y-2">
                        <div class="leading-5">
                            <p class="font-semibold">No. Rekam Medis</p>
                            <p>{{ viewData?.patient?.record_no }}</p>
                        </div>
                        <div class="flex items-center gap-x-2 justify-between">
                            <div class="leading-5">
                                <p class="font-semibold">Nama Pasien</p>
                                <p>{{ viewData?.patient?.fullname }}</p>
                            </div>
                            <div class="leading-5 text-end">
                                <p class="font-semibold">TTL/Umur</p>
                                <p>{{ viewData?.patient?.birthday || '-' }} / {{ viewData?.patient?.age || '0' }} thn</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-x-2 justify-between">
                            <div class="leading-5">
                                <p class="font-semibold">No. HP</p>
                                <p>{{ viewData?.patient?.phone }}</p>
                            </div>
                            <div class="leading-5 text-end">
                                <p class="font-semibold">No. KTP</p>
                                <p>{{ viewData?.patient?.no_ktp || '-' }}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-x-2 justify-between">
                            <div class="leading-5">
                                <p class="font-semibold">Nama Keluarga</p>
                                <p>{{ viewData?.patient?.nama_keluarga }}</p>
                            </div>
                            <div class="leading-5 text-end">
                                <p class="font-semibold">Jenis Kelamin</p>
                                <p>{{ viewData?.patient?.gender == 'L' ? 'Laki-laki' : 'Perempuan' }}</p>
                            </div>
                        </div>
                        <div class="leading-5">
                            <p class="font-semibold">Alamat</p>
                            <p>{{ viewData?.patient?.address }}</p>
                        </div>
                        <div class="leading-5">
                            <p class="font-semibold">Alergi</p>
                            <p>{{ viewData?.patient?.allergy || '-' }}</p>
                        </div>
                    </div>
                </div>
                <div class="border rounded-md overflow-hidden">
                    <div class="p-2 bg-blue-500">
                        <h1 class="font-semibold text-white text-sm">Detail Kunjungan</h1>
                    </div>
                    <div class="p-2 space-y-2">
                        <div class="flex items-center gap-x-2">
                            <img :src="viewData?.queue?.doctor?.avatar" alt="Dokter" class="h-20 rounded-full">
                            <div class="">
                                <div class="leading-5">
                                    <p class="font-semibold">Nama Dokter</p>
                                    <p>{{ viewData?.queue?.doctor?.fullname }}</p>
                                </div>
                                <div class="leading-5">
                                    <p class="font-semibold">No. HP</p>
                                    <p>{{ viewData?.queue?.doctor?.phone }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="leading-5 flex items-center justify-between">
                            <p class="font-semibold">No. Antrian</p>
                            <p class="font-bold">{{ viewData?.queue?.queue }}</p>
                        </div>
                        <div class="flex items-start gap-x-2 justify-between">
                            <div class="leading-5 flex-1">
                                <p class="font-semibold">Kedatangan</p>
                                <p>{{ convertDate(viewData?.queue?.created_at) }}</p>
                            </div>
                            <div class="leading-5 flex-1 text-end">
                                <p class="font-semibold">Kepulangan</p>
                                <p>{{ convertDate(viewData?.queue?.updated_at) }}</p>
                            </div>
                        </div>
                        <div class="leading-5">
                            <p class="font-semibold">Saran Dokter</p>
                            <p>{{ viewData?.saran || '-' }}</p>
                        </div>
                    </div>
                </div>
            </section>
            <section class="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <div class="border rounded-md overflow-hidden">
                    <div class="p-2 bg-blue-500">
                        <h1 class="font-semibold text-white text-sm">Vital Sign</h1>
                    </div>
                    <div class="p-2 space-y-2">
                        <div class="flex items-center gap-x-2 justify-between">
                            <div class="leading-5">
                                <p class="font-semibold">Tekanan Darah</p>
                                <p>{{ viewData?.blood_pressure || '-' }} mmHg</p>
                            </div>
                            <div class="leading-5 text-end">
                                <p class="font-semibold">Suhu</p>
                                <p>{{ viewData?.temperature || '-' }} °C</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-x-2 justify-between">
                            <div class="leading-5">
                                <p class="font-semibold">Berat</p>
                                <p>{{ viewData?.weight || '-' }} kg</p>
                            </div>
                            <div class="leading-5 text-end">
                                <p class="font-semibold">Tinggi</p>
                                <p>{{ viewData?.height || '-' }} cm</p>
                            </div>
                        </div>
                        <div class="leading-5">
                            <p class="font-semibold">Keluhan</p>
                            <p>{{ viewData?.complaint || '-' }}</p>
                        </div>
                        <div class="leading-5">
                            <p class="font-semibold">Catatan</p>
                            <p>{{ viewData?.note || '-' }}</p>
                        </div>
                    </div>
                </div>
                <div class="border rounded-md overflow-hidden">
                    <div class="p-2 bg-blue-500">
                        <h1 class="font-semibold text-white text-sm">Detail Pemeriksaan</h1>
                    </div>
                    <div class="p-2 space-y-2">
                        <div class="leading-5">
                            <p class="font-semibold">Pemeriksaan</p>
                            <p>{{ viewData?.pemeriksaan || '-' }}</p>
                        </div>
                        <div class="leading-5">
                            <p class="font-semibold">Diagnosa</p>
                            <p>{{ viewData?.diagnosa || '-' }}</p>
                        </div>
                        <div class="leading-5">
                            <p class="font-semibold">Tindakan</p>
                            <p>{{ viewData?.tindakan || '-' }}</p>
                        </div>
                        <div class="leading-5">
                            <p class="font-semibold">Terapi/Obat</p>
                            <div v-html="formattedTherapy(viewData?.teraphy)"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </el-dialog>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { riwayatKunjunganPagination } from '../../api/apiRiwayatKunjungan';
import ElDateRangeInput from '../../components/ElDateRangeInput.vue';
import useListDataPaginate from '../../composables/usePagination';
import useViewData from '../../composables/useViewData';
import { convertDate, dialogWidth } from '../../helpers/utils';

const route = useRoute();

const { listData, rowTotal, pageIndex, pageSize, getListData, changeIndex, loading, filterData, search } = useListDataPaginate();
const { viewData, viewDialog, closeView, openViewDialog } = useViewData();

if (route.query.page) {
    filterData.value.page = parseInt(route.query.page);
}

if (route.query.limit) {
    filterData.value.limit = parseInt(route.query.limit);
}

function onFilterData(type, val) {
    onFilterSearch();
}

function onResetFilter() {
    search.value = '';
    filterData.value = {};
    onFilterSearch();
    removeQueryParams();
}

function doPaginate(index = 1, pSize) {
    getListData(riwayatKunjunganPagination, index, pSize ? pSize : pageSize.value, search.value, filterData.value);
}

function onFilterSearch() {
    changeIndex(() => doPaginate(), pageIndex.value, null, filterData.value);
}

let debounceTimeout;
function onSearch(textSearch) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        search.value = textSearch;
        changePage();
    }, 1000);
}

function onPaginate(pageSize) {
    changeIndex(() => doPaginate(1, pageSize), 1, pageSize);
}

function changePage(index = 1) {
    changeIndex(() => doPaginate(index), index);
}

function onViewDialog(data) {
    openViewDialog(data);
}

function formattedTherapy(text) {
    if (!text) return '-';
    return text.replace(/\n/g, '<br>');
}

doPaginate(pageIndex.value);
</script>