<template>
    <section>
        <TitleDashboard title="Daftar Dokter">
            <template #btn1>
                <el-button type="primary" @click="openDialog">Tambah Dokter</el-button>
            </template>
        </TitleDashboard>
        <div id="stickyElement" class="bg-white w-full sticky -top-3 z-10">
            <SearchAndPagination2 :row-total="rowTotal" :page-size="pageSize" :page-index="pageIndex" @change-page="changePage" @search="onSearch" @paginate="onPaginate" />
        </div>
        <div class="py-5">
            <el-table :data="listData" v-loading="loading" stripe border style="width: 100%">
                <el-table-column type="index" label="No" width="50" />
                <el-table-column prop="avatar" label="Foto">
                    <template #default="scope">
                        <el-image :src="scope.row.avatar">
                            <template #error>
                                <div class="image-slot">
                                    <el-icon>
                                        <Picture />
                                    </el-icon>
                                </div>
                            </template>
                            <template #placeholder>
                                <div class="image-slot">
                                    <el-icon>
                                        <Picture />
                                    </el-icon>
                                </div>
                            </template>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="fullname" label="Nama Dokter" />
                <el-table-column prop="gender" label="Jenis Kelamin" />
                <el-table-column prop="phone" label="No. HP" />
                <el-table-column prop="user.email" label="Email" />
                <el-table-column prop="description" label="Deskripsi">
                    <template #default="scope">
                        <el-popover trigger="hover" placement="top">
                            <template #default>
                                <p>{{ scope.row.description }}</p>
                            </template>
                            <template #reference>
                                <p class="cursor-pointer line-clamp-1">{{ scope.row.description }}</p>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="start_day" label="Hari">
                    <template #default="scope">
                        <p class="capitalize">{{ scope.row.start_day }} - {{ scope.row.end_day }}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="start_time" label="Jam">
                    <template #default="scope">
                        <p class="capitalize">{{ scope.row.start_time }} - {{ scope.row.end_time }}</p>
                    </template>
                </el-table-column>
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
            <h1 class="border-b pb-5">Tambah Dokter</h1>
        </template>
        <el-form label-width="120px" :label-position="labelPosition()" class="space-x-10" :model="addData" :rules="doctorRule" ref="addForm">
            <div class="w-full">
                <el-form-item label="Nama Dokter" prop="fullname">
                    <el-input v-model="addData.fullname" placeholder="Nama Dokter" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Foto" prop="image">
                    <div class="flex flex-col items-start justify-start">
                        <div class="flex flex-col gap-2 relative" v-if="previewImage">
                            <img class="h-36 object-cover rounded" :src="previewImage" alt="Preview" />
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
                <el-form-item label="Email" prop="email">
                    <el-input type="email" v-model="addData.email" placeholder="Email" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input type="password" show-password v-model="addData.password" placeholder="Password" style="width: 100%" />
                </el-form-item>
                <el-form-item label="No. HP" prop="phone">
                    <el-input type="number" v-model="addData.phone" placeholder="No HP" />
                </el-form-item>
                <el-form-item label="Jenis Kelamin" prop="gender">
                    <el-radio-group v-model="addData.gender">
                        <el-radio-button label="Laki-Laki" value="L" />
                        <el-radio-button label="Perempuan" value="P" />
                    </el-radio-group>
                </el-form-item>
                <el-form-item class="leading-4" label="Jadwal" prop="phone">
                    <div class="w-full flex items-center justify-center space-x-2">
                        <div class="w-full">
                            <p>Start Day</p>
                            <el-select v-model="addData.start_day" placeholder="Select" style="width: 240px">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                        </div>
                        <div class="w-full">
                            <p>End Day</p>
                            <el-select v-model="addData.end_day" placeholder="Select" style="width: 240px">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item class="leading-4" label="Jam" prop="phone">
                    <div class="w-full flex items-center justify-center space-x-2">
                        <div class="w-full">
                            <p>Start Time</p>
                            <el-time-picker value-format="HH:mm:ss" v-model="addData.start_time" placeholder="Start time" />
                        </div>
                        <div class="w-full">
                            <p>End Time</p>
                            <el-time-picker value-format="HH:mm:ss" v-model="addData.end_time" placeholder="End time" />
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="Deskripsi" prop="description">
                    <el-input v-model="addData.description" type="textarea" placeholder="Deskripsi" style="width: 100%" />
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
            <h1 class="border-b pb-5">Edit Dokter</h1>
        </template>
        <el-form label-width="120px" :label-position="labelPosition()" class="space-x-10" :model="editData" :rules="updateDoctorRule" ref="editForm">
            <div class="w-full">
                <el-form-item label="Nama Dokter" prop="fullname">
                    <el-input v-model="editData.fullname" placeholder="Nama Dokter" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Foto" prop="image">
                    <div class="flex flex-col items-start justify-start">
                        <div class="flex flex-col gap-2 relative" v-if="previewImage">
                            <img class="h-36 object-cover rounded" :src="previewImage" alt="Preview" />
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
                <el-form-item label="Email" prop="email">
                    <el-input type="email" v-model="editData.email" placeholder="Email" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input type="password" show-password v-model="editData.password" placeholder="Password" style="width: 100%" />
                </el-form-item>
                <el-form-item label="No. HP" prop="phone">
                    <el-input type="number" v-model="editData.phone" placeholder="No HP" />
                </el-form-item>
                <el-form-item label="Jenis Kelamin" prop="gender">
                    <el-radio-group v-model="editData.gender">
                        <el-radio-button label="Laki-Laki" value="L" />
                        <el-radio-button label="Perempuan" value="P" />
                    </el-radio-group>
                </el-form-item>
                <el-form-item class="leading-4" label="Jadwal" prop="phone">
                    <div class="w-full flex items-center justify-center space-x-2">
                        <div class="w-full">
                            <p>Start Day</p>
                            <el-select v-model="editData.start_day" placeholder="Select" style="width: 240px">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                        </div>
                        <div class="w-full">
                            <p>End Day</p>
                            <el-select v-model="editData.end_day" placeholder="Select" style="width: 240px">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item class="leading-4" label="Jam" prop="phone">
                    <div class="w-full flex items-center justify-center space-x-2">
                        <div class="w-full">
                            <p>Start Time</p>
                            <el-time-picker value-format="HH:mm:ss" v-model="editData.start_time" placeholder="Start time" />
                        </div>
                        <div class="w-full">
                            <p>End Time</p>
                            <el-time-picker value-format="HH:mm:ss" v-model="editData.end_time" placeholder="End time" />
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="Deskripsi" prop="description">
                    <el-input v-model="editData.description" type="textarea" placeholder="Deskripsi" style="width: 100%" />
                </el-form-item>
            </div>
        </el-form>
        <template #footer>
            <FooterButtonDialog @save-click="onSaveEdit" @cancel-click="cancelEdit" />
        </template>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { deleteDokter, listDokterPagination, tambahDokter, updateDokter } from '../../api/dokterApi';
import { convertDate, dialogWidth, labelPosition } from '../../helpers/utils';
import { doctorRule, updateDoctorRule } from '../../rules/doctorRules';
import { Delete, Picture, UploadFilled } from '@element-plus/icons-vue';
import useAddData from '../../composables/useAddData';
import useDeleteData from '../../composables/useDeleteData';
import useEditData from '../../composables/useEditData';
import usePagination from '../../composables/usePagination';

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
const options = [
    {
        value: 'monday',
        label: 'Senin',
    },
    {
        value: 'tuesday',
        label: 'Selasa',
    },
    {
        value: 'wednesday',
        label: 'Rabu',
    },
    {
        value: 'thursday',
        label: 'Kamis',
    },
    {
        value: 'friday',
        label: 'Jumat',
    },
    {
        value: 'saturday',
        label: 'Sabtu',
    },
    {
        value: 'sunday',
        label: 'Minggu',
    }
]

function doPaginate(index, pSize) {
    getListData(listDokterPagination, index, pSize ? pSize : pageSize.value, search.value, filterData.value);
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
    row.email = row.user.email
    previewImage.value = row.avatar
    row.gender = row.gender == 'Laki-laki' ? 'L' : 'P'
    openEditDialog(row);
}

function onDeleteData({ id = 0 }) {
    deleteData(deleteDokter, id, () => doPaginate(1));
}

function onSaveAdd() {
    saveAdd(tambahDokter, () => doPaginate(1));
}

function onSaveEdit() {
    saveEdit(updateDokter, 'id', () => doPaginate(1));
}

async function inputImage(event) {
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
        addData.value.image = file;

        reader.onload = (e) => {
            previewImage.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

doPaginate(pageIndex.value);
</script>