<template>
    <div class="prescription-screen min-h-screen px-4 py-6 text-[13px] text-slate-950 print:bg-white print:p-0">
        <div class="mx-auto mb-4 flex w-full max-w-2xl items-center justify-between print:hidden">
            <div>
                <h1 class="text-base font-semibold text-slate-900">Preview Resep Obat</h1>
                <p class="text-sm text-slate-500">Kartu resep final siap cetak</p>
            </div>
            <div class="flex gap-2">
                <button type="button"
                    class="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    @click="goBack">
                    <ArrowLeft class="h-4 w-4" />
                    Kembali
                </button>
                <button type="button" class="inline-flex items-center gap-2 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700" @click="printPrescription">
                    <Printer class="h-4 w-4" />
                    Cetak Resep
                </button>
            </div>
        </div>

        <main class="mx-auto w-full max-w-2xl print:max-w-none border print:border-0 print:shadow-none">
            <section class="prescription-card relative overflow-hidden border border-gray-100 bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none">
                <img src="/images/logo.png" alt="" class="pointer-events-none absolute left-1/2 top-[56%] z-[1] w-[320px] max-w-[56%] -translate-x-1/2 -translate-y-1/2 opacity-[0.06] mix-blend-multiply print:opacity-[0.05]" />

                <header class="relative z-10 flex items-center justify-between gap-5 border-b border-slate-200 bg-transparent px-8 py-5 text-slate-900 print:px-7 print:py-4">
                    <div class="flex min-w-0 max-w-[calc(100%-10rem)] flex-1 items-center gap-4">
                        <div class="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
                            <img src="/images/logo.png" alt="Logo Klinik" class="h-11 w-11 object-contain" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <div class="font-serif text-base font-semibold leading-tight text-slate-900">{{ clinic.name }}</div>
                            <div class="mt-0.5 break-words text-[11px] uppercase leading-normal tracking-widest text-slate-500">{{ clinic.address || 'Alamat Klinik' }}</div>
                        </div>
                    </div>

                    <div class="w-36 flex-shrink-0 text-right">
                        <div class="text-[10px] uppercase tracking-widest text-slate-500">No. Resep</div>
                        <div class="mt-0.5 font-serif text-sm text-slate-900">{{ prescription.number }}</div>
                        <div class="mt-1 text-[11px] text-slate-500">{{ prescription.date }}</div>
                    </div>
                </header>

                <div class="relative px-8 pt-5 print:px-7 print:py-3">
                    <!-- <div class="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
                        <div>
                            <div class="text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-600">Resep Obat</div>
                            <div class="mt-0.5 text-[10px] text-slate-500">Resep digital berlaku untuk pasien dan tanggal pemeriksaan ini.</div>
                        </div>
                        <div class="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-medium text-blue-700">Terverifikasi Digital</div>
                    </div> -->
                    <section class="mb-3 grid grid-cols-2 gap-6 pt-0.5">
                        <div>
                            <div class="mb-1.5 flex items-center gap-2 text-[10px] font-medium uppercase leading-[1.1] tracking-widest text-gray-400">
                                <UserRound class="h-3.5 w-3.5" />
                                Data Pasien
                            </div>
                            <div class="mb-1 font-serif text-base font-semibold leading-tight text-gray-900">{{ patient.name }}</div>
                            <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 leading-[1.2]">
                                <template v-for="item in patientInfo" :key="item.label">
                                    <span class="text-[11px] text-gray-400">{{ item.label }}</span>
                                    <span class="text-[11px] font-medium text-gray-600">{{ item.value }}</span>
                                </template>
                            </div>
                        </div>

                        <div>
                            <div class="mb-1.5 flex items-center gap-2 text-[10px] font-medium uppercase leading-[1.1] tracking-widest text-gray-400">
                                <Stethoscope class="h-3.5 w-3.5" />
                                Dokter Pemeriksa
                            </div>
                            <div class="min-h-[5.2rem]px-3 py-2">
                                <div class="font-serif text-sm font-semibold text-gray-900">{{ doctor.name }}</div>
                                <div class="mb-1.5 mt-0.5 text-[10px] text-gray-400">{{ doctor.unit }}</div>
                                <div class="flex items-center gap-2">
                                    <span class="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-medium tracking-wide text-gray-500">SIP</span>
                                    <span class="text-[11px] leading-tight text-gray-400">{{ doctor.sip }}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr class="mb-2.5 border-gray-100" />

                    <section class="mb-3 border-b border-slate-100 pb-2.5">
                        <div class="mb-1 flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-gray-400">
                            <FileText class="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                            Diagnosis
                        </div>
                        <div class="text-[13px] font-medium text-gray-800">{{ patient.diagnosis }}</div>
                    </section>

                    <section class="mb-2 mt-0.5">
                        <div class="mb-2.5 flex items-center gap-2 text-[10px] font-medium uppercase leading-[1.1] tracking-widest text-gray-400">
                            <Pill class="h-3.5 w-3.5" />
                            Daftar Obat
                        </div>

                        <el-table :data="medicines" class="medicine-table overflow-hidden rounded-lg text-[11px] print:hidden" border size="small" :header-cell-style="medicineHeaderStyle" :cell-style="medicineCellStyle">
                            <el-table-column prop="quantity" label="Qty" :width="medicineColumnWidths.quantity" align="center" />
                            <el-table-column prop="name" label="Nama Obat" :width="medicineColumnWidths.name" />
                            <el-table-column prop="unit" label="Satuan" :width="medicineColumnWidths.unit" align="center" />
                            <el-table-column prop="dose" label="Dosis" :width="medicineColumnWidths.dose" align="center" />
                            <el-table-column prop="usage" label="Penggunaan" :width="medicineColumnWidths.usage" />
                            <el-table-column prop="note" label="Catatan" :width="medicineColumnWidths.note">
                                <template #default="{ row }">
                                    <span class="italic text-gray-500">{{ row.note }}</span>
                                </template>
                            </el-table-column>
                        </el-table>

                        <table class="hidden w-full table-fixed border-collapse text-[9px] leading-tight print:table">
                            <thead>
                                <tr class="bg-slate-50 text-slate-600">
                                    <th class="w-[7%] border border-slate-200 px-1 py-1 text-center font-semibold">Qty</th>
                                    <th class="w-[32%] border border-slate-200 px-1 py-1 text-left font-semibold">Nama Obat</th>
                                    <th class="w-[12%] border border-slate-200 px-1 py-1 text-center font-semibold">Satuan</th>
                                    <th class="w-[10%] border border-slate-200 px-1 py-1 text-center font-semibold">Dosis</th>
                                    <th class="w-[20%] border border-slate-200 px-1 py-1 text-left font-semibold">Penggunaan</th>
                                    <th class="w-[19%] border border-slate-200 px-1 py-1 text-left font-semibold">Catatan</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="medicine in medicines" :key="`print-${medicine.id}`" class="break-inside-avoid">
                                    <td class="border border-slate-200 px-1 py-1 text-center">{{ medicine.quantity }}</td>
                                    <td class="border border-slate-200 px-1 py-1 font-medium text-slate-900">{{ medicine.name }}</td>
                                    <td class="border border-slate-200 px-1 py-1 text-center">{{ medicine.unit }}</td>
                                    <td class="border border-slate-200 px-1 py-1 text-center">{{ medicine.dose }}</td>
                                    <td class="border border-slate-200 px-1 py-1">{{ medicine.usage }}</td>
                                    <td class="border border-slate-200 px-1 py-1 italic text-slate-500">{{ medicine.note }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                </div>

                <footer class="relative z-10 flex items-center justify-between gap-6 border-t border-slate-200 bg-slate-50 px-8 py-3 text-xs print:px-7 print:py-3">
                    <div class="min-w-0 max-w-md flex-1">
                        <div class="mb-1.5 flex items-center gap-2 text-[9px] font-medium uppercase tracking-widest text-gray-400">
                            <FileText class="h-3 w-3" />
                            Catatan Resep
                        </div>
                        <div class="space-y-1 border-l-2 border-slate-200 pl-3">
                            <div v-for="note in prescriptionNotes" :key="note" class="flex gap-2">
                                <div class="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-blue-600"></div>
                                <p class="text-[10px] leading-snug text-gray-600">{{ note }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="min-w-40 text-right">
                        <div class="mb-1.5 text-[9px] uppercase tracking-widest text-gray-400">Dokter Pemeriksa</div>
                        <div class="mb-2 ml-auto h-10 w-32 border-b border-slate-300"></div>
                        <div class="font-serif text-[13px] font-semibold text-gray-900">{{ doctor.name }}</div>
                        <div class="mt-0.5 text-[10px] text-gray-400">{{ doctor.unit }}</div>
                        <div class="mt-0.5 text-[9px] text-gray-400">SIP {{ doctor.sip }}</div>
                    </div>
                </footer>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ArrowLeft, FileText, Pill, Printer, Stethoscope, UserRound } from "lucide-vue-next";

const medicineColumnWidths = {
    quantity: 48,
    name: 210,
    unit: 70,
    dose: 64,
    usage: 116,
    note: 112,
};

const clinic = {
    name: "Klinik Adiyasa Medika",
    address: "Jl. Raya Cisoka - Adiyasa RW.6, Cikuya, Kec. Solear, Kabupaten Tangerang, Banten 15730",
};

const prescription = {
    number: "RX-20260525-0024",
    date: "30 Mei 2026",
};

const patient = {
    medicalRecordNumber: "RM-2026-0012",
    name: "Budi Santoso",
    birthDate: "12 Mei 1992",
    age: "34 Tahun",
    gender: "Laki-laki",
    heightWeight: "170 cm · 68 kg",
    allergy: "-",
    diagnosis: "Demam dan nyeri tenggorokan",
};

const doctor = {
    name: "dr. Andi Pratama",
    sip: "503/SIP-DU/2026",
    unit: "Dokter Umum",
};

const patientInfo = [
    { label: "No. RM", value: patient.medicalRecordNumber },
    { label: "Lahir", value: patient.birthDate },
    { label: "Usia", value: patient.age },
    { label: "Jenis Kelamin", value: patient.gender },
    { label: "Tinggi / Berat", value: patient.heightWeight },
    { label: "Alergi", value: patient.allergy },
];

const medicines = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        quantity: "1",
        unit: "Tablet",
        dose: "3×1",
        usage: "Sesudah Makan",
        note: "Jika demam",
    },
    {
        id: 2,
        name: "Amoxicillin 500mg",
        quantity: "1",
        unit: "Kapsul",
        dose: "3×1",
        usage: "Sesudah Makan",
        note: "Harus dihabiskan",
    },
    {
        id: 3,
        name: "Vitamin C 500mg",
        quantity: "1",
        unit: "Tablet",
        dose: "1×1",
        usage: "Pagi Hari",
        note: "Setelah sarapan",
    },
];

const prescriptionNotes = [
    "Gunakan obat sesuai aturan dokter.",
    "Segera hubungi klinik bila muncul reaksi alergi atau keluhan setelah penggunaan obat.",
    "Resep digital ini berlaku untuk pelayanan Farmasi Klinik Adiyasa Medika dan apotek yang berada dalam naungan AMC Group.",
];

const medicineHeaderStyle = {
    background: "#f8fafc",
    color: "#475569",
    fontSize: "11px",
    fontWeight: 600,
    padding: "4px 0",
};

const medicineCellStyle = {
    color: "#0f172a",
    fontSize: "11px",
    padding: "4px 0",
};

function printPrescription() {
    window.print();
}

function goBack() {
    window.history.back();
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap");

.prescription-screen {
    font-family: "DM Sans", sans-serif;
}

.font-serif {
    font-family: "Lora", serif;
}

.prescription-card {
    isolation: isolate;
}

.medicine-table :deep(.el-table__inner-wrapper::before),
.medicine-table :deep(.el-table__border-left-patch) {
    display: none;
}

.medicine-table :deep(.el-table__cell) {
    border-color: #e2e8f0 !important;
}

.medicine-table :deep(.cell) {
    line-height: 1.25;
    padding: 0 0.45rem;
    word-break: normal;
}

.medicine-table :deep(.el-table__body tr:hover > td.el-table__cell) {
    background: #ffffff;
}

@media print {
    @page {
        size: A5 portrait;
        margin: 0;
    }

    * {
        box-shadow: none !important;
        text-shadow: none !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    html,
    body,
    #app {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        min-height: 100% !important;
        background: #ffffff !important;
    }

    .prescription-screen,
    main {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        min-height: 0 !important;
        max-width: none !important;
        background: #ffffff !important;
    }

    .prescription-card {
        margin: 0 !important;
        width: 100% !important;
        min-height: 0 !important;
        border: 0 !important;
        border-radius: 0 !important;
    }

    .medicine-table,
    .medicine-table :deep(.el-table__inner-wrapper),
    .medicine-table :deep(.el-table__header-wrapper),
    .medicine-table :deep(.el-table__body-wrapper),
    .medicine-table :deep(table) {
        width: 100% !important;
        max-width: 100% !important;
    }

    .medicine-table tr {
        break-inside: avoid;
    }

    .medicine-table :deep(.el-table__cell) {
        padding: 2px 0 !important;
    }

    .medicine-table :deep(.cell) {
        padding: 0 4px !important;
        font-size: 9px !important;
        line-height: 1.15 !important;
        white-space: normal !important;
    }
}
</style>
