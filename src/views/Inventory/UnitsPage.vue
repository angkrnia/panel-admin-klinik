<template>
    <section>
        <TitleDashboard title="Daftar Satuan">
            <template #btn1>
                <el-button type="primary" @click="openAddDialog">Tambah Satuan</el-button>
            </template>
        </TitleDashboard>
        <div id="stickyElement" class="bg-white w-full sticky -top-3 z-10">
            <SearchAndPagination2 :row-total="rowTotal" :page-size="pageSize" :page-index="pageIndex" @change-page="changePage" @search="onSearch" @paginate="onPaginate" />
        </div>
        <div class="py-5">
            <el-table :data="listData" v-loading="loading" stripe border style="width: 100%">
                <el-table-column type="index" label="No" min-width="50" />
                <el-table-column prop="name" label="Nama" />
                <el-table-column prop="description" label="Deskripsi" min-width="170" />
                <el-table-column prop="created_at" label="Dibuat" min-width="120">
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
            <h1 class="border-b pb-5">Tambah Satuan</h1>
        </template>
        <el-form label-width="150px" :label-position="labelPosition()" class="space-x-10" :model="addData" :rules="unitsRule" ref="addForm">
            <div class="w-full">
                <el-form-item label="Nama Satuan" prop="name">
                    <el-input v-model="addData.name" placeholder="Nama Satuan" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Deskripsi" prop="description">
                    <el-input type="textarea" show-word-limit maxlength="255" rows="3" v-model="addData.description" placeholder="Deskripsi" style="width: 100%" />
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
            <h1 class="border-b pb-5">Edit Satuan</h1>
        </template>
        <el-form label-width="150px" :label-position="labelPosition()" class="space-x-10" :model="editData" :rules="unitsRule" ref="editForm">
            <div class="w-full">
                <el-form-item label="Nama Satuan" prop="name">
                    <el-input v-model="editData.name" placeholder="Nama Satuan" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Deskripsi" prop="description">
                    <el-input type="textarea" show-word-limit maxlength="255" rows="3" v-model="editData.description" placeholder="Deskripsi" style="width: 100%" />
                </el-form-item>
            </div>
        </el-form>
        <template #footer>
            <FooterButtonDialog @save-click="onSaveEdit" @cancel-click="cancelEdit" />
        </template>
    </el-dialog>
</template>

<script setup>
import useAddData from '../../composables/useAddData';
import useEditData from '../../composables/useEditData';
import usePagination from '../../composables/usePagination';
import { convertDate, dialogWidth, labelPosition } from '../../helpers/utils';
import { APIdeleteUnit, APIstoreUnit, APIupdateUnit, listUnitsPagination } from '../../api/apiInventory';
import { unitsRule } from '../../rules/inventoryRules';
import useDeleteData from '../../composables/useDeleteData';

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
    getListData(listUnitsPagination, index, pSize ? pSize : pageSize.value, search.value, filterData.value);
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
    deleteData(APIdeleteUnit, id, () => doPaginate(1));
}

function onSaveAdd() {
    saveAdd(APIstoreUnit, () => doPaginate(1));
}

function onSaveEdit() {
    saveEdit(APIupdateUnit, 'id', () => doPaginate(1));
}

async function openAddDialog() {
    openDialog(0);
}

doPaginate(pageIndex.value);
</script>