<template>
    <section>
        <TitleDashboard title="Daftar Pasien">
            <template #btn1>
                <el-button type="primary" @click="openDialog">Tambah Pasien</el-button>
            </template>
        </TitleDashboard>
        <div id="stickyElement" class="bg-white w-full sticky -top-3 z-10">
            <SearchAndPagination2 :row-total="rowTotal" :page-size="pageSize" :page-index="pageIndex" @change-page="changePage" @search="onSearch" @paginate="onPaginate" />
        </div>
        <div class="py-5">
            <el-table :data="listData" v-loading="loading" stripe border style="width: 100%">
                <el-table-column type="index" label="No" width="50" />
                <el-table-column prop="record_no" label="No. Rekam Medis" />
                <el-table-column prop="fullname" label="Nama Pasien" />
                <el-table-column prop="gender" label="Jenis Kelamin" width="90" />
                <el-table-column prop="no_ktp" label="No. KTP" />
                <el-table-column prop="phone" label="No. HP" />
                <el-table-column prop="nama_keluarga" label="Nama Keluarga" />
                <el-table-column prop="birthday" label="Lahir">
                    <template #default="scope">
                        {{ scope.row.birthday }} ({{ scope.row.age }} thn)
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="Address" />
                <el-table-column prop="created_at" label="Dibuat">
                    <template #default="scope">
                        {{ convertDate(scope.row.created_at) }}
                    </template>
                </el-table-column>
                <!-- Untuk kolom aksi -->
                <TableColumnAction show-edit show-delete @click-edit="onEditDialog" @click-delete="onDeleteData" />
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
                <el-form-item label="No. Rekam Medis" prop="record_no">
                    <el-input v-model="addData.record_no" placeholder="No. Rekam Medis" style="width: 100%" />
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
                    <el-date-picker v-model="addData.birthday" type="date" format="YYYY" value-format="YYYY-MM-DD" placeholder="Pilih Tanggal" />
                </el-form-item>
                <el-form-item label="Umur" prop="age">
                    <el-input-number :min="1" v-model="addData.age" placeholder="Umur" />
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
                <el-form-item label="No. Rekam Medis" prop="record_no">
                    <el-input v-model="editData.record_no" placeholder="No. Rekam Medis" style="width: 100%" />
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
                    <el-date-picker v-model="editData.birthday" type="date" format="YYYY" value-format="YYYY-MM-DD" placeholder="Pilih Tanggal" />
                </el-form-item>
                <el-form-item label="Umur" prop="age">
                    <el-input-number :min="1" v-model="editData.age" placeholder="Umur" />
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
            </div>
        </el-form>
        <template #footer>
            <FooterButtonDialog @save-click="onSaveEdit" @cancel-click="cancelEdit" />
        </template>
    </el-dialog>
</template>

<script setup>
import { deletePasien, listPasienPagination, tambahPasien, updatePasien } from '../../api/pasienApi';
import useAddData from '../../composables/useAddData';
import useDeleteData from '../../composables/useDeleteData';
import useEditData from '../../composables/useEditData';
import usePagination from '../../composables/usePagination';
import { convertDate, dialogWidth, labelPosition } from '../../helpers/utils';
import { patientRule } from '../../rules/patientRules';

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
const { editData, editForm, editDialog, openEditDialog, saveEdit, cancelEdit } = useEditData();
const { deleteData } = useDeleteData();

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
    openEditDialog(row);
}

function onDeleteData({ id = 0 }) {
    deleteData(deletePasien, id, () => doPaginate(1));
}

function onSaveAdd() {
    saveAdd(tambahPasien, () => doPaginate(1));
}

function onSaveEdit() {
    saveEdit(updatePasien, 'id', () => doPaginate(1));
}

doPaginate(pageIndex.value);
</script>