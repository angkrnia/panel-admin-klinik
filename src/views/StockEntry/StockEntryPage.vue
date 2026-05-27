<template>
    <section>
        <TitleDashboard title="Daftar Stok Masuk">
            <template #btn1>
                <el-button type="primary" @click="openAddDialog">Tambah</el-button>
            </template>
        </TitleDashboard>
        <div id="stickyElement" class="bg-white w-full sticky -top-3 z-10">
            <SearchAndPagination2 :row-total="rowTotal" :page-size="pageSize" :page-index="pageIndex" @change-page="changePage" @search="onSearch" @paginate="onPaginate">
                <el-badge :value="activeFilterCount" :hidden="activeFilterCount === 0">
                    <el-button @click="filterDialog = true">Filter</el-button>
                </el-badge>
            </SearchAndPagination2>
        </div>
        <div class="py-5">
            <el-table :data="listData" v-loading="loading" stripe border style="width: 100%">
                <el-table-column label="No" min-width="50">
                    <template #default="scope">
                        {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="source" label="Asal" min-width="150" />
                <el-table-column label="Supplier" min-width="180">
                    <template #default="{ row }">
                        {{ row.supplier?.supplier_name || '-' }}
                    </template>
                </el-table-column>
                <el-table-column prop="product_group" label="Grup Produk" min-width="150">
                    <template #default="{ row }">
                        {{ row.product_group || '-' }}
                    </template>
                </el-table-column>
                <el-table-column prop="note" label="Catatan" min-width="170">
                    <template #default="scope">
                        <p class="line-clamp-1">{{ scope.row.note || '-' }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="Ringkasan Belanja" align="center">
                    <template #header>
                        <span style="font-weight: bold;">Ringkasan Belanja</span>
                    </template>
                    <el-table-column prop="total_products" label="Jmlh Produk" />
                    <el-table-column prop="total_quantity" label="Total QTY" />
                    <el-table-column prop="total_buy_price" label="Total Belanja" min-width="120" align="right">
                        <template #default="scope">
                            {{ convertRp(scope.row.total_buy_price) }}
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column prop="status" label="Status" min-width="100">
                    <template #default="{ row }">
                        <div class="flex items-center justify-center">
                            <el-tag effect="dark" round :type="getStatusType(row.status)">
                                {{ row.status }}
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="Dibuat" min-width="120">
                    <template #default="{ row }">
                        {{ convertDate(row.created_at) }}
                    </template>
                </el-table-column>
                <!-- Untuk kolom aksi -->
                <el-table-column fixed="right" min-width="100">
                    <template #header>
                        <div class="flex gap-3 items-center justify-center">
                            <p>Aksi</p>
                        </div>
                    </template>
                    <template #default="{ row }">
                        <div class="flex items-center justify-center w-full gap-x-1.5">
                            <template v-if="row.status == 'NEW'">
                                <el-tooltip class="box-item" popper-class="custom-popper" effect="dark" content="Ubah" placement="top" :enterable="false">
                                    <button type="button" @click="onEditDialog(row)">
                                        <Edit class="w-5 h-5 text-gray-500" />
                                    </button>
                                </el-tooltip>
                                <el-popconfirm confirm-button-text="Yes" cancel-button-text="No" :icon="InfoFilled" icon-color="red" title="Apakah yakin ingin menghapus data ini?"
                                    @confirm="onDeleteData(row)" content="Hapus">
                                    <template #reference>
                                        <button type="button">
                                            <Trash2 class="w-5 h-5 text-gray-500" />
                                        </button>
                                    </template>
                                </el-popconfirm>
                            </template>
                            <el-tooltip class="box-item" popper-class="custom-popper" effect="dark" content="View" placement="top" :enterable="false">
                                <button type="button" @click="onDetailStock(row)">
                                    <ZoomIn class="w-5 h-5 text-gray-500" />
                                </button>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="flex items-center justify-center">
            <el-pagination background layout="prev, pager, next" :total="rowTotal" :page-size="pageSize" @current-change="changePage" :current-page="currentPage"
                :hide-on-single-page="false" />
        </div>
    </section>

    <el-dialog v-model="filterDialog" :width="dialogWidth()" top="8vh">
        <template #header>
            <h1 class="border-b pb-5">Filter Stok Masuk</h1>
        </template>
        <el-form label-width="120px" :label-position="labelPosition()" :model="filterData">
            <div class="w-full space-y-3">
                <el-form-item label="Tanggal">
                    <ElDateRangeInput v-model:startDate="filterData.start_date" v-model:endDate="filterData.end_date" />
                </el-form-item>
                <el-form-item label="Status">
                    <el-select v-model="filterData.status" clearable filterable placeholder="Pilih Status" class="w-full">
                        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="Supplier">
                    <el-select v-model="filterData.supplier_id" clearable filterable placeholder="Pilih Supplier" class="w-full">
                        <el-option v-for="item in supplierList" :key="item.id" :label="item.supplier_name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="Grup Produk">
                    <el-select v-model="filterData.product_group" clearable filterable placeholder="Pilih Grup Produk" class="w-full">
                        <el-option v-for="item in productGroupOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
            </div>
        </el-form>
        <template #footer>
            <el-button @click="resetFilter">Reset</el-button>
            <el-button type="primary" @click="applyFilter">Terapkan</el-button>
        </template>
    </el-dialog>

    <!-- FORM ADD DIALOG -->
    <el-dialog v-model="addDialog" :width="dialogWidth()" top="5vh">
        <template #header>
            <h1 class="border-b pb-5">Tambah Stok Masuk</h1>
        </template>
        <el-form label-width="150px" :label-position="labelPosition()" class="space-x-10" :model="addData" :rules="stockEntryHeaderRule" ref="addForm">
            <div class="w-full">
                <el-form-item label="Asal" prop="source">
                    <el-input v-model="addData.source" placeholder="Asal" style="width: 100%" />
                    <div class="flex items-center gap-2 mt-2">
                        <el-tag type="success" size="small" class="cursor-pointer" @click="renderTemplate(addData, 'Pembelian')">Pembelian</el-tag>
                        <el-tag type="success" size="small" class="cursor-pointer" @click="renderTemplate(addData, 'Transfer Gudang')">Transfer
                            Gudang</el-tag>
                    </div>
                </el-form-item>
                <el-form-item label="Supplier" prop="supplier_id">
                    <el-select v-model="addData.supplier_id" placeholder="Pilih Supplier" filterable clearable style="width: 100%">
                        <el-option v-for="item in supplierList" :key="item.id" :label="item.supplier_name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="Grup Produk" prop="product_group">
                    <div class="flex flex-wrap items-center gap-2">
                        <el-radio-group v-model="addData.product_group">
                            <el-radio-button v-for="item in productGroupOptions" :key="item" :label="item">{{ item }}</el-radio-button>
                        </el-radio-group>
                        <el-tag v-if="addData.product_group" type="info" class="cursor-pointer" @click="addData.product_group = null">Kosongkan</el-tag>
                    </div>
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
        <el-form label-width="150px" :label-position="labelPosition()" class="space-x-10" :model="editData" :rules="stockEntryHeaderRule" ref="editForm">
            <div class="w-full">
                <el-form-item label="Asal" prop="source">
                    <el-input v-model="editData.source" placeholder="Asal" style="width: 100%" />
                    <div class="flex items-center gap-2 mt-2">
                        <el-tag type="success" size="small" class="cursor-pointer" @click="renderTemplate(editData, 'Pembelian')">Pembelian</el-tag>
                        <el-tag type="success" size="small" class="cursor-pointer" @click="renderTemplate(editData, 'Transfer Gudang')">Transfer
                            Gudang</el-tag>
                    </div>
                </el-form-item>
                <el-form-item label="Supplier" prop="supplier_id">
                    <el-select v-model="editData.supplier_id" placeholder="Pilih Supplier" filterable clearable style="width: 100%">
                        <el-option v-for="item in supplierList" :key="item.id" :label="item.supplier_name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="Grup Produk" prop="product_group">
                    <div class="flex flex-wrap items-center gap-2">
                        <el-radio-group v-model="editData.product_group">
                            <el-radio-button v-for="item in productGroupOptions" :key="item" :label="item">{{ item }}</el-radio-button>
                        </el-radio-group>
                        <el-tag v-if="editData.product_group" type="info" class="cursor-pointer" @click="editData.product_group = null">Kosongkan</el-tag>
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
import { convertDate, convertRp, dialogWidth, getStatusType, labelPosition } from '../../helpers/utils';
import useDeleteData from '../../composables/useDeleteData';
import useGetData from '../../composables/useGetData';
import { APIdeleteStockEntry, APIGetSuppliersList, APIstoreStockEntry, APIupdateStockEntry, stockEntryHeaderPagination } from '../../api/stockApi';
import { stockEntryHeaderRule } from '../../rules/stockRules';
import { useRouter } from 'vue-router';
import { InfoFilled } from '@element-plus/icons-vue';
import { Edit, Trash2, ZoomIn } from 'lucide-vue-next';
import ElDateRangeInput from '../../components/ElDateRangeInput.vue';
import { computed, ref } from 'vue';

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
const [supplierList, getSupplierList] = useGetData();
const productGroupOptions = ['ALKES', 'APOTEK_MEDICINE', 'KLINIK_MEDICINE'];
const statusOptions = ['NEW', 'COMMITED', 'CANCEL'];
const filterDialog = ref(false);
const activeFilterCount = computed(() => {
    const filters = filterData.value || {};
    let count = 0;

    if (filters.start_date || filters.end_date) count += 1;

    ['status', 'supplier_id', 'product_group'].forEach((key) => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') count += 1;
    });

    return count;
});

const router = useRouter();

function doPaginate(index, pSize) {
    getListData(stockEntryHeaderPagination, index, pSize ? pSize : pageSize.value, search.value, filterData.value);
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

function onFilterSearch() {
    changeIndex(() => doPaginate(1), 1, null, filterData.value);
}

function applyFilter() {
    filterDialog.value = false;
    onFilterSearch();
}

function resetFilter() {
    filterData.value = {};
    applyFilter();
}

function onEditDialog(row) {
    getSupplierList(APIGetSuppliersList);
    openEditDialog(row);
}

function onDeleteData({ id = 0 }) {
    deleteData(APIdeleteStockEntry, id, () => doPaginate(1));
}

function onSaveAdd() {
    saveAdd(APIstoreStockEntry, (data) => {
        console.log(data);
        router.push(`/stock/stock-entry/${data.id}`);
    });
}

function onSaveEdit() {
    saveEdit(APIupdateStockEntry, 'id', () => doPaginate(1));
}

async function openAddDialog() {
    getSupplierList(APIGetSuppliersList);
    openDialog(0);
}

function onDetailStock(row) {
    router.push(`/stock/stock-entry/${row.id}`);
}

function renderTemplate(remark, text) {
    remark.source = text;
}

doPaginate(pageIndex.value);
getSupplierList(APIGetSuppliersList);
</script>
