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
                        <ArrowPathIcon class="size-5 text-blue-500 cursor-pointer" :class="{ 'animate-spin': isLoadingGetMedicine }" @click="fetchMedicine" />
                    </el-tooltip>
                </div>
                <div class="grid gap-3 md:grid-cols-2">
                    <template v-for="(item, index) in medicineList" :key="index">
                        <div class="space-y-3 border rounded-lg p-2">
                            <div class="flex items-center gap-3">
                                <div v-html="capsule" class="size-4 flex-shrink-0"></div>
                                <p class="text-sm text-gray-700 font-bold">{{ item.is_compound ? item.compound_name : item.product.name }}</p>
                            </div>
                            <div class="text-gray-700 space-y-2">
                                <!-- Label Status -->
                                <div class="flex items-center gap-x-3">
                                    <div :class="`${getStatusColor(item.status)} rounded px-3 py-0.5`">
                                        <h1 class="text-xs text-white">{{ item.status_name }}</h1>
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
                                    <p class="font-semibold">{{ item.usage_instruction }}</p>
                                </div>
                                <div class="text-sm">
                                    <p class="text-gray-500 text-xs">Catatan</p>
                                    <p class="font-semibold">{{ item.notes }}</p>
                                </div>
                                <div class="flex items-center gap-x-3">
                                    <!-- Detail Obat -->
                                    <button type="button" class="px-3 py-1 bg-gray-300 text-gray-800 text-xs rounded hover:bg-gray-200 transition-colors">Detail Obat</button>
                                    <!-- Proses Obat -->
                                    <el-popconfirm confirm-button-text="Yes" cancel-button-text="No" :icon="InfoFilled" icon-color="red" title="Apakah yakin?"
                                        @confirm="onAcceptMedicine(item.id)" content="Hapus">
                                        <template #reference>
                                            <button type="button" class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                                                v-if="item.status !== 'accepted'">Proses Obat</button>
                                        </template>
                                    </el-popconfirm>
                                </div>
                            </div>
                        </div>
                    </template>
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
                    <div class="space-y-1">
                        <div class="flex items-center gap-2">
                            <PlusCircleIcon class="h-4 w-4 text-blue-500" />
                            <p class="text-sm text-gray-500 font-bold">Tindakan</p>
                        </div>
                        <p class="whitespace-pre-line">{{ data?.history?.tindakan || '-' }}</p>
                    </div>
                    <div class="space-y-1">
                        <div class="flex items-center gap-2">
                            <BeakerIcon class="h-4 w-4 text-green-500" />
                            <p class="text-sm text-gray-500 font-bold">Terapi/Obat</p>
                        </div>
                        <p class="whitespace-pre-line">{{ data?.history?.teraphy || '-' }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- PatientInfoCard.vue -->
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
    PlusCircleIcon,
    ArrowPathIcon,
} from '@heroicons/vue/24/outline'
import { copyToClipboard } from '../../../helpers/utils';
import { capsule, capsulePill } from '../../../helpers/svg';
import useGetData from '../../../composables/useGetData';
import { apiAcceptMedicine, apiListMedicineByQueue } from '../../../api/apiMedicine';
import { InfoFilled } from '@element-plus/icons-vue';

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const getStatusColor = (status) => {
    switch (status) {
        case 'new':
            return 'bg-blue-400'; // Warna untuk status Baru
        case 'accepted':
            return 'bg-green-400'; // Warna untuk status Diproses
        case 'rejected':
            return 'bg-red-400'; // Warna untuk status Ditolak
        case 'changed':
            return 'bg-yellow-400'; // Warna untuk status Diganti
        case 'done':
            return 'bg-gray-400'; // Warna untuk status Selesai
        default:
            return 'bg-gray-200'; // Warna default kalau tidak cocok
    }
};

const [medicineList, getMedicineList, isLoadingGetMedicine] = useGetData();
const { 1: fetchApi } = useGetData();

function fetchMedicine() {
    getMedicineList(() => apiListMedicineByQueue(props.data.id), true, true);
}

function onAcceptMedicine(medsId) {
    fetchApi(() => apiAcceptMedicine(props.data.id, medsId, {}), false, true, fetchMedicine);
}

fetchMedicine();
</script>