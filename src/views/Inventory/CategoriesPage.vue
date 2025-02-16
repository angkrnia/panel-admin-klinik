<template>
    <section>
        <TitleDashboard title="Daftar Kategori">
            <template #btn1>
                <el-button type="primary" @click="openAddDialog">Tambah Kategori</el-button>
            </template>
        </TitleDashboard>
        <div id="stickyElement" class="bg-white w-full sticky -top-3 z-10">
            <SearchAndPagination2 :row-total="rowTotal" :page-size="pageSize" :page-index="pageIndex" @change-page="changePage" @search="onSearch" @paginate="onPaginate" />
        </div>
        <div class="py-5">
            <el-table :data="listData" v-loading="loading" stripe border style="width: 100%">
                <el-table-column type="index" label="No" min-width="50" />
                <el-table-column prop="name" label="Nama" />
                <el-table-column prop="image" label="Gambar" min-width="170">
                    <template #default="scope">
                        <el-image class="h-20 object-cover rounded" :src="scope.row.image" alt="Gambar"></el-image>
                    </template>
                </el-table-column>
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
            <h1 class="border-b pb-5">Tambah Kategori</h1>
        </template>
        <el-form label-width="150px" :label-position="labelPosition()" class="space-x-10" :model="addData" :rules="categoriesRule" ref="addForm">
            <div class="w-full">
                <el-form-item label="Nama Kategori" prop="name">
                    <el-input v-model="addData.name" placeholder="Nama Kategori" style="width: 100%" />
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
            <h1 class="border-b pb-5">Edit Kategori</h1>
        </template>
        <el-form label-width="150px" :label-position="labelPosition()" class="space-x-10" :model="editData" :rules="categoriesRule" ref="editForm">
            <div class="w-full">
                <el-form-item label="Nama Kategori" prop="name">
                    <el-input v-model="editData.name" placeholder="Nama Kategori" style="width: 100%" />
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
import { convertDate, dialogWidth, labelPosition, loadingScreen, messageInfo, uploadPhotosHelper } from '../../helpers/utils';
import { APIdeleteCategory, APIstoreCategory, APIupdateCategory, listCategoriesPagination } from '../../api/apiInventory';
import { categoriesRule } from '../../rules/inventoryRules';
import useDeleteData from '../../composables/useDeleteData';
import { Delete, UploadFilled } from '@element-plus/icons-vue';
import { ref } from 'vue';

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

const previewImage = ref(null);

function doPaginate(index, pSize) {
    getListData(listCategoriesPagination, index, pSize ? pSize : pageSize.value, search.value, filterData.value);
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
    editData.value.id = row.id;
    openEditDialog(row);
}

function onDeleteData({ id = 0 }) {
    deleteData(APIdeleteCategory, id, () => doPaginate(1));
}

async function onSaveAdd() {
    let loading = loadingScreen();

    // Upload gambar dulu
    const image = await uploadPhotosHelper(addData.value.image);
    if (image && image.images && image.images.length > 0) {
        addData.value.image = image.images[0].url;
    } else {
        loading.close();
        return;
    }

    // Simpan data
    try {
        const response = await APIstoreCategory(addData.value);
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
        messageInfo("Gagal menyimpan data", "error");
    } finally {
        loading.close();
    }
}

async function onSaveEdit() {
    let loading = loadingScreen();

    // Upload gambar dulu
    const image = await uploadPhotosHelper(editData.value.image);
    if (image && image.images && image.images.length > 0) {
        editData.value.image = image.images[0].url;
    } else {
        loading.close();
        return;
    }

    // Simpan data
    try {
        const response = await APIupdateCategory(editData.value.id, editData.value);
        if (response.status === 200) {
            messageInfo("Data berhasil disimpan", "success");
            editDialog.value = false;
            editData.value.image = null;
            previewImage.value = null;
            doPaginate(1);
        } else {
            messageInfo("Gagal menyimpan data", "error");
        }
    } catch (error) {
        messageInfo("Gagal menyimpan data", "error");
    } finally {
        loading.close();
    }
}

async function openAddDialog() {
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
            editData.value.image = file;
        } else {
            addData.value.image = file;
        }

        reader.onload = (e) => {
            previewImage.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

doPaginate(pageIndex.value);
</script>