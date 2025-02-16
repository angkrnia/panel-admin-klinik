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
} from '@heroicons/vue/24/outline'
import { copyToClipboard } from '../../../helpers/utils';

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})
</script>

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