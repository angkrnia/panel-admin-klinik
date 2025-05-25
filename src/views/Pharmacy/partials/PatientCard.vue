<template>
    <div class="w-full">
        <div class="grid gap-6 md:grid-cols-2">
            <!-- Kartu Data Pasien -->
            <div class="bg-white rounded-lg shadow-md p-4">
                <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                    <UserCircleIcon class="h-5 w-5 text-blue-500" />
                    Data Pasien
                </h2>
                <div class="space-y-3">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <p class="text-sm text-gray-500 font-bold">No. Rekam Medis</p>
                            <div class="flex items-center gap-x-1">
                                <p class="font-medium">{{ data?.patient?.record_no }}</p>
                                <el-tooltip class="box-item" effect="dark" content="Copy" placement="top">
                                    <button type="button" @click="copyToClipboard(data?.patient?.record_no)">
                                        <ClipboardDocumentIcon class="h-4 w-4 text-blue-500" />
                                    </button>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="space-y-1">
                            <p class="text-sm text-gray-500 font-bold">No. HP</p>
                            <div class="flex items-center gap-x-1">
                                <p class="font-medium">{{ data?.patient?.phone || '-' }}</p>
                                <el-tooltip class="box-item" effect="dark" content="Copy" placement="top">
                                    <button type="button" @click="copyToClipboard(data?.patient?.phone)">
                                        <ClipboardDocumentIcon class="h-4 w-4 text-blue-500" />
                                    </button>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-1">
                        <p class="text-sm text-gray-500 font-bold">Nama Pasien</p>
                        <div class="flex items-center gap-x-1">
                            <p class="font-medium">{{ data?.patient?.fullname || '-' }}</p>
                            <el-tooltip class="box-item" effect="dark" content="Copy" placement="top">
                                <button type="button" @click="copyToClipboard(data?.patient?.fullname)">
                                    <ClipboardDocumentIcon class="h-4 w-4 text-blue-500" />
                                </button>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="space-y-1">
                        <p class="text-sm text-gray-500 font-bold">Nama Keluarga</p>
                        <p class="font-medium">{{ data?.patient?.nama_keluarga || '-' }}</p>
                    </div>
                    <div class="space-y-1">
                        <p class="text-sm text-gray-500 font-bold">Dokter</p>
                        <p class="font-medium">{{ data?.doctor?.fullname || '-' }}</p>
                    </div>
                </div>
            </div>

            <!-- Kartu Tanda Vital -->
            <div class="bg-white rounded-lg shadow-md p-4">
                <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                    <ChartBarIcon class="h-5 w-5 text-green-500" />
                    Pemeriksaan Fisik
                </h2>
                <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div class="space-y-1">
                            <div class="flex items-center gap-2">
                                <HeartIcon class="h-4 w-4 text-red-500" />
                                <p class="text-sm text-gray-500 font-bold">Tekanan Darah</p>
                            </div>
                            <p class="font-medium">{{ data?.history?.blood_pressure || '-' }} mmHg</p>
                        </div>
                        <div class="space-y-1">
                            <div class="flex items-center gap-2">
                                <ScaleIcon class="h-4 w-4 text-purple-500" />
                                <p class="text-sm text-gray-500 font-bold">Berat Badan</p>
                            </div>
                            <p class="font-medium">{{ data?.history?.weight || '-' }} kg</p>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div class="space-y-1">
                            <div class="flex items-center gap-2">
                                <BeakerIcon class="h-4 w-4 text-orange-500" />
                                <p class="text-sm text-gray-500 font-bold">Suhu Badan</p>
                            </div>
                            <p class="font-medium">{{ data?.history?.temperature || '-' }} °C</p>
                        </div>
                        <div class="space-y-1">
                            <div class="flex items-center gap-2">
                                <ArrowTrendingUpIcon class="h-4 w-4 text-blue-500" />
                                <p class="text-sm text-gray-500 font-bold">Tinggi Badan</p>
                            </div>
                            <p class="font-medium">{{ data?.history?.height || '-' }} cm</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Daftar Obat -->
            <div class="bg-white rounded-lg shadow-md p-4 md:col-span-2">
                <div class="flex items-center gap-x-2 mb-4">
                    <h2 class="text-xl font-semibold flex items-center gap-2">
                        <div v-html="capsulePill" class="size-5 text-indigo-400"></div>
                        Daftar Obat
                    </h2>
                    <el-tooltip class="box-item" effect="dark" content="Refresh" placement="top">
                        <ArrowPathIcon class="size-5 text-blue-500 cursor-pointer" @click="fetchMedicine" />
                    </el-tooltip>
                </div>
                <div class="grid gap-3 lg:grid-cols-2">
                    <template v-if="!loadingMedicine">
                        <template v-for="(item, index) in medicineList" :key="index">
                            <div class="space-y-3 border rounded-lg p-2">
                                <div class="flex items-center gap-3">
                                    <div v-html="capsule" class="size-4 flex-shrink-0"></div>
                                    <p class="text-sm text-gray-700 font-bold">{{ item.is_compound ? item.compound_name : item.product.name }}</p>
                                </div>
                                <div class="text-gray-700 space-y-2">
                                    <div>
                                        <template v-if="!item.is_compound">
                                            <h1 class="text-green-600">Harga: {{ convertRp(item?.product?.sell_price) }}</h1>
                                        </template>
                                        <template v-if="item.is_compound">
                                            <h1 class="text-green-600">Harga: {{ convertRp(item?.total_price) }}</h1>
                                        </template>
                                    </div>
                                    <!-- Label Status -->
                                    <div class="flex items-center gap-x-3">
                                        <div class="flex" v-if="item.is_compound">
                                            <h1 class="text-sm  text-white bg-orange-500/50 rounded px-3 py-0.5">Obat Racikan</h1>
                                        </div>
                                        <div :class="`${getStatusColor(item.status)} rounded px-3 py-0.5`">
                                            <h1 class="text-sm  text-white">{{ item.status_name }}</h1>
                                        </div>
                                    </div>
                                    <div class="text-sm">
                                        <p class="text-gray-500 text-xs">Jumlah</p>
                                        <p class="font-semibold">{{ item.qty }}</p>
                                    </div>
                                    <div class="text-sm">
                                        <p class="text-gray-500 text-xs">Dosis</p>
                                        <p class="font-semibold">{{ item.dosage }}</p>
                                    </div>
                                    <div class="text-sm">
                                        <p class="text-gray-500 text-xs">Penggunaan</p>
                                        <p class="font-semibold">{{ item.usage_instruction || '-' }}</p>
                                    </div>
                                    <div class="text-sm">
                                        <p class="text-gray-500 text-xs">Catatan</p>
                                        <p class="font-semibold">{{ item.notes || '-' }}</p>
                                    </div>
                                    <div class="flex items-center flex-wrap gap-3">
                                        <!-- Detail Obat -->
                                        <button type="button" @click="onDetailMedicine(item)"
                                            class="px-3 py-1 bg-gray-300 text-gray-800 text-xs rounded hover:bg-gray-200 transition-colors">{{ item.is_compound ?
                                                'Detail Racikan'
                                                : 'Detail Obat' }}</button>
                                        <!-- Proses Obat -->
                                        <el-popconfirm confirm-button-text="Yes" cancel-button-text="No" :icon="InfoFilled" icon-color="red" title="Apakah yakin?"
                                            @confirm="onAcceptMedicine(item.id)" content="Hapus">
                                            <template #reference>
                                                <button type="button" class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                                                    v-if="item.status !== 'accepted' && item.status !== 'rejected'">Proses Obat</button>
                                            </template>
                                        </el-popconfirm>
                                        <!-- Cancel Obat -->
                                        <button type="button" class="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-opacity-80 transition-colors"
                                            @click="onCancelMedicine(item)" v-if="item.status !== 'rejected'">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>

                    <!-- Loading Obat -->
                    <div class="flex items-center justify-center w-full col-span-2" v-if="loadingMedicine">
                        <h1 class="font-semibold text-sm text-center">Loading...</h1>
                    </div>
                </div>
            </div>

            <!-- Daftar Layanan -->
            <div class="bg-white rounded-lg shadow-md p-4 md:col-span-2">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-x-2">
                        <h2 class="text-xl font-semibold flex items-center gap-2">
                            <Stethoscope class="size-5 text-indigo-400" />
                            Tipe Layanan
                        </h2>
                        <el-tooltip class="box-item" effect="dark" content="Refresh" placement="top">
                            <ArrowPathIcon class="size-5 text-blue-500 cursor-pointer" @click="fetchMedicine" />
                        </el-tooltip>
                    </div>
                    <el-button type="primary" size="small" @click="onAddManualService">Tambah Manual</el-button>
                </div>
                <div class="space-y-2">
                    <!-- Jika tindakan kosong -->
                    <div class="flex items-center justify-center w-full" v-if="serviceList.length == 0 && !isLoadingGetService">
                        <el-empty description="Belum ada tindakan" :image-size="80"></el-empty>
                    </div>

                    <template v-if="!isLoadingGetService">
                        <template v-for="(item, index) in serviceList" :key="index">
                            <div class="p-3 bg-white rounded-xl shadow-sm border">
                                <div class="flex items-start justify-between">
                                    <div>
                                        <h3 class="font-semibold text-gray-800">
                                            {{ item.service_type_name }}
                                        </h3>
                                        <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                                        <p class="text-sm text-gray-500">Catatan: {{ item.notes || '-' }}</p>
                                    </div>
                                    <div class="text-right">
                                        <div>
                                            <p class="text-sm text-gray-400">Biaya</p>
                                            <p class="font-bold text-green-600">{{ convertRp(item.total_price) }}</p>
                                        </div>
                                        <el-popconfirm title="Apakah yakin ingin menghapus layanan ini?" @confirm="onDeleteService(item.id)">
                                            <template #reference>
                                                <el-button type="danger" size="small">Hapus</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>

                    <!-- Loading layanan -->
                    <div class="flex items-center justify-center w-full" v-if="isLoadingGetService">
                        <h1 class="font-semibold text-sm text-center">Loading...</h1>
                    </div>
                </div>
            </div>

            <!-- Daftar Tindakan -->
            <div class="bg-white rounded-lg shadow-md p-4 md:col-span-2">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-x-2">
                        <h2 class="text-xl font-semibold flex items-center gap-2">
                            <div v-html="activity" class="size-5 text-indigo-400"></div>
                            Daftar Tindakan
                        </h2>
                        <el-tooltip class="box-item" effect="dark" content="Refresh" placement="top">
                            <ArrowPathIcon class="size-5 text-blue-500 cursor-pointer" @click="fetchMedicine" />
                        </el-tooltip>
                    </div>
                    <el-button type="primary" size="small" @click="onAddManualTindakan">Tambah Manual</el-button>
                </div>
                <div class="space-y-2">
                    <!-- Jika tindakan kosong -->
                    <div class="flex items-center justify-center w-full" v-if="tindakanList.length == 0 && !loadingTindakan">
                        <el-empty description="Belum ada tindakan" :image-size="80"></el-empty>
                    </div>

                    <template v-if="!loadingTindakan">
                        <template v-for="(item, index) in tindakanList" :key="index">
                            <div class="p-3 bg-white rounded-xl shadow-sm border">
                                <div class="flex items-start justify-between">
                                    <div>
                                        <h3 class="font-semibold text-gray-800">
                                            {{ item.procedure_name }}
                                        </h3>
                                        <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                                        <p class="text-sm text-gray-500">Catatan: {{ item.notes || '-' }}</p>
                                    </div>
                                    <div class="text-right">
                                        <div>
                                            <p class="text-sm text-gray-400">Biaya</p>
                                            <p class="font-bold text-green-600">{{ convertRp(item.price * item.quantity) }}</p>
                                        </div>
                                        <el-popconfirm v-if="profile?.role == item.source" title="Apakah yakin ingin menghapus tindakan ini?" @confirm="onDeleteTindakan(item.id)">
                                            <template #reference>
                                                <el-button type="danger" size="small">Hapus</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>

                    <!-- Loading tindakan -->
                    <div class="flex items-center justify-center w-full" v-if="loadingTindakan">
                        <h1 class="font-semibold text-sm text-center">Loading...</h1>
                    </div>
                </div>
            </div>

            <!-- Kartu Detail Medis -->
            <div class="bg-white rounded-lg shadow-md p-4 md:col-span-2">
                <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                    <UserIcon class="h-5 w-5 text-indigo-500" />
                    Detail Medis
                </h2>
                <div class="grid gap-6 md:grid-cols-2">
                    <div class="space-y-1">
                        <div class="flex items-center gap-2">
                            <ClipboardDocumentIcon class="h-4 w-4 text-gray-500" />
                            <p class="text-sm text-gray-500 font-bold">Pemeriksaan</p>
                        </div>
                        <p class="whitespace-pre-line">{{ data?.history?.pemeriksaan || '-' }}</p>
                    </div>
                    <div class="space-y-1">
                        <div class="flex items-center gap-2">
                            <DocumentTextIcon class="h-4 w-4 text-red-500" />
                            <p class="text-sm text-gray-500 font-bold">Diagnosis</p>
                        </div>
                        <p class="whitespace-pre-line">{{ data?.history?.diagnosa || '-' }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Cancel Dialog -->
    <el-dialog v-model="cancelDialog" title="Cancel Obat" :width="dialogWidth()" top="5vh">
        <div class="space-y-4">
            <p>Apakah anda yakin ingin membatalkan obat ini?</p>
            <el-form ref="cancelForm" :model="cancelData" label-position="top">
                <el-form-item label="Catatan" prop="note" :rules="[{ required: true }]">
                    <el-input type="textarea" v-model="cancelData.note" placeholder="Masukan Catatan"></el-input>
                </el-form-item>
            </el-form>
            <div class="flex items-center  justify-end gap-3">
                <button type="button" class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-opacity-80 transition-colors" @click="onSubmitCancel">Submit</button>
            </div>
        </div>
    </el-dialog>

    <!-- Detail Obat -->
    <el-dialog v-model="detailObatDialog" :title="detailObat.is_compound ? 'Obat Racikan' : 'Obat Tunggal'" :width="dialogWidth({ onDesktop: '40%' })" top="5vh">
        <div class="p-3 space-y-4">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <p :class="`${getStatusColor(detailObat.status)} px-3 py-1 rounded-full text-sm text-white`">
                    {{ detailObat.status_name }}
                </p>
            </div>

            <!-- Informasi Umum -->
            <div class="space-y-2">
                <div v-if="detailObat.is_compound">
                    <p class="text-sm text-gray-500">Nama Racikan</p>
                    <p class="font-semibold text-gray-700">{{ detailObat.compound_name }}</p>
                </div>
                <div v-else>
                    <p class="text-sm text-gray-500">Nama Obat</p>
                    <p class="font-semibold text-gray-700">{{ detailObat.product?.name ?? '-' }}</p>
                </div>

                <div>
                    <p class="text-sm text-gray-500">Dosis</p>
                    <p class="text-gray-700">{{ detailObat.dosage }}</p>
                </div>

                <div>
                    <p class="text-sm text-gray-500">Jumlah</p>
                    <p class="text-gray-700">{{ detailObat.qty }}</p>
                </div>

                <div>
                    <p class="text-sm text-gray-500">Aturan Pakai</p>
                    <p class="text-gray-700">{{ detailObat.usage_instruction }}</p>
                </div>

                <div>
                    <p class="text-sm text-gray-500">Keterangan</p>
                    <p class="text-gray-700">{{ detailObat.notes }}</p>
                </div>

                <div v-if="detailObat.is_compound && detailObat.mix_instruction">
                    <p class="text-sm text-gray-500">Instruksi Pencampuran</p>
                    <p class="text-gray-700">{{ detailObat.mix_instruction }}</p>
                </div>
            </div>

            <!-- Daftar Komposisi Obat Racikan -->
            <div v-if="detailObat.is_compound">
                <p class="text-sm font-semibold text-gray-800 mb-2">Komposisi Racikan:</p>
                <ul class="space-y-2">
                    <li v-for="(med, index) in detailObat.compound_meds" :key="med.id" class="p-3 bg-gray-50 rounded-lg border">
                        <div class="flex justify-between">
                            <p class="font-medium text-gray-700">
                                {{ med.product?.name ?? 'Nama tidak ditemukan' }}
                            </p>
                            <p class="text-gray-600">
                                {{ med.amount }} {{ med.unit.name }}
                            </p>
                        </div>
                        <p class="text-sm text-gray-400">SKU: {{ med.product?.sku ?? '-' }}</p>
                        <p class="text-sm text-gray-400">Harga: {{ convertRp(med.product?.sell_price) }}</p>
                    </li>
                </ul>
            </div>
        </div>
    </el-dialog>

    <!-- Tambah Tindakan Manual -->
    <el-dialog v-model="addDialog" title="Tindakan Manual" :width="dialogWidth()" top="5vh">
        <div class="space-y-4">
            <el-form ref="addForm" :model="addData" label-position="top">
                <el-form-item label="Pilih Tindakan" prop="procedure_id">
                    <el-select @change="handleSelectTindakan" filterable clearable v-model="addData.procedure_id" placeholder="Pilih Tindakan">
                        <el-option v-for="item in masterTindakan" :key="item.id" :label="`${item.name} - Rp${Number(item.total_fee).toLocaleString('id-ID')}`" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="Nama Tindakan" prop="procedure_name" :rules="[{ required: true }]">
                    <el-input v-model="addData.procedure_name" placeholder="Masukan Nama Tindakan" />
                </el-form-item>
                <el-form-item label="Biaya" prop="price" :rules="[{ required: true }]">
                    <el-currency-input v-model="addData.price" placeholder="Masukan Biaya Tindakan" />
                </el-form-item>
                <el-form-item label="Jumlah" prop="quantity" :rules="[{ required: true }]">
                    <el-input v-model="addData.quantity" placeholder="Masukan Jumlah" />
                </el-form-item>
                <el-form-item label="Catatan" prop="notes">
                    <el-input type="textarea" v-model="addData.notes" placeholder="Masukan Catatan"></el-input>
                </el-form-item>
            </el-form>
            <div class="flex items-center  justify-end gap-3">
                <button type="button" class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-opacity-80 transition-colors" @click="onSubmitManualTindakan">Submit</button>
            </div>
        </div>
    </el-dialog>

    <!-- Tambah Layanan Manual -->
    <el-dialog v-model="addDialogService" title="Layanan Manual" :width="dialogWidth()" top="5vh">
        <div class="space-y-4">
            <el-form ref="addFormService" :model="addDataService" label-position="top">
                <el-form-item label="Pilih Layanan" prop="service_type_id">
                    <el-select filterable clearable v-model="addDataService.service_type_id" placeholder="Pilih Layanan">
                        <el-option v-for="item in masterLayanan" :key="item.id" :label="`${item.name} - ${convertRp(item.price)}`" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="Jumlah" prop="quantity" :rules="[{ required: true }]">
                    <el-input v-model="addDataService.quantity" placeholder="Masukan Jumlah" />
                </el-form-item>
                <el-form-item label="Catatan" prop="notes">
                    <el-input type="textarea" v-model="addDataService.notes" placeholder="Masukan Catatan"></el-input>
                </el-form-item>
            </el-form>
            <div class="flex items-center  justify-end gap-3">
                <button type="button" class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-opacity-80 transition-colors" @click="onSubmitManualLayanan">Submit</button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import {
    UserCircleIcon,
    ChartBarIcon,
    HeartIcon,
    BeakerIcon,
    ScaleIcon,
    ArrowTrendingUpIcon,
    UserIcon,
    ClipboardDocumentIcon,
    DocumentTextIcon,
    ArrowPathIcon,
} from '@heroicons/vue/24/outline'
import { convertRp, copyToClipboard, dialogWidth } from '../../../helpers/utils';
import { activity, capsule, capsulePill } from '../../../helpers/svg';
import { InfoFilled } from '@element-plus/icons-vue';
import useEditData from '../../../composables/useEditData';
import { apiDeleteService, apiDeleteTindakan, apiListServiceByQueue, apiMasterTindakan, apiPostService, apiPostTindakan, apiRejectMedicine } from '../../../api/apiMedicine';
import useViewData from '../../../composables/useViewData';
import useAddData from '../../../composables/useAddData';
import useGetData from '../../../composables/useGetData';
import { useAppStore } from '../../../store/appStore';
import { computed } from 'vue';
import useDeleteData from '../../../composables/useDeleteData';
import { Stethoscope } from 'lucide-vue-next';
import { APISelectTipeLayanan } from '../../../api/apiHelper';

const appStore = useAppStore();
const profile = computed(() => appStore.profile);

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    medicineList: {
        type: Array,
        required: true
    },
    loadingMedicine: {
        type: Boolean,
        required: true
    },
    tindakanList: {
        type: Array,
        required: true
    },
    loadingTindakan: {
        type: Boolean,
        required: true
    },
})

const [cancelData, cancelForm, cancelDialog, openCancelDialog, saveCancel] = useEditData({ returnAsArray: true })
const [detailObat, detailObatDialog, closeDetailObat, openDetailObatDialog] = useViewData({ returnAsArray: true })
const [
    addData,
    addForm,
    addDialog,
    saveAdd,
    cancelAdd,
    requiredLabelLength,
    openDialog,
] = useAddData({ returnAsArray: true });
const [
    addDataService,
    addFormService,
    addDialogService,
    saveAddService,
    cancelAddService,
    requiredLabelLengthService,
    openDialogService,
] = useAddData({ returnAsArray: true });
const [masterTindakan, getMasterTindakan] = useGetData();
const [masterLayanan, getMasterLayanan] = useGetData();
const [serviceList, getServiceList, isLoadingGetService] = useGetData();

const { deleteData } = useDeleteData();

const emit = defineEmits(['accept-medicine', 'refresh-medicine', 'refresh-tindakan', 'click-detail-racikan']);

const getStatusColor = (status) => {
    switch (status) {
        case 'new':
            return 'bg-blue-400/60'; // Warna untuk status Baru
        case 'accepted':
            return 'bg-green-400/60'; // Warna untuk status Diproses
        case 'rejected':
            return 'bg-red-400/60 text-white'; // Warna untuk status Ditolak
        case 'changed':
            return 'bg-yellow-400/60'; // Warna untuk status Diganti
        case 'done':
            return 'bg-gray-400/60'; // Warna untuk status Selesai
        default:
            return 'bg-gray-200/60'; // Warna default kalau tidak cocok
    }
};

function onAcceptMedicine(medsId) {
    emit('accept-medicine', medsId);
}

function onCancelMedicine(medsId) {
    const row = {
        queue_id: props.data.id,
        medicine_id: medsId.id
    }
    openCancelDialog(row);
}

function onSubmitCancel() {
    saveCancel(() => apiRejectMedicine(cancelData.value.queue_id, cancelData.value.medicine_id, cancelData.value), null, () => {
        fetchMedicine();
    });
}

function fetchMedicine() {
    emit('refresh-medicine');
}

function fetchTindakan() {
    emit('refresh-tindakan');
}

function onDetailMedicine(item) {
    if (item.is_compound) {
        emit('click-detail-racikan', item.compound_meds)
    } else {
        openDetailObatDialog(item);
    }
}

function onAddManualTindakan() {
    addData.value.quantity = 1
    getMasterTindakan(apiMasterTindakan);
    openDialog(0);
}

function onAddManualService() {
    addDataService.value.quantity = 1
    getMasterLayanan(APISelectTipeLayanan);
    openDialogService(1);
}

const handleSelectTindakan = (id) => {
    const selected = masterTindakan.value.find(item => item.id === id)
    if (selected) {
        addData.value.procedure_name = selected.name
        addData.value.price = parseFloat(selected.total_fee)
    } else {
        addData.value.procedure_name = ''
        addData.value.price = 0
    }
}

function onSubmitManualTindakan() {
    addData.value.queueId = props.data.id;
    saveAdd(apiPostTindakan, () => {
        fetchTindakan();
    })
}

function onSubmitManualLayanan()  {
    addDataService.value.queueId = props.data.id;
    saveAddService(apiPostService, () => {
        fetchService();
    })
}

function onDeleteTindakan(id) {
    deleteData(apiDeleteTindakan, { id, queueId: props.data.id }, fetchTindakan);
}

function onDeleteService(id) {
    deleteData(apiDeleteService, { id, queueId: props.data.id }, fetchService);
}

function fetchService() {
    getServiceList(() => apiListServiceByQueue(props.data.id), true, true);
}

fetchService();
</script>