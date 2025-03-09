<template>
    <TitleDashboard title="Pengambilan Obat" />
    <section>
        <div id="stickyElement" class="bg-white w-full sticky -top-3 z-10">
            <SearchAndPagination2 :row-total="rowTotal" :page-size="pageSize" :page-index="pageIndex" @change-page="changePage" @search="onSearch" @paginate="onPaginate" />
        </div>
        <div class="py-5">
            <el-table :data="listData" v-loading="loading" stripe border style="width: 100%">
                <el-table-column prop="queue" align="center" label="No. Antrian" />
                <el-table-column prop="status" min-width="180" align="center" label="Status">
                    <template #default="{ row }">
                        <el-tag type="success">{{ convertStatusName(row.status) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="patient.record_no" label="No. RM" />
                <el-table-column prop="patient.fullname" min-width="150" label="Nama Pasien" />
                <el-table-column prop="patient.nama_keluarga" min-width="150" label="Nama Keluarga" />
                <el-table-column prop="doctor.fullname" min-width="150" label="Dokter" />
                <el-table-column prop="patient.age" label="Usia" />
                <el-table-column prop="patient.gender" min-width="50" label="JK" />
                <el-table-column prop="patient.phone" min-width="130" label="No. HP" />
                <el-table-column prop="patient.address" min-width="180" label="Alamat">
                    <template #default="scope">
                        <p class="line-clamp-1">{{ scope.row.patient.address }}</p>
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
    </section>

    <!-- FORM VIEW DIALOG -->
    <el-dialog v-model="editDialog" :width="dialogWidth()" top="5vh">
        <template #header>
            <h1 class="border-b pb-5">Detail Antrian</h1>
        </template>

        <PatientCard :data="editData" :medicineList="medicineList" @accept-medicine="onAcceptMedicine" @refresh-medicine="fetchMedicine" />

        <template #footer>
            <FooterButtonDialog @save-click="onSaveUpdate" :useConfirmation="true" save-text="Lanjut Pembayaran" @cancel-click="cancelEdit"
                text-confirm="Pastikan semua data sudah benar?" />
        </template>
    </el-dialog>
</template>
<script setup>
import { ref } from 'vue';
import usePagination from '../../composables/usePagination';
import { completedQueue, detailKunjungan, pharmacyPagination, tambahAntrian } from '../../api/antrianApi';
import useAddData from '../../composables/useAddData';
import { convertDate, convertStatusName, dialogWidth, doctorListHelper, messageInfo } from '../../helpers/utils';
import useEditData from '../../composables/useEditData';
import useGetData from '../../composables/useGetData';
import PatientCard from './partials/PatientCard.vue';
import { apiAcceptMedicine, apiListMedicineByQueue } from '../../api/apiMedicine';

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
const [detail, getDetail] = useGetData();
const { 1: fetchApi } = useGetData();
const [medicineList, getMedicineList, isLoadingGetMedicine] = useGetData();

filterData.value = {
    status: 'vital-sign',
    data: 'all',
    sort: 'asc'
}

function doPaginate(index, pSize) {
    getListData(pharmacyPagination, index, pSize ? pSize : pageSize.value, search.value, filterData.value);
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

function onAcceptMedicine(medsId) {
    fetchApi(() => apiAcceptMedicine(editData.value.id, medsId), false, true, () => {
        fetchMedicine(editData.value.id);
    });
}

function fetchMedicine(id = editData.value.id) {
    getMedicineList(() => apiListMedicineByQueue(id), false, true);
}

function onViewDialog(item) {
    getDetail(() => detailKunjungan(item.id), false, true, (data) => {
        fetchMedicine(item.id);
        openEditDialog(data);
    })
}

function onSaveUpdate() {
    fetchApi(() => completedQueue(editData.value.id), false, true, (data) => {
        doPaginate(1);
        editDialog.value = false;
        messageInfo("Berhasil menyelesaikan antrian", 'success');
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
