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
                        <el-button type="info" v-if="editHeaderData.status == 'NEW'">COMMITTED</el-button>
                    </template>
                </el-popconfirm>
                <el-button v-if="profile.role === 'admin' && editHeaderData.status == 'COMMITED'" type="danger" @click="openCancelDialog">CANCEL</el-button>
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
                <div class="grid grid-cols-1 lg:grid-cols-3
                    gap-3">
                    <el-form-item label="Dibuat Oleh" prop="created_by" class="w-full">
                        <el-input disabled v-model="editHeaderData.created_by" placeholder="Dibuat Oleh" style="width: 100%" />
                    </el-form-item>
                    <el-form-item label="Tanggal Dibuat" prop="created_at" class="w-full">
                        <el-input disabled :value="dateFormatFull(editHeaderData.created_at)" placeholder="Tanggal Dibuat" style="width: 100%" />
                    </el-form-item>
                    <el-form-item label="Terakhir Diubah" prop="updated_at" class="w-full">
                        <el-input disabled :value="dateFormatFull(editHeaderData.updated_at)" placeholder="Terakhir Diubat" style="width: 100%" />
                    </el-form-item>
                </div>
            </div>
        </el-form>

        <!-- List Products -->
        <div class="block border-b md:flex justify-between my-2 pb-2.5 text-center space-y-2">
            <h1 class="capitalize">Daftar Produk</h1>
            <div class="flex items-center">
                <el-button type="info" @click="onDownloadReportDetail">Download Produk Masuk</el-button>
                <el-button v-if="editHeaderData.status === 'NEW'" :type="isAddDataLineForm ? 'danger' : 'primary'" @click="openAddProductLine">
                    {{ isAddDataLineForm ? 'Batal' : 'Tambah Produk' }}
                </el-button>
            </div>
        </div>
        <el-collapse-transition>
            <div v-show="isAddDataLineForm" class="border-b py-3">
                <el-form label-width="150px" label-position="top" class="space-x-10" :model="addData" ref="addForm" :rules="addProductStockEntryRule">
                    <div class="w-full flex items-center gap-x-3">
                        <el-form-item label="Produk" prop="product_id" class="w-full">
                            <ElProductSelect @handle-change="onProductChange" class="w-full" v-model="addData.product_id" />
                        </el-form-item>
                        <el-form-item label="Satuan" prop="product_unit_id">
                            <el-select v-model="addData.product_unit_id" placeholder="Satuan" class="min-w-28">
                                <el-option v-for="item in unitListProducts" :key="item.id" :label="item.name" :value="item.pivot.id" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="QTY" prop="quantity" style="width: 70px">
                            <el-input type="number" v-model="addData.quantity" placeholder="QTY" style="width: 70px" />
                        </el-form-item>
                        <el-form-item label="Harga Beli" prop="buy_price" style="width: 350px">
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
                <el-table-column label="No" min-width="50">
                    <template #default="scope">
                        {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="product.name" label="Produk" min-width="170" /> -->
                <el-table-column prop="product.name" label="Produk" min-width="170">
                    <template #default="{ row }">
                        <div v-if="row.buy_price_diff && row.last_sell_price == row.product_unit?.new_price || row.product.sell_price"
                            class="bg-orange-400 text-white p-0.5 rounded text-center text-xs">Harga beli berbeda</div>
                        <p>{{ row.product.name }}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="product.sku" label="SKU" />
                <el-table-column prop="name" label="Satuan">
                    <template #default="scope">
                        {{ scope.row.product_unit?.unit?.name || '-' }}
                    </template>
                </el-table-column>
                <el-table-column label="Harga Jual" align="center">
                    <template #header>
                        <span style="font-weight: bold;">Harga Jual</span>
                    </template>
                    <el-table-column label="Sebelumnya" min-width="110">
                        <template #default="scope">
                            {{ convertRp(scope.row.last_sell_price) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Sekarang" min-width="110">
                        <template #default="scope">
                            {{ convertRp(scope.row?.product_unit?.new_price || scope.row?.product?.sell_price || 0) }}
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="Harga Beli" align="center">
                    <template #header>
                        <span style="font-weight: bold;">Harga Beli</span>
                    </template>
                    <el-table-column prop="buy_price" label="Sebelumnya" min-width="110">
                        <template #default="scope">
                            {{ convertRp(scope.row.last_buy_price) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="buy_price" label="Sekarang" min-width="110">
                        <template #default="scope">
                            {{ convertRp(scope.row.buy_price) }}
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column prop="quantity" label="QTY" />
                <el-table-column prop="buy_price" label="Total" min-width="100">
                    <template #default="scope">
                        {{ convertRp(scope.row.buy_price * scope.row.quantity) }}
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

    <!-- Cancel Stock Reason -->
    <el-dialog v-model="cancelDialog" :width="dialogWidth()" top="5vh">
        <template #header>
            <h1 class="border-b pb-5">Batalkan Stok Masuk</h1>
        </template>
        <el-form label-width="150px" :label-position="labelPosition()" class="space-x-10" :model="cancelData" ref="cancelForm">
            <div class="w-full">
                <el-form-item :rules="[{ required: true, message: 'Catatan tidak boleh kosong', trigger: ['blur', 'change'] }]" label="Catatan" prop="note">
                    <el-input type="textarea" show-word-limit maxlength="255" rows="3" v-model="cancelData.note" placeholder="Catatan" style="width: 100%" />
                </el-form-item>
            </div>
        </el-form>
        <template #footer>
            <FooterButtonDialog @save-click="onSubmitCancel" @cancel-click="cancelStock" />
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
import { APIdeleteStockEntryLine, APIStockEntryCanceled, APIStockEntryCommitted, APIStockEntryDetail, APIstoreStockEntryLine, APIupdateStockEntry, APIupdateStockEntryLine, stockEntryLinePagination } from '../../api/stockApi';
import { addProductStockEntryRule, stockEntryHeaderRule, updateProductStockEntryRule } from '../../rules/stockRules';
import { convertDate, convertRp, dateFormatFull, dialogWidth, labelPosition, messageInfo } from '../../helpers/utils';
import { catchError } from '../../helpers/catchResp';
import { computed, ref } from 'vue';
import useGetData from '../../composables/useGetData';
import { APIProductSelect } from '../../api/apiInventory';
import ElCurrencyInput from '../../components/ElCurrencyInput.vue';
import { ElMessageBox } from 'element-plus';
import { useAppStore } from '../../store/appStore';
import useDownloadFile from '../../composables/useDownloadFile';

const appStore = useAppStore();
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
const [cancelData, cancelForm, cancelDialog, openCancelDialog, saveCancel, cancelStock] = useEditData({
    returnAsArray: true,
});
const { downloadBlobFile } = useDownloadFile();

const isAddDataLineForm = ref(false);
const unitListProducts = ref([]);
const profile = computed(() => appStore.profile);

// UNTUK HEADER STOCK
function onSaveHeader() {
    saveEditHeader(APIupdateStockEntry, 'id', () => doPaginate(1));
}

// UNTUK COMMMIT
function onCommittedStockEntry() {
    catchError(async () => {
        const data = await APIStockEntryCommitted(route.params.id);
        if (data.status == 200) {
            messageInfo("Berhasil COMMIT Stok Masuk", "success");
            router.push('/stock-entry')
        }
    });
}

function onSubmitCancel() {
    ElMessageBox.confirm(
        'Semua produk yang diinput di sini akan dikembalikan stoknya, apakah yakin?',
        'Perhatian',
        {
            confirmButtonText: 'Yakin',
            cancelButtonText: 'Batal',
            type: 'warning',
        }
    )
        .then(() => {
            cancelData.value.id = route.params.id;
            saveCancel(APIStockEntryCanceled, 'id', () => {
                router.push('/stock/stock-entry');
            });
        })
        .catch(() => {
        })
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
    saveAdd(() => APIstoreStockEntryLine(editHeaderData.value.id, addData.value), () => {
        doPaginate(pageIndex.value);
        unitListProducts.value = [];
    });
}

function onSaveEdit() {
    saveEdit(() => APIupdateStockEntryLine(editHeaderData.value.id, editData.value.id, editData.value), 'id', () => doPaginate(1));
}

function openAddProductLine() {
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

function onProductChange(data) {
    addData.value.product_unit_id = null;
    delete addData.value.product_unit_id;
    unitListProducts.value = data?.units || [];
}

function onDownloadReportDetail() {
    downloadBlobFile(APIGetStockInDetail, route.params.id)
}

doPaginate(pageIndex.value);
firstLoad();
</script>