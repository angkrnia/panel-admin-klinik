<template>
    <section>
        <TitleDashboard title="Daftar Antrian">
            <template #btn1>
                <el-button type="primary" @click="openDialog">Buat Antrian</el-button>
            </template>
        </TitleDashboard>
    </section>

    <section>
        <p class="text-sm text-gray-500">Tanggal</p>
        <el-date-picker v-model="filterData.date" type="date" placeholder="Pick a day" />
        <div>
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                <template v-for="(item, index) in filters" :key="index">
                    <el-tab-pane :label="item.label" :name="item.name">
                        <div class="py-5">
                            <el-table :data="listData" v-loading="loading" stripe border style="width: 100%">
                                <el-table-column prop="queue" min-width="80" align="center" label="Nomor Antrian" />
                                <el-table-column prop="patient.fullname" min-width="100" label="Nama Pasien" />
                                <el-table-column prop="patient.nama_keluarga" min-width="120" label="Nama Keluarga" />
                                <el-table-column prop="patient.age" label="Usia" />
                                <el-table-column prop="patient.record_no" label="No. Rekam Medis" min-width="120" />
                                <el-table-column prop="patient.gender" min-width="50" label="JK" />
                                <el-table-column prop="patient.phone" min-width="120" label="No. HP" />
                                <el-table-column prop="patient.address" min-width="120" label="Alamat">
                                    <template #default="scope">
                                        <p class="line-clamp-1">{{ scope.row.patient.address }}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="doctor.fullname" min-width="100" label="Dokter" />
                                <el-table-column prop="history.complaint" min-width="120" label="Keluhan">
                                    <template #default="scope">
                                        <el-popover trigger="hover" placement="top">
                                            <template #default>
                                                <p>{{ scope.row.history.complaint }}</p>
                                            </template>
                                            <template #reference>
                                                <p class="cursor-pointer line-clamp-1">{{ scope.row.history.complaint }}</p>
                                            </template>
                                        </el-popover>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="created_at" label="Dibuat">
                                    <template #default="scope">
                                        {{ convertDate(scope.row.created_at) }}
                                    </template>
                                </el-table-column>
                                <!-- Untuk kolom aksi -->
                                <TableColumnAction show-view @click-view="onViewDialog" />
                            </el-table>
                        </div>
                    </el-tab-pane>
                </template>
            </el-tabs>
        </div>
    </section>

    <!-- FORM ADD DIALOG -->
    <el-dialog v-model="addDialog" :width="dialogWidth()" top="5vh">
        <template #header>
            <h1 class="border-b pb-5">Tambah Antrian Baru</h1>
        </template>
        <el-form label-width="120px" :label-position="labelPosition()" class="space-x-10" :model="addData" ref="addForm">
            <div class="w-full">
                <el-form-item label="Nama Pasien" prop="patient_id">
                    <el-patient-select v-model="addData.patient_id" />
                </el-form-item>
                <el-form-item label="Keluhan" prop="complaint">
                    <el-input v-model="addData.complaint" type="textarea" placeholder="Keluhan" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Tekanan Darah" prop="blood_pressure">
                    <el-input v-model="addData.blood_pressure" placeholder="Tekanan Darah" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Berat" prop="weight">
                    <el-input type="number" v-model="addData.weight" placeholder="Berat" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Tinggi" prop="height">
                    <el-input type="number" v-model="addData.height" placeholder="Tinggi" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Suhu" prop="temperature">
                    <el-input type="number" v-model="addData.temperature" placeholder="Suhu" style="width: 100%" />
                </el-form-item>
            </div>
        </el-form>
        <template #footer>
            <FooterButtonDialog @save-click="onSaveAdd" @cancel-click="cancelAdd" />
        </template>
    </el-dialog>
</template>
<script setup>
import { ref } from 'vue';
import usePagination from '../../composables/usePagination';
import { listAntrianPagination, tambahAntrian } from '../../api/antrianApi';
import useAddData from '../../composables/useAddData';
import { convertDate, dialogWidth, labelPosition } from '../../helpers/utils';

const activeName = ref('');
const filters = [
    {
        label: "Semua",
        name: "",
    },
    {
        label: "Pengecekan Awal",
        name: "on waiting",
    },
    {
        label: "Menunggu",
        name: "waiting",
    },
    {
        label: "Diperiksa",
        name: "on process",
    },
    {
        label: "Terlewat",
        name: "skiped",
    },
    {
        label: "Batal",
        name: "canceled",
    },
    {
        label: "Selesai",
        name: "done",
    },
];

const {
    listData,
    rowTotal,
    pageIndex,
    pageSize,
    loading,
    getListData,
    changeIndex,
    filterData,
    filterSearchData,
    search,
    filterForm,
    newPageSize,
    loadMoreData,
    isLastPage,
    links,
    currentPage,
} = usePagination();
const { addData, addForm, addDialog, saveAdd, cancelAdd, openDialog } = useAddData();


filterData.value = {
    status: activeName.value,
    data: 'all'
}

function doPaginate(index, pSize) {
    getListData(listAntrianPagination, index, pSize ? pSize : pageSize.value, search.value, filterData.value);
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

function onSaveAdd() {
    saveAdd(tambahAntrian, () => doPaginate(1));
}

function handleClick(tab) {
    filterData.value.status = tab.paneName;
    changeIndex(() => doPaginate(1), 1);
}

function onViewDialog() {

}

doPaginate(pageIndex.value);
</script>
