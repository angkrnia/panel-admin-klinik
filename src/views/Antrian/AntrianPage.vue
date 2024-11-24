<template>
    <section>
        <TitleDashboard title="Daftar Antrian">
            <template #btn1>
                <el-button type="primary" @click="openQueueDialog">Buat Antrian</el-button>
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
                                <el-table-column prop="status" min-width="80" align="center" label="Status" />
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
        <el-form label-width="120px" :label-position="labelPosition()" :rules="queueRule" class="space-x-10" :model="addData" ref="addForm">
            <div class="w-full">
                <el-form-item label="Dokter" prop="doctor_id">
                    <el-select v-model="addData.doctor_id" placeholder="Pilih Dokter">
                        <el-option v-for="item in doctorList" :key="item.id" :label="item.fullname" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Nama Pasien" prop="patient_id">
                    <el-patient-select v-model="addData.patient_id" />
                </el-form-item>
                <el-form-item label="Keluhan" prop="complaint">
                    <el-input show-word-limit maxlength="255" v-model="addData.complaint" type="textarea" placeholder="Keluhan" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Tekanan Darah" prop="blood_pressure">
                    <el-input show-word-limit maxlength="10" v-model="addData.blood_pressure" placeholder="Tekanan Darah" style="width: 100%" />
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

    <!-- FORM VIEW DIALOG -->
    <el-dialog v-model="editDialog" :width="dialogWidth()" top="5vh">
        <template #header>
            <h1 class="border-b pb-5">Detail Antrian</h1>
        </template>
        <el-form label-width="120px" :label-position="labelPosition()" :rules="queueRule" class="space-x-10" :model="editData" ref="editForm">
            <div class="w-full">
                <el-form-item label="Dokter" prop="doctor_id">
                    <el-select disabled v-model="editData.doctor_id" placeholder="Pilih Dokter">
                        <el-option v-for="item in doctorList" :key="item.id" :label="item.fullname" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Nama Pasien" prop="patient_id">
                    <el-patient-select disabled v-model="editData.patient_id" />
                </el-form-item>
                <el-form-item label="Keluhan" prop="complaint">
                    <el-input readonly show-word-limit maxlength="255" v-model="editData.complaint" type="textarea" placeholder="Keluhan" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Tekanan Darah" prop="blood_pressure">
                    <el-input readonly show-word-limit maxlength="10" v-model="editData.blood_pressure" placeholder="Tekanan Darah" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Berat" prop="weight">
                    <el-input readonly type="number" v-model="editData.weight" placeholder="Berat" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Tinggi" prop="height">
                    <el-input readonly type="number" v-model="editData.height" placeholder="Tinggi" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Suhu" prop="temperature">
                    <el-input readonly type="number" v-model="editData.temperature" placeholder="Suhu" style="width: 100%" />
                </el-form-item>
            </div>
        </el-form>
    </el-dialog>

    <!-- DIALOG NOMOR ANTRIAN -->
    <el-dialog v-model="isShowQueueInfo" :width="dialogWidth()" top="5vh">
        <QueueInformation :item="queueInfo" @close-click="isShowQueueInfo = false" />
    </el-dialog>
</template>
<script setup>
import { ref } from 'vue';
import usePagination from '../../composables/usePagination';
import { listAntrianPagination, tambahAntrian } from '../../api/antrianApi';
import useAddData from '../../composables/useAddData';
import { convertDate, dialogWidth, doctorListHelper, labelPosition } from '../../helpers/utils';
import { queueRule } from '../../rules/queueRule';
import QueueInformation from '../../components/QueueInformation.vue';
import useEditData from '../../composables/useEditData';

const activeName = ref('');
const doctorList = ref([]);
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
    openEditDialog(data);
}

function onSaveEdit() {

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
