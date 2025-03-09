<template>
    <section>
        <TitleDashboard title="Daftar Obat">
            <template #btn1>
                <el-button type="primary" @click="openAddDialog" :icon="Plus">Tambah Obat</el-button>
            </template>
        </TitleDashboard>
        <div id="stickyElement" class="bg-white w-full sticky -top-3 z-10">
            <SearchAndPagination2 :row-total="rowTotal" :page-size="pageSize" :page-index="pageIndex" @change-page="changePage" @search="onSearch" @paginate="onPaginate" />
        </div>
        <ProductList :medicines="listData" @edit-data="onEditDialog" />
    </section>

    <!-- FORM ADD DIALOG -->
    <el-dialog v-model="addDialog" :width="dialogWidth()" top="5vh">
        <template #header>
            <h1 class="border-b pb-5">Tambah Obat</h1>
        </template>
        <el-form label-width="150px" :label-position="labelPosition()" class="space-x-10" :model="addData" :rules="medicinesRule" ref="addForm">
            <div class="w-full">
                <el-form-item label="Nama Obat" prop="name">
                    <el-input v-model="addData.name" placeholder="Nama Obat" style="width: 100%" />
                </el-form-item>
                <el-form-item label="SKU" prop="sku">
                    <el-input v-model="addData.sku" placeholder="SKU" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Stok Dasar" prop="stock">
                    <el-input v-model="addData.stock" type="number" placeholder="Stok Dasar" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Harga Beli Dasar" prop="buy_price">
                    <ElCurrencyInput v-model="addData.buy_price" placeholder="Harga Beli" style="width: 100%" />
                </el-form-item>
                <!-- Multi Satuan -->
                <el-form-item label="Satuan" prop="unit_id">
                    <template v-for="(unit, index) in addData.units" :key="index">
                        <div class="border p-4 rounded-lg space-y-4 bg-slate-50 mb-2">
                            <div class="flex justify-between items-center" v-if="unit.is_base">
                                <h4 class="font-medium">Satuan Dasar</h4>
                                <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                    Base Unit
                                </span>
                            </div>
                            <div class="flex justify-end items-center" v-if="index > 0">
                                <button type="button" @click="removeUnit(index)" class="text-red-500 hover:text-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <el-form-item class="space-y-2">
                                    <label class="block text-sm font-medium text-gray-700">Satuan</label>
                                    <el-select v-model="unit.unit_id" placeholder="Pilih Satuan" filterable clearable style="width: 100%" @change="onChangeUnit(unit)">
                                        <el-option v-for="item in unitList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item class="space-y-2">
                                    <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
                                    <el-input type="text" v-model="unit.description"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        placeholder="Contoh: 10 Tablet/Strip" />
                                </el-form-item>
                                <el-form-item class="space-y-2">
                                    <label class="block text-sm font-medium text-gray-700">Harga Jual</label>
                                    <ElCurrencyInput v-model="unit.sell_price"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                                </el-form-item>
                                <el-form-item class="space-y-2">
                                    <label class="block text-sm font-medium text-gray-700">Harga Jual Baru</label>
                                    <ElCurrencyInput v-model="unit.new_price"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                                </el-form-item>
                                <el-form-item class="space-y-2" v-if="!unit.is_base">
                                    <label class="block text-sm font-medium text-gray-700">Konversi Ke Satuan Dasar</label>
                                    <el-input type="text" v-model="unit.conversion_to_base"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" placeholder="Contoh: 10" />
                                </el-form-item>
                            </div>
                        </div>
                    </template>
                    <button type="button" @click="addNewUnit"
                        class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                        </svg>
                        Tambah Satuan
                    </button>
                </el-form-item>
                <el-form-item label="Kategori" prop="category_id">
                    <el-select v-model="addData.category_id" placeholder="Pilih Kategori" filterable clearable style="width: 100%">
                        <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Grup" prop="group_id">
                    <el-select v-model="addData.group_id" placeholder="Pilih Grup" filterable clearable style="width: 100%">
                        <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Tipe" prop="type">
                    <el-input v-model="addData.type" placeholder="Tipe" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Efel Samping" prop="side_effect">
                    <el-input v-model="addData.side_effect" placeholder="Efel Samping" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Dosis" prop="dosage">
                    <el-input v-model="addData.dosage" placeholder="Dosis" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Indikasi" prop="indication">
                    <el-input v-model="addData.indication" placeholder="Indikasi" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Deskripsi" prop="description">
                    <el-input type="textarea" show-word-limit maxlength="255" rows="3" v-model="addData.description" placeholder="Deskripsi" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Gambar" prop="image">
                    <div class="flex flex-col items-start justify-start">
                        <div class="flex flex-col gap-2 relative" v-if="previewImage">
                            <el-image class="h-36 object-cover rounded" :preview-src-list="[previewImage]" :src="previewImage" alt="Preview" />
                            <div class="flex items-center">
                                <h1 class="text-red-700 p-2 cursor-pointer" @click="previewImage = null">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                    Remove
                                </h1>
                            </div>
                        </div>
                        <div v-else class="flex items-center justify-center w-full">
                            <label for="dropzone-file"
                                class="flex flex-col items-center justify-center w-full h-22 border-2 border-gray-300 border-dashed hover:border-blue-600 transition-all duration-300 rounded-lg cursor-pointer bg-gray-50">
                                <div class="flex flex-col items-center justify-center py-2">
                                    <el-icon size="30">
                                        <UploadFilled class="text-gray-500 mb-2" />
                                    </el-icon>
                                    <p class="mb-2 text-sm text-gray-500">
                                        <span class="font-semibold">Click to upload</span>
                                    </p>
                                    <p class="text-xs text-gray-500">PNG, JPG or JPEG</p>
                                </div>
                                <input id="dropzone-file" @input="inputImage" type="file" class="hidden" accept="image/*" />
                            </label>
                        </div>
                        <div class="text-sm text-gray-500 block">Rekomendasi ukuran gambar 500x500 atau Kotak.</div>
                    </div>
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
            <h1 class="border-b pb-5">Edit Produk</h1>
        </template>
        <el-form label-width="150px" :label-position="labelPosition()" class="space-x-10" :model="editData" :rules="categoriesRule" ref="editForm">
            <div class="w-full">
                <el-form-item label="Nama Kategori" prop="name">
                    <el-input v-model="editData.name" placeholder="Nama Kategori" style="width: 100%" />
                </el-form-item>
                <el-form-item label="SKU" prop="sku">
                    <el-input v-model="editData.sku" placeholder="SKU" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Stok Dasar" prop="stock">
                    <el-input v-model="editData.stock" type="number" disabled readonly placeholder="Stok Dasar" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Harga Beli Dasar" prop="buy_price">
                    <ElCurrencyInput v-model="editData.buy_price" placeholder="Harga Beli" style="width: 100%" />
                </el-form-item>
                <!-- Multi Satuan -->
                <el-form-item label="Satuan" prop="unit_id">
                    <template v-for="(unit, index) in editData.units" :key="index">
                        <div class="border p-4 rounded-lg space-y-4 bg-slate-50 mb-2">
                            <div class="flex justify-between items-center" v-if="unit.is_base">
                                <h4 class="font-medium">Satuan Dasar</h4>
                                <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                    Base Unit
                                </span>
                            </div>
                            <div class="flex justify-end items-center" v-if="index > 0">
                                <button type="button" @click="removeEditUnit(index)" class="text-red-500 hover:text-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <el-form-item class="space-y-2">
                                    <label class="block text-sm font-medium text-gray-700">Satuan</label>
                                    <el-select v-model="unit.unit_id" placeholder="Pilih Satuan" filterable clearable style="width: 100%" @change="onChangeUnit(unit)">
                                        <el-option v-for="item in unitList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item class="space-y-2">
                                    <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
                                    <el-input type="text" v-model="unit.description"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        placeholder="Contoh: 10 Tablet/Strip" />
                                </el-form-item>
                                <el-form-item class="space-y-2">
                                    <label class="block text-sm font-medium text-gray-700">Harga Jual</label>
                                    <ElCurrencyInput v-model="unit.sell_price"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                                </el-form-item>
                                <el-form-item class="space-y-2">
                                    <label class="block text-sm font-medium text-gray-700">Harga Jual Baru</label>
                                    <ElCurrencyInput v-model="unit.new_price"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                                </el-form-item>
                                <el-form-item class="space-y-2" v-if="!unit.is_base">
                                    <label class="block text-sm font-medium text-gray-700">Konversi Ke Satuan Dasar</label>
                                    <el-input type="text" v-model="unit.conversion_to_base"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" placeholder="Contoh: 10" />
                                </el-form-item>
                            </div>
                        </div>
                    </template>
                    <button type="button" @click="addEditUnit"
                        class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                        </svg>
                        Tambah Satuan
                    </button>
                </el-form-item>
                <el-form-item label="Kategori" prop="category_id">
                    <el-select v-model="editData.category_id" placeholder="Pilih Kategori" filterable clearable style="width: 100%">
                        <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Grup" prop="group_id">
                    <el-select v-model="editData.group_id" placeholder="Pilih Grup" filterable clearable style="width: 100%">
                        <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Tipe" prop="type">
                    <el-input v-model="editData.type" placeholder="Tipe" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Efel Samping" prop="side_effect">
                    <el-input v-model="editData.side_effect" placeholder="Efel Samping" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Dosis" prop="dosage">
                    <el-input v-model="editData.dosage" placeholder="Dosis" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Indikasi" prop="indication">
                    <el-input v-model="editData.indication" placeholder="Indikasi" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Deskripsi" prop="description">
                    <el-input type="textarea" show-word-limit maxlength="255" rows="3" v-model="editData.description" placeholder="Deskripsi" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Gambar" prop="image">
                    <div class="flex flex-col items-start justify-start">
                        <div class="flex flex-col gap-2 relative" v-if="previewImage">
                            <el-image class="h-36 object-cover rounded" :preview-src-list="[previewImage]" :src="previewImage" alt="Preview" />
                            <div class="flex items-center">
                                <h1 class="text-red-700 p-2 cursor-pointer" @click="previewImage = null">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                    Remove
                                </h1>
                            </div>
                        </div>
                        <div v-else class="flex items-center justify-center w-full">
                            <label for="dropzone-file"
                                class="flex flex-col items-center justify-center w-full h-22 border-2 border-gray-300 border-dashed hover:border-blue-600 transition-all duration-300 rounded-lg cursor-pointer bg-gray-50">
                                <div class="flex flex-col items-center justify-center py-2">
                                    <el-icon size="30">
                                        <UploadFilled class="text-gray-500 mb-2" />
                                    </el-icon>
                                    <p class="mb-2 text-sm text-gray-500">
                                        <span class="font-semibold">Click to upload</span>
                                    </p>
                                    <p class="text-xs text-gray-500">PNG, JPG or JPEG</p>
                                </div>
                                <input id="dropzone-file" @input="(e) => inputImage(e, 'edit')" type="file" class="hidden" accept="image/*" />
                            </label>
                        </div>
                        <div class="text-sm text-gray-500 block">Rekomendasi ukuran gambar 500x500 atau Kotak.</div>
                    </div>
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
import { convertRp, dateFormatFull, dialogWidth, isOnMobileOrTablet, labelPosition, loadingScreen, messageInfo, uploadPhotosHelper } from '../../helpers/utils';
import { APIdeleteCategory, APIGetCategoriesSelect, APIGetGroupsSelect, APIGetUnitsSelect, APIstoreCategory, APIstoreMedicine, APIupdateCategory, APIupdateMedicine, listMedicinesPagination } from '../../api/apiInventory';
import { categoriesRule, medicinesRule } from '../../rules/inventoryRules';
import useDeleteData from '../../composables/useDeleteData';
import { Box, Delete, InfoFilled, Plus, PriceTag, UploadFilled, View } from '@element-plus/icons-vue';
import { ref } from 'vue';
import useGetData from '../../composables/useGetData';
import SVG from '../../helpers/svg';
import ProductList from './partials/ProductList.vue';

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
const [categoryList, getCategoryList] = useGetData();
const [unitList, getUnitList] = useGetData();
const [groupList, getGroupList] = useGetData();

const previewImage = ref(null);

function doPaginate(index, pSize) {
    getListData(listMedicinesPagination, index, pSize ? pSize : pageSize.value, search.value, filterData.value);
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
    previewImage.value = row.image;
    editData.value = JSON.parse(JSON.stringify(row));
    editData.value.stock = row.base_stock;
    // Jika ada satuan
    if (Array.isArray(editData.value.units) && editData.value.units.length) {
        editData.value.units = editData.value.units.map((unit) => ({
            ...unit,
            unit_id: unit.id,
            sell_price: unit?.pivot?.sell_price,
            new_price: unit?.pivot?.new_price,
            conversion_to_base: unit?.pivot?.conversion_to_base,
            is_base: unit?.pivot?.is_base == 1,
            description: unit?.pivot?.description,
        }));
    } else {
        editData.value.units = [
            {
                unit_id: null,
                sell_price: editData.value.sell_price,
                new_price: editData.value.sell_price,
                conversion_to_base: 1,
                is_base: true,
                description: "",
            }
        ]
    }
    getCategoryList(APIGetCategoriesSelect);
    getUnitList(APIGetUnitsSelect);
    getGroupList(APIGetGroupsSelect);
    openEditDialog(editData.value);
}

function onDeleteData({ id = 0 }) {
    deleteData(APIdeleteCategory, id, () => doPaginate(1));
}

async function onSaveAdd() {
    let loading = loadingScreen();

    if (addData.value.image) {
        // Upload gambar dulu
        const image = await uploadPhotosHelper(addData.value.image);
        if (image && image.images && image.images.length > 0) {
            addData.value.image = image.images[0].url;
        } else {
            loading.close();
            return;
        }
    }

    // Simpan data
    try {
        const response = await APIstoreMedicine(addData.value);
        if (response.status === 201) {
            messageInfo("Data berhasil disimpan", "success");
            addDialog.value = false;
            addData.value.image = null;
            previewImage.value = null;
            doPaginate(1);
        } else {
            messageInfo("Gagal menyimpan data", "error");
        }
    } catch (error) {
        console.log("validasi gagal");

        messageInfo(error.response.data.message || "Gagal menyimpan data", "error");
    } finally {
        loading.close();
    }
}

async function onSaveEdit() {
    let loading = loadingScreen();

    if (editData.value.new_image) {
        // Upload gambar dulu
        const image = await uploadPhotosHelper(editData.value.new_image);
        if (image && image.images && image.images.length > 0) {
            editData.value.image = image.images[0].url;
        } else {
            loading.close();
            return;
        }
    }

    // Simpan data
    try {
        const response = await APIupdateMedicine(editData.value.id, editData.value);
        if (response.status === 200) {
            messageInfo("Data berhasil diupdate", "success");
            editDialog.value = false;
            editData.value.image = null;
            previewImage.value = null;
            doPaginate(1);
        } else {
            messageInfo("Gagal mengupdate data", "error");
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            const messages = Object.values(error.response.data.errors)
                .flat() // Biar array di-flatten kalau ada banyak error
                .join("\n");

            messageInfo(messages, "error");
        } else {
            messageInfo(error.response.data.message || "Terjadi kesalahan.", "error");
        }
    } finally {
        loading.close();
    }
}

async function openAddDialog() {
    getCategoryList(APIGetCategoriesSelect);
    getUnitList(APIGetUnitsSelect);
    getGroupList(APIGetGroupsSelect);
    addData.value.units = [
        {
            unit_id: null,
            is_base: true,
            conversion_to_base: 1,
            sell_price: 0,
            new_price: 0,
            description: null,
            unit_name: null
        }
    ]
    openDialog(0);
}

async function inputImage(event, type = 'add') {
    const file = event.target.files[0];
    if (file) {
        const validImageTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
        ];
        if (!validImageTypes.includes(file.type)) {
            messageInfo("Tipe gambar tidak valid", "warning");
            return;
        }

        // Cek ukuran file (2 MB = 5 * 1024 * 1024 bytes)
        const maxSizeInBytes = 2 * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
            messageInfo("File terlalu besar", "warning");
            return;
        }

        const reader = new FileReader();

        if (type === 'edit') {
            editData.value.new_image = file;
        } else {
            addData.value.image = file;
        }

        reader.onload = (e) => {
            previewImage.value = e.target.result;
        };

        reader.readAsDataURL(file);
    }
}

function addNewUnit() {
    addData.value.units.push({
        unit_id: null,
        is_base: false,
        conversion_to_base: null,
        sell_price: 0,
        new_price: 0,
        description: null
    });
}

function addEditUnit() {
    editData.value.units.push({
        id: null,
        unit_id: null,
        is_base: false,
        conversion_to_base: null,
        sell_price: 0,
        new_price: 0,
        description: null,
    });
}

function removeUnit(index) {
    addData.value.units.splice(index, 1);
}

function removeEditUnit(index) {
    editData.value.units.splice(index, 1);
}

function onChangeUnit(unit) {
    if (unit.is_base) {
        addData.value.units[0].unit_name = unit.name;
        addData.value.units[0].conversion_to_base = 1;
    }
}

doPaginate(pageIndex.value);
</script>