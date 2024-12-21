<template>
    <section>
        <TitleDashboard title="Daftar Pasien">
            <template #btn1>
                <el-button type="primary" @click="openAddDialog">Tambah Pasien</el-button>
            </template>
        </TitleDashboard>
        <div id="stickyElement" class="bg-white w-full sticky -top-3 z-10">
            <SearchAndPagination2 :row-total="rowTotal" :page-size="pageSize" :page-index="pageIndex" @change-page="changePage" @search="onSearch" @paginate="onPaginate" />
        </div>
        <div class="py-5">
            <el-table :data="listData" v-loading="loading" stripe border style="width: 100%">
                <el-table-column type="index" label="No" min-width="50" />
                <el-table-column prop="record_no" label="No. RM" />
                <el-table-column prop="fullname" label="Nama Pasien" min-width="170" />
                <el-table-column prop="nama_keluarga" label="Nama Keluarga" min-width="170" />
                <el-table-column prop="gender" label="Gender" min-width="90" />
                <el-table-column prop="no_ktp" label="No. KTP">
                    <template #default="scope">
                        <p class="line-clamp-1">{{ scope.row.no_ktp || '-' }}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="No. HP" min-width="150" />
                <el-table-column prop="birthday" label="Umur" min-width="150">
                    <template #default="scope">
                        {{ scope.row.birthday }} ({{ scope.row.age }} thn)
                    </template>
                </el-table-column>
                <el-table-column prop="allergy" label="Alergi" min-width="180">
                    <template #default="scope">
                        <p class="line-clamp-1">{{ scope.row.allergy || '-' }}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="Alamat" min-width="180" />
                <el-table-column prop="created_at" label="Dibuat" min-width="120">
                    <template #default="scope">
                        {{ convertDate(scope.row.created_at) }}
                    </template>
                </el-table-column>
                <!-- Untuk kolom aksi -->
                <TableColumnAction show-edit show-delete show-ambil-antrian @click-queue="onOpenQueue" @click-edit="onEditDialog" @click-delete="onDeleteData" />
            </el-table>
        </div>
        <div class="flex items-center justify-center">
            <el-pagination background layout="prev, pager, next" :total="rowTotal" :page-size="pageSize" @current-change="changePage" :current-page="currentPage"
                :hide-on-single-page="false" />
        </div>
    </section>

    <!-- FORM ADD DIALOG -->
    <el-dialog v-model="addDialog" :width="dialogWidth()" top="5vh">
        <template #header>
            <h1 class="border-b pb-5">Tambah Pasien</h1>
        </template>
        <el-form label-width="150px" :label-position="labelPosition()" class="space-x-10" :model="addData" :rules="patientRule" ref="addForm">
            <div class="w-full">
                <el-form-item label="No. RM" prop="record_no">
                    <el-input v-model="addData.record_no" placeholder="No. RM" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Nama Pasien" prop="fullname">
                    <el-input v-model="addData.fullname" placeholder="Nama Pasien" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Nama Keluarga" prop="nama_keluarga">
                    <el-input v-model="addData.nama_keluarga" placeholder="Nama Keluarga" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Jenis Kelamin" prop="gender">
                    <el-radio-group v-model="addData.gender">
                        <el-radio-button label="Laki-Laki" value="L" />
                        <el-radio-button label="Perempuan" value="P" />
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="Tanggal Lahir" prop="birthday">
                    <el-date-picker v-model="addData.birthday" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" placeholder="Pilih Tanggal" />
                </el-form-item>
                <el-form-item label="Umur" prop="age">
                    <el-input-number v-model="addData.age" placeholder="Umur" />
                </el-form-item>
                <el-form-item label="No. KTP" prop="no_ktp">
                    <el-input type="number" v-model="addData.no_ktp" placeholder="No KTP" />
                </el-form-item>
                <el-form-item label="No. HP" prop="phone">
                    <el-input type="number" v-model="addData.phone" placeholder="No HP" />
                </el-form-item>
                <el-form-item label="Alamat" prop="address">
                    <el-input v-model="addData.address" type="textarea" placeholder="Alamat" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Memiliki alergi" prop="has_allergy">
                    <el-switch v-model="addData.has_allergy" />
                    <span class="text-sm text-gray-500 ml-3">{{ addData.has_allergy ? 'Ya' : 'Tidak' }}</span>
                </el-form-item>
                <el-form-item v-if="addData.has_allergy" label="Alergi" prop="allergy">
                    <el-input v-model="addData.allergy" type="textarea" placeholder="Alergi" style="width: 100%" />
                </el-form-item>
            </div>
        </el-form>
        <template #footer>
            <FooterButtonDialog @save-click="onSaveAdd" @cancel-click="cancelAdd" />
        </template>
    </el-dialog>

    <!-- FORM EDIT DIALOG -->
    <el-dialog v-model="editDialog" :width="dialogWidth()" top="5vh">
        <template #header>
            <h1 class="border-b pb-5">Tambah Pasien</h1>
        </template>
        <el-form label-width="150px" :label-position="labelPosition()" class="space-x-10" :model="editData" :rules="patientRule" ref="editForm">
            <div class="w-full">
                <el-form-item label="No. RM" prop="record_no">
                    <el-input v-model="editData.record_no" placeholder="No. RM" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Nama Pasien" prop="fullname">
                    <el-input v-model="editData.fullname" placeholder="Nama Pasien" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Nama Keluarga" prop="nama_keluarga">
                    <el-input v-model="editData.nama_keluarga" placeholder="Nama Keluarga" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Jenis Kelamin" prop="gender">
                    <el-radio-group v-model="editData.gender">
                        <el-radio-button label="Laki-Laki" value="L" />
                        <el-radio-button label="Perempuan" value="P" />
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="Tanggal Lahir" prop="birthday">
                    <el-date-picker v-model="editData.birthday" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" placeholder="Pilih Tanggal" />
                </el-form-item>
                <el-form-item label="Umur" prop="age">
                    <el-input-number v-model="editData.age" placeholder="Umur" />
                </el-form-item>
                <el-form-item label="No. KTP" prop="no_ktp">
                    <el-input type="number" v-model="editData.no_ktp" placeholder="No KTP" />
                </el-form-item>
                <el-form-item label="No. HP" prop="phone">
                    <el-input type="number" v-model="editData.phone" placeholder="No HP" />
                </el-form-item>
                <el-form-item label="Alamat" prop="address">
                    <el-input v-model="editData.address" type="textarea" placeholder="Alamat" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Memiliki alergi" prop="has_allergy">
                    <el-switch v-model="editData.has_allergy" />
                    <span class="text-sm text-gray-500 ml-3">{{ editData.has_allergy ? 'Ya' : 'Tidak' }}</span>
                </el-form-item>
                <el-form-item v-if="editData.has_allergy" label="Alergi" prop="allergy">
                    <el-input v-model="editData.allergy" type="textarea" placeholder="Alergi" style="width: 100%" />
                </el-form-item>
            </div>
        </el-form>
        <template #footer>
            <FooterButtonDialog @save-click="onSaveEdit" @cancel-click="cancelEdit" />
        </template>
    </el-dialog>

    <!-- FORM TAMBAH ANTRIAN -->
    <el-dialog v-model="queueDialog" :width="dialogWidth()" top="5vh">
        <template #header>
            <h1 class="border-b pb-5">Tambah Antrian Baru</h1>
        </template>
        <el-form label-width="120px" :label-position="labelPosition()" :rules="queueRule" class="space-x-10" :model="queueData" ref="queueForm">
            <div class="w-full">
                <div v-if="queueInfo.hasAllergy" class="border rounded-lg mb-3 overflow-hidden text-sm shadow-sm">
                    <div class="flex items-center gap-x-1 p-1 border-b bg-red-300 text-white text-xs">
                        <el-icon>
                            <Warning />
                        </el-icon>
                        <p class="font-semibold">Pasien Memiliki Alergi</p>
                    </div>
                    <div class="p-2 bg-gray-50">
                        <p class="text-xs">{{ queueInfo.allergy }}</p>
                    </div>
                </div>
                <el-form-item label="Nama Pasien" prop="patient">
                    <el-input disabled v-model="queueInfo.patient" placeholder="Pasien" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Dokter" prop="doctor_id">
                    <el-select v-model="queueData.doctor_id" placeholder="Pilih Dokter">
                        <el-option v-for="item in doctorList" :key="item.id" :label="item.fullname" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Keluhan" prop="complaint">
                    <el-input show-word-limit maxlength="255" v-model="queueData.complaint" type="textarea" placeholder="Keluhan" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Catatan" prop="note">
                    <el-input show-word-limit maxlength="255" v-model="queueData.note" type="textarea" placeholder="Catatan" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Tekanan Darah" prop="blood_pressure">
                    <el-input show-word-limit maxlength="10" v-model="queueData.blood_pressure" placeholder="Tekanan Darah" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Berat" prop="weight">
                    <el-input show-word-limit maxlength="10" type="number" v-model="queueData.weight" placeholder="Berat" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Tinggi" prop="height">
                    <el-input show-word-limit maxlength="10" type="number" v-model="queueData.height" placeholder="Tinggi" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Suhu" prop="temperature">
                    <el-input show-word-limit maxlength="10" type="number" v-model="queueData.temperature" placeholder="Suhu" style="width: 100%" />
                </el-form-item>
            </div>
        </el-form>
        <template #footer>
            <FooterButtonDialog @save-click="onSaveQueue" @cancel-click="cancelQueue" />
        </template>
    </el-dialog>

    <!-- DIALOG NOMOR ANTRIAN -->
    <el-dialog v-model="isShowQueueInfo" :width="dialogWidth()" top="5vh">
        <QueueInformation :item="queueInfo" @close-click="isShowQueueInfo = false" />
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { deletePasien, listPasienPagination, tambahPasien, updatePasien } from '../../api/pasienApi';
import useAddData from '../../composables/useAddData';
import useDeleteData from '../../composables/useDeleteData';
import useEditData from '../../composables/useEditData';
import usePagination from '../../composables/usePagination';
import { convertDate, dialogWidth, doctorListHelper, labelPosition, messageInfo } from '../../helpers/utils';
import { patientRule } from '../../rules/patientRules';
import { tambahAntrian } from '../../api/antrianApi';
import { queueRule } from '../../rules/queueRule';
import QueueInformation from '../../components/QueueInformation.vue';
import { Warning } from '@element-plus/icons-vue';

const {
    listData,
    rowTotal,
    pageIndex,
    pageSize,
    loading,
    getListData,
    filterData,
    search,
    changeIndex,
    currentPage,
} = usePagination();
const { addData, addForm, addDialog, saveAdd, cancelAdd, openDialog } = useAddData();
const [
    queueData,
    queueForm,
    queueDialog,
    saveQueue,
    cancelQueue,
    requiredLabelLength,
    openQueueDialog,
    isLoadingQueue,
] = useAddData({ returnAsArray: true });
const { editData, editForm, editDialog, openEditDialog, saveEdit, cancelEdit } = useEditData();
const { deleteData } = useDeleteData();
const doctorList = ref([]);
const isShowQueueInfo = ref(false);
const queueInfo = ref({
    queue: 1,
    status: 'waiting',
    doctor: '',
    patient: '',
    hasAllergy: false,
    allergy: '',
});

function doPaginate(index, pSize) {
    getListData(listPasienPagination, index, pSize ? pSize : pageSize.value, search.value, filterData.value);
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

function onEditDialog(row) {
    row.has_allergy = row.has_allergy === 1 ? true : false;
    openEditDialog(row);
}

function onDeleteData({ id = 0 }) {
    // deleteData(deletePasien, id, () => doPaginate(1));
    messageInfo('Hanya administrator yang bisa hapus.', 'warning');
}

function onSaveAdd() {
    saveAdd(tambahPasien, () => doPaginate(1));
}

function onSaveEdit() {
    saveEdit(updatePasien, 'id', () => doPaginate(1));
}

async function onOpenQueue(row) {
    const data = await doctorListHelper();
    const currentDoctor = data.find((item) => item.is_on_duty === true);
    doctorList.value = data;
    queueData.value.doctor_id = currentDoctor?.id;
    queueData.value.patient_id = row.id;
    queueInfo.value.patient = row.fullname;
    queueInfo.value.doctor = currentDoctor?.fullname;
    queueInfo.value.hasAllergy = row.has_allergy == 1 ? true : false;
    queueInfo.value.allergy = row.allergy;
    openQueueDialog(1);
}

function onSaveQueue() {
    saveQueue(tambahAntrian, (data) => {
        queueInfo.value.queue = data.queue;
        queueInfo.value.status = data.status;
        isShowQueueInfo.value = true;
        doPaginate(1)
    });
}

async function openAddDialog() {
    openDialog(0);
}

doPaginate(pageIndex.value);
</script>