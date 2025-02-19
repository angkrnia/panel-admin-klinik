<template>
    <section>
        <div class="block border-b md:flex justify-between my-2 pb-2.5 text-center space-y-2">
            <div class="flex items-center">
                <button class="mr-2" @click="onBack">
                    <div v-html="backArrow" class="size-7"></div>
                </button>
                <h1 class="capitalize">Detail Produk Stok Masuk</h1>
            </div>
            <!-- Button save -->
            <div class="flex items-center justify-end">
                <el-button type="warning" @click="editHeaderDialog = true" v-if="!editHeaderDialog && editHeaderData.status === 'NEW'">Edit Header</el-button>
                <el-button type="danger" @click="editHeaderDialog = false" v-if="editHeaderDialog && editHeaderData.status === 'NEW'">Batal</el-button>
                <el-button type="primary" @click="onSaveHeader" v-if="editHeaderDialog && editHeaderData.status === 'NEW'">Simpan Header</el-button>
                <el-popconfirm title="Apakah data sudah sesuai? Setelah di COMMIT, data tidak dapat diubah dan stok akan langsung bertambah" @confirm="onCommittedStockEntry">
                    <template #reference>
                        <el-button type="info" v-if="editHeaderData.status !== 'COMMITED'">COMMITTED</el-button>
                    </template>
                </el-popconfirm>
            </div>
        </div>

        <!-- List Header -->
        <el-form label-width="140px" label-position="top" class="space-x-10" :model="editHeaderData" ref="editHeaderForm" :rules="stockEntryHeaderRule">
            <div class="">
                <el-form-item label="Status" prop="status">
                    <el-input v-model="editHeaderData.status" placeholder="Status" style="width: 100%" disabled></el-input>
                </el-form-item>
                <el-form-item label="Asal" prop="source">
                    <el-input v-model="editHeaderData.source" placeholder="Asal" style="width: 100%" :disabled="!editHeaderDialog" />
                </el-form-item>
                <el-form-item label="Catatan" prop="note">
                    <el-input type="textarea" show-word-limit maxlength="255" rows="3" v-model="editHeaderData.note" placeholder="Catatan" style="width: 100%"
                        :disabled="!editHeaderDialog" />
                </el-form-item>
            </div>
        </el-form>

        <!-- List Products -->
        <div class="block border-b md:flex justify-between my-2 pb-2.5 text-center space-y-2">
            <h1 class="capitalize">Daftar Produk</h1>
            <el-button v-if="editHeaderData.status === 'NEW'" :type="isAddDataLineForm ? 'danger' : 'primary'" @click="openAddProductLine">
                {{ isAddDataLineForm ? 'Batal' : 'Tambah Produk' }}
            </el-button>
        </div>
        <el-collapse-transition>
            <div v-show="isAddDataLineForm" class="border-b py-3">
                <el-form label-width="150px" label-position="top" class="space-x-10" :model="addData" ref="addForm" :rules="addProductStockEntryRule">
                    <div class="w-full flex items-center gap-x-3">
                        <el-form-item label="Produk" prop="product_id" class="w-full">
                            <!-- <ElProductSelect class="w-full" v-model="addData.product_id" /> -->
                            <el-select v-model="addData.product_id" filterable class="w-full" placeholder="Pilih atau Cari Obat">
                                <el-option v-for="item in productList" :key="item.id" :label="`${item.name} (stok: ${item.base_stock})`" :value="item.id" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="QTY" prop="quantity" class="w-full">
                            <el-input type="number" v-model="addData.quantity" placeholder="QTY" style="width: 100%" />
                        </el-form-item>
                        <el-form-item label="Harga Beli" prop="buy_price" class="w-full">
                            <ElCurrencyInput v-model="addData.buy_price" :min="0" />
                        </el-form-item>
                        <el-form-item label="Catatan" prop="note" class="w-full">
                            <el-input type="textarea" v-model="addData.note" placeholder="Catatan" style="width: 100%" />
                        </el-form-item>
                    </div>
                </el-form>
                <div class="w-full flex justify-end">
                    <el-button class="flex justify-end" type="primary" @click="onSaveAdd">Simpan</el-button>
                </div>
            </div>
        </el-collapse-transition>

        <div id="stickyElement" class="bg-white w-full sticky -top-3 z-10">
            <SearchAndPagination2 :row-total="rowTotal" :page-size="pageSize" :page-index="pageIndex" @change-page="changePage" @search="onSearch" @paginate="onPaginate" />
        </div>
        <div class="py-5">
            <el-table :data="listData" v-loading="loading" stripe border style="width: 100%">
                <el-table-column type="index" label="No" min-width="50" />
                <el-table-column prop="product.name" label="Produk" />
                <el-table-column prop="product.sku" label="SKU" />
                <el-table-column prop="quantity" label="QTY" />
                <el-table-column prop="buy_price" label="Harga Beli">
                    <template #default="scope">
                        {{ convertRp(scope.row.buy_price) }}
                    </template>
                </el-table-column>
                <el-table-column prop="note" label="Catatan" min-width="170">
                    <template #default="scope">
                        <p class="line-clamp-1">{{ scope.row.note || '-' }}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="Dibuat" min-width="120">
                    <template #default="scope">
                        {{ convertDate(scope.row.created_at) }} ({{ scope.row.created_by }})
                    </template>
                </el-table-column>
                <el-table-column prop="updated_at" label="Diubah" min-width="120">
                    <template #default="scope">
                        {{ convertDate(scope.row.updated_at) }} {{ scope.row.updated_by ? `(${scope.row.updated_by})` : '-' }}
                    </template>
                </el-table-column>
                <!-- Untuk kolom aksi -->
                <TableColumnAction :show-edit="editHeaderData.status === 'NEW'" :show-delete="editHeaderData.status === 'NEW'" @click-edit="onEditDialog"
                    @click-delete="onDeleteData" />
            </el-table>
        </div>
        <div class="flex items-center justify-center">
            <el-pagination background layout="prev, pager, next" :total="rowTotal" :page-size="pageSize" @current-change="changePage" :current-page="currentPage"
                :hide-on-single-page="false" />
        </div>
    </section>

    <!-- FORM EDIT DIALOG -->
    <el-dialog v-model="editDialog" :width="dialogWidth()" top="5vh">
        <template #header>
            <h1 class="border-b pb-5">Edit Produk</h1>
        </template>
        <el-form label-width="150px" :label-position="labelPosition()" class="space-x-10" :model="editData" :rules="updateProductStockEntryRule" ref="editForm">
            <div class="w-full">
                <el-form-item label="Quantity" prop="quantity">
                    <el-input v-model="editData.quantity" placeholder="Quantity" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Harga Beli" prop="buy_price">
                    <ElCurrencyInput v-model="editData.buy_price" :min="0" />
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
import { useRoute, useRouter } from 'vue-router';
import usePagination from '../../composables/usePagination';
import { backArrow } from '../../helpers/svg';
import useAddData from '../../composables/useAddData';
import useEditData from '../../composables/useEditData';
import useDeleteData from '../../composables/useDeleteData';
import { APIdeleteStockEntryLine, APIStockEntryCommitted, APIStockEntryDetail, APIstoreStockEntryLine, APIupdateStockEntry, APIupdateStockEntryLine, stockEntryLinePagination } from '../../api/stockApi';
import { addProductStockEntryRule, stockEntryHeaderRule, updateProductStockEntryRule } from '../../rules/stockRules';
import { convertDate, convertRp, dialogWidth, labelPosition, messageInfo } from '../../helpers/utils';
import { catchError } from '../../helpers/catchResp';
import { ref } from 'vue';
import useGetData from '../../composables/useGetData';
import { APIProductSelect } from '../../api/apiInventory';
import ElCurrencyInput from '../../components/ElCurrencyInput.vue';

const router = useRouter();
const route = useRoute();
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
const [editHeaderData, editHeaderForm, editHeaderDialog, openEditHeaderDialog, saveEditHeader] = useEditData({
    returnAsArray: true,
});
const { deleteData } = useDeleteData();
const [productList, getProductList] = useGetData();

const isAddDataLineForm = ref(false);

// UNTUK HEADER STOCK
function onSaveHeader() {
    saveEditHeader(APIupdateStockEntry, 'id', () => doPaginate(1));
}

// UNTUK COMMMIT
function onCommittedStockEntry() {
    catchError(async () => {
        const data = await APIStockEntryCommitted(route.params.id);
        if (data.status == 200) {
            messageInfo("Berhasil COMMIT STOCK MASUK", "success");
            doPaginate(1);
            firstLoad();
        }
    });
}

// START: UNTUK LINE STOCK
function doPaginate(index, pSize) {
    filterData.value.headerId = route.params.id;
    getListData(stockEntryLinePagination, index, pSize ? pSize : pageSize.value, search.value, filterData.value);
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
    deleteData(() => APIdeleteStockEntryLine(editHeaderData.value.id, id), id, () => doPaginate(1));
}

function onSaveAdd() {
    saveAdd(() => APIstoreStockEntryLine(editHeaderData.value.id, addData.value), (data) => {
        doPaginate(pageIndex.value);
    });
}

function onSaveEdit() {
    saveEdit(() => APIupdateStockEntryLine(editHeaderData.value.id, editData.value.id, editData.value), 'id', () => doPaginate(1));
}

function openAddProductLine() {
    getProductList(APIProductSelect);
    isAddDataLineForm.value = !isAddDataLineForm.value
}
// END: UNTUK LINE STOCK

function onBack() {
    router.push({ name: 'stock-entry' })
}

function firstLoad() {
    catchError(async () => {
        const { status, data } = await APIStockEntryDetail(route.params.id);
        if (status == 200) {
            editHeaderData.value = data.data;
        }
    });
}

doPaginate(pageIndex.value);
firstLoad();
</script>