<template>
    <section>
        <TitleDashboard title="Daftar Supplier">
            <template #btn1>
                <el-button type="primary" @click="openAddDialog">Tambah Supplier</el-button>
            </template>
        </TitleDashboard>
        <div id="stickyElement" class="bg-white w-full sticky -top-3 z-10">
            <SearchAndPagination2 :row-total="rowTotal" :page-size="pageSize" :page-index="pageIndex" @change-page="changePage" @search="onSearch" @paginate="onPaginate" />
        </div>
        <div class="py-5">
            <el-table :data="listData" v-loading="loading" stripe border style="width: 100%">
                <el-table-column type="index" label="No" min-width="50" />
                <el-table-column prop="supplier_code" label="Kode" min-width="120" />
                <el-table-column prop="supplier_name" label="Nama Supplier" min-width="180" />
                <el-table-column label="PBF" min-width="80" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.is_pbf ? 'success' : 'info'">{{ row.is_pbf ? 'Ya' : 'Tidak' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="pic_name" label="PIC" min-width="150">
                    <template #default="{ row }">
                        {{ row.pic_name || '-' }}
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="Telepon" min-width="130">
                    <template #default="{ row }">
                        {{ row.phone || '-' }}
                    </template>
                </el-table-column>
                <el-table-column label="Status" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 'aktif' ? 'success' : 'danger'">{{ row.status }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="Dibuat" min-width="120">
                    <template #default="{ row }">
                        {{ convertDate(row.created_at) }}
                    </template>
                </el-table-column>
                <TableColumnAction :show-edit="appStore.isAdmin" :show-delete="appStore.isAdmin" @click-edit="onEditDialog" @click-delete="onDeleteData" />
            </el-table>
        </div>
        <div class="flex items-center justify-center">
            <el-pagination background layout="prev, pager, next" :total="rowTotal" :page-size="pageSize" @current-change="changePage" :current-page="currentPage"
                :hide-on-single-page="false" />
        </div>
    </section>

    <el-dialog v-model="addDialog" :width="dialogWidth()" top="5vh">
        <template #header>
            <h1 class="border-b pb-5">Tambah Supplier</h1>
        </template>
        <el-form label-width="150px" :label-position="labelPosition()" class="space-x-10" :model="addData" :rules="suppliersRule" ref="addForm">
            <div class="w-full">
                <el-form-item label="Kode Supplier" prop="supplier_code">
                    <el-input v-model="addData.supplier_code" placeholder="Kode Supplier" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Nama Supplier" prop="supplier_name">
                    <el-input v-model="addData.supplier_name" placeholder="Nama Supplier" style="width: 100%" />
                </el-form-item>
                <el-form-item label="PBF" prop="is_pbf">
                    <el-radio-group v-model="addData.is_pbf">
                        <el-radio-button :label="true">Ya</el-radio-button>
                        <el-radio-button :label="false">Tidak</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="PIC" prop="pic_name">
                    <el-input v-model="addData.pic_name" placeholder="Nama PIC" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Telepon" prop="phone">
                    <el-input v-model="addData.phone" placeholder="Telepon" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Alamat" prop="address">
                    <el-input type="textarea" rows="3" v-model="addData.address" placeholder="Alamat" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Status" prop="status">
                    <el-select v-model="addData.status" placeholder="Pilih Status" style="width: 100%">
                        <el-option label="Aktif" value="aktif" />
                        <el-option label="Nonaktif" value="nonaktif" />
                    </el-select>
                </el-form-item>
            </div>
        </el-form>
        <template #footer>
            <FooterButtonDialog @save-click="onSaveAdd" @cancel-click="cancelAdd" />
        </template>
    </el-dialog>

    <el-dialog v-model="editDialog" :width="dialogWidth()" top="5vh">
        <template #header>
            <h1 class="border-b pb-5">Edit Supplier</h1>
        </template>
        <el-form label-width="150px" :label-position="labelPosition()" class="space-x-10" :model="editData" :rules="suppliersRule" ref="editForm">
            <div class="w-full">
                <el-form-item label="Kode Supplier" prop="supplier_code">
                    <el-input v-model="editData.supplier_code" placeholder="Kode Supplier" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Nama Supplier" prop="supplier_name">
                    <el-input v-model="editData.supplier_name" placeholder="Nama Supplier" style="width: 100%" />
                </el-form-item>
                <el-form-item label="PBF" prop="is_pbf">
                    <el-radio-group v-model="editData.is_pbf">
                        <el-radio-button :label="true">Ya</el-radio-button>
                        <el-radio-button :label="false">Tidak</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="PIC" prop="pic_name">
                    <el-input v-model="editData.pic_name" placeholder="Nama PIC" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Telepon" prop="phone">
                    <el-input v-model="editData.phone" placeholder="Telepon" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Alamat" prop="address">
                    <el-input type="textarea" rows="3" v-model="editData.address" placeholder="Alamat" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Status" prop="status">
                    <el-select v-model="editData.status" placeholder="Pilih Status" style="width: 100%">
                        <el-option label="Aktif" value="aktif" />
                        <el-option label="Nonaktif" value="nonaktif" />
                    </el-select>
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
import { APIdeleteSupplier, APIstoreSupplier, APIupdateSupplier, listSuppliersPagination } from '../../api/apiInventory';
import { suppliersRule } from '../../rules/inventoryRules';
import useDeleteData from '../../composables/useDeleteData';
import { useAppStore } from '../../store/appStore';

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
const appStore = useAppStore();

function doPaginate(index, pSize) {
    getListData(listSuppliersPagination, index, pSize ? pSize : pageSize.value, search.value, filterData.value);
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
    deleteData(APIdeleteSupplier, id, () => doPaginate(1));
}

function onSaveAdd() {
    saveAdd(APIstoreSupplier, () => doPaginate(1));
}

function onSaveEdit() {
    saveEdit(APIupdateSupplier, 'id', () => doPaginate(1));
}

async function openAddDialog() {
    addData.value.is_pbf = false;
    addData.value.status = 'aktif';
    openDialog(0);
}

doPaginate(pageIndex.value);
</script>
