<template>
    <section>
        <TitleDashboard title="Daftar Stok Opname">
            <template #btn1>
                <el-button type="primary" @click="openAddDialog">Tambah</el-button>
            </template>
        </TitleDashboard>
        <div id="stickyElement" class="bg-white w-full sticky -top-3 z-10">
            <SearchAndPagination2 :row-total="rowTotal" :page-size="pageSize" :page-index="pageIndex" @change-page="changePage" @search="onSearch" @paginate="onPaginate" />
        </div>
        <div class="py-5">
            <el-table :data="listData" v-loading="loading" stripe border style="width: 100%">
                <el-table-column type="index" label="No" min-width="50" />
                <el-table-column prop="code" label="Kode Opname" />
                <el-table-column prop="pic" label="PIC" />
                <el-table-column prop="note" label="Catatan" min-width="170">
                    <template #default="scope">
                        <p class="line-clamp-1">{{ scope.row.note || '-' }}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="Status" />
                <el-table-column prop="created_at" label="Dibuat" min-width="120">
                    <template #default="scope">
                        {{ convertDate(scope.row.created_at) }}
                    </template>
                </el-table-column>
                <!-- Untuk kolom aksi -->
                <TableColumnAction show-edit show-delete show-view @click-view="onDetailStock" @click-edit="onEditDialog" @click-delete="onDeleteData" />
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
            <h1 class="border-b pb-5">Tambah Stock Opname</h1>
        </template>
        <el-form label-width="150px" :label-position="labelPosition()" class="space-x-10" :model="addData" :rules="stockOpnameHeaderRule" ref="addForm">
            <div class="w-full">
                <el-form-item label="Kode Opname" prop="code">
                    <el-input v-model="addData.code" placeholder="Kode Opname" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Penanggung Jawab" prop="pic">
                    <el-input v-model="addData.pic" placeholder="Penanggung Jawab" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Catatan" prop="note">
                    <el-input type="textarea" show-word-limit maxlength="255" rows="3" v-model="addData.note" placeholder="Catatan" style="width: 100%" />
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
            <h1 class="border-b pb-5">Edit Stok Masuk</h1>
        </template>
        <el-form label-width="150px" :label-position="labelPosition()" class="space-x-10" :model="editData" :rules="stockOpnameHeaderRule" ref="editForm">
            <div class="w-full">
                <el-form-item label="Asal" prop="source">
                    <el-input v-model="editData.source" placeholder="Asal" style="width: 100%" />
                    <div class="flex items-center gap-2 mt-2">
                        <el-tag type="success" size="small" class="cursor-pointer" @click="renderTemplate(editData, 'Pembelian')">Pembelian</el-tag>
                        <el-tag type="success" size="small" class="cursor-pointer" @click="renderTemplate(editData, 'Transfer Gudang')">Transfer
                            Gudang</el-tag>
                    </div>
                </el-form-item>
                <el-form-item label="Catatan" prop="note">
                    <el-input type="textarea" show-word-limit maxlength="255" rows="3" v-model="editData.note" placeholder="Catatan" style="width: 100%" />
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
import useDeleteData from '../../composables/useDeleteData';
import { APIdeleteStockOpname, APIstoreStockOpname, APIupdateStockOpname, stockOpnameHeaderPagination } from '../../api/stockApi';
import { stockOpnameHeaderRule } from '../../rules/stockRules';
import { useRouter } from 'vue-router';

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

const router = useRouter();

function doPaginate(index, pSize) {
    getListData(stockOpnameHeaderPagination, index, pSize ? pSize : pageSize.value, search.value, filterData.value);
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
    deleteData(APIdeleteStockOpname, id, () => doPaginate(1));
}

function onSaveAdd() {
    saveAdd(APIstoreStockOpname, (data) => {
        console.log(data);
        router.push(`/stock/stock-opname/${data.id}`);
    });
}

function onSaveEdit() {
    saveEdit(APIupdateStockOpname, 'id', () => doPaginate(1));
}

async function openAddDialog() {
    openDialog(0);
}

function onDetailStock(row) {
    router.push(`/stock/stock-opname/${row.id}`);
}

function renderTemplate(remark, text) {
    remark.source = text;
}

doPaginate(pageIndex.value);
</script>