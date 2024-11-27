<template>
    <TitleDashboard title="Input Vital Sign/Screening" />
    <section>
        <div id="stickyElement" class="bg-white w-full sticky -top-3 z-10">
            <SearchAndPagination2 :row-total="rowTotal" :page-size="pageSize" :page-index="pageIndex" @change-page="changePage" @search="onSearch" @paginate="onPaginate" />
        </div>
        <div class="py-5">
            <el-table :data="listData" v-loading="loading" stripe border style="width: 100%">
                <el-table-column prop="queue" min-width="80" align="center" label="Nomor Antrian" />
                <el-table-column prop="status" min-width="180" align="center" label="Status">
                    <template #default="{ row }">
                        <el-tag type="success">{{ convertStatusName(row.status) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="patient.fullname" min-width="150" label="Nama Pasien" />
                <el-table-column prop="patient.nama_keluarga" min-width="150" label="Nama Keluarga" />
                <el-table-column prop="patient.age" label="Usia" />
                <el-table-column prop="patient.record_no" label="No. Rekam Medis" min-width="120" />
                <el-table-column prop="patient.gender" min-width="50" label="JK" />
                <el-table-column prop="patient.phone" min-width="120" label="No. HP" />
                <el-table-column prop="patient.address" min-width="180" label="Alamat">
                    <template #default="scope">
                        <p class="line-clamp-1">{{ scope.row.patient.address }}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="doctor.fullname" min-width="100" label="Dokter" />
                <el-table-column prop="history.complaint" min-width="250" label="Keluhan">
                    <template #default="scope">
                        <el-popover trigger="hover" placement="top">
                            <template #default>
                                <p>{{ scope.row.history.complaint }}</p>
                            </template>
                            <template #reference>
                                <p class="cursor-pointer line-clamp-3">{{ scope.row.history.complaint }}</p>
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
                <TableColumnAction show-edit @click-edit="onViewDialog" />
            </el-table>
        </div>
    </section>

    <!-- FORM VIEW DIALOG -->
    <el-dialog v-model="editDialog" :width="dialogWidth()" top="5vh">
        <template #header>
            <h1 class="border-b pb-5">Detail Antrian</h1>
        </template>
        <el-form label-width="120px" :label-position="labelPosition()" :rules="queueRule" class="space-x-10" :model="editData" ref="editForm">
            <div class="w-full">
                <el-form-item label="Nama Pasien" prop="patient_id">
                    <el-patient-select disabled v-model="editData.patient.fullname" />
                </el-form-item>
                <el-form-item label="Dokter" prop="doctor_id">
                    <el-select v-model="editData.doctor_id" placeholder="Pilih Dokter">
                        <el-option v-for="item in doctorList" :key="item.id" :label="item.fullname" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Keluhan" prop="complaint">
                    <el-input show-word-limit maxlength="255" v-model="editData.complaint" type="textarea" placeholder="Keluhan" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Catatan" prop="note">
                    <el-input show-word-limit maxlength="255" v-model="editData.note" type="textarea" placeholder="Catatan" style="width: 100%" />
                </el-form-item>
                <div class="grid grid-cols-2 gap-2">
                    <el-form-item label="Tekanan Darah" prop="blood_pressure">
                        <el-input show-word-limit maxlength="10" v-model="editData.blood_pressure" placeholder="Tekanan Darah" style="width: 100%" />
                    </el-form-item>
                    <el-form-item label="Berat" prop="weight">
                        <el-input type="number" v-model="editData.weight" placeholder="Berat" style="width: 100%" />
                    </el-form-item>
                    <el-form-item label="Tinggi" prop="height">
                        <el-input type="number" v-model="editData.height" placeholder="Tinggi" style="width: 100%" />
                    </el-form-item>
                    <el-form-item label="Suhu" prop="temperature">
                        <el-input type="number" v-model="editData.temperature" placeholder="Suhu" style="width: 100%" />
                    </el-form-item>
                </div>
            </div>
        </el-form>

        <template #footer>
            <FooterButtonDialog @save-click="onSaveUpdate" save-text="Update" @cancel-click="cancelEdit" />
        </template>
    </el-dialog>
</template>
<script setup>
import { ref } from 'vue';
import usePagination from '../../composables/usePagination';
import { insertVitalSign, listAntrianPagination, tambahAntrian } from '../../api/antrianApi';
import useAddData from '../../composables/useAddData';
import { convertDate, convertStatusName, dialogWidth, doctorListHelper, labelPosition } from '../../helpers/utils';
import { queueRule } from '../../rules/queueRule';
import useEditData from '../../composables/useEditData';

const doctorList = ref([]);
const isShowQueueInfo = ref(false);
const queueInfo = ref({
    queue: 1,
    status: 'waiting',
    doctor: 'dr. Friska Yeni Sinamo',
    patient: 'Jhon',
});

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
const {
    editData,
    editForm,
    editDialog,
    openEditDialog,
    saveEdit,
    cancelEdit,
} = useEditData();

filterData.value = {
    status: 'vital-sign',
    data: 'all',
    sort: 'asc'
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
    saveAdd(tambahAntrian, (data) => {
        queueInfo.value.queue = data.queue;
        queueInfo.value.status = data.status;
        isShowQueueInfo.value = true;
        doPaginate(1)
    });
}

function handleClick(tab) {
    filterData.value.status = tab.paneName;
    changeIndex(() => doPaginate(1), 1);
}

function onViewDialog(data) {
    data.temperature = data.history.temperature;
    data.height = data.history.height;
    data.weight = data.history.weight;
    data.blood_pressure = data.history.blood_pressure;
    data.complaint = data.history.complaint;
    data.note = data.history.note;
    data.doctor_id = data.doctor_id;
    data.record_no = data.patient.record_no;
    openEditDialog(data);
}

function onSaveUpdate() {
    saveEdit(insertVitalSign, 'id', () => {
        doPaginate(1);
    })
}

async function openQueueDialog() {
    addData.value.doctor_id = doctorList.value.find((item) => item.is_on_duty === true)?.id;
    openDialog(1);
}

async function firstLoad() {
    const data = await doctorListHelper();
    doctorList.value = data;
}

firstLoad();
doPaginate(pageIndex.value);
</script>
