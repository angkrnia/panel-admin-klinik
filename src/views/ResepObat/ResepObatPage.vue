<template>
    <div class="prescription-screen min-h-screen px-4 py-6 text-[13px] text-slate-950 print:bg-white print:p-0">
        <div class="mx-auto mb-4 flex w-full max-w-2xl items-center justify-between print:hidden">
            <div>
                <h1 class="text-base font-semibold text-slate-900">Preview Resep Dokter</h1>
                <p class="text-sm text-slate-500">{{ printPrescriptions.length }} resep siap cetak</p>
            </div>
            <div class="flex gap-2">
                <button type="button"
                    class="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    @click="goBack">
                    Kembali
                </button>
                <button type="button"
                    class="inline-flex items-center rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="loading || printPrescriptions.length === 0" @click="printPrescription">
                    Cetak Resep
                </button>
                <!-- <button type="button"
                    class="inline-flex items-center rounded-md border border-emerald-600 bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="loading || isDownloadingPdf || printPrescriptions.length === 0" @click="downloadPrescriptionPdf">
                    {{ isDownloadingPdf ? 'Menyiapkan...' : 'Download PDF' }}
                </button> -->
            </div>
        </div>

        <main class="mx-auto w-full max-w-2xl space-y-4 print:max-w-none print:space-y-0 print:border-0 print:shadow-none">
            <div v-if="loading" class="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 print:hidden">Memuat detail resep...</div>
            <div v-else-if="errorMessage" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 print:hidden">{{ errorMessage }}</div>
            <div v-else-if="printPrescriptions.length === 0 && failedPrescriptions.length === 0"
                class="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 print:hidden">Tidak ada resep untuk dicetak.</div>

            <div v-if="failedPrescriptions.length" class="space-y-2 print:hidden">
                <div v-for="failed in failedPrescriptions" :key="`${failed.reference_no}-${failed.prescription_no}`"
                    class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {{ failed.prescription_no || failed.reference_no }} - {{ failed.message || 'Resep gagal dimuat' }}
                </div>
            </div>

            <div ref="pdfContent" class="pdf-content space-y-4 print:space-y-0">
                <section v-for="item in printPrescriptions" :key="`${item.reference_no}-${item.prescription_no}`"
                    class="prescription-card relative overflow-hidden border border-gray-100 bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none">
                    <img src="/images/logo.png" alt=""
                        class="prescription-watermark pointer-events-none absolute left-1/2 top-1/2 z-[1] w-[320px] max-w-[56%] -translate-x-1/2 -translate-y-1/2 opacity-[0.06] mix-blend-multiply print:opacity-[0.05]" />

                    <header class="relative z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-transparent px-8 py-3 text-slate-900 print:px-7 print:py-2">
                        <div class="flex min-w-0 max-w-[calc(100%-9rem)] flex-1 items-center gap-3">
                            <div class="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
                                <img src="/images/logo.png" alt="Logo Klinik" class="h-8 w-8 object-contain" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="font-serif text-[15px] font-semibold leading-tight text-slate-900">{{ item.clinic.name }}</div>
                                <div class="mt-0.5 text-[10px] font-semibold uppercase leading-none tracking-[0.08em] text-slate-700">Praktik Dokter Umum</div>
                                <div class="mt-1 break-words text-[9px] uppercase leading-snug tracking-[0.08em] text-slate-500">{{ item.clinic.address || 'Alamat Klinik' }}
                                </div>
                                <div class="mt-0.5 text-[9px] font-semibold uppercase leading-none tracking-[0.06em] text-slate-700">Resep Dokter</div>
                                <div class="mt-0.5 text-[9px] font-medium text-slate-600">HP {{ item.clinic.phone }}</div>
                            </div>
                        </div>

                        <div class="w-32 flex-shrink-0 text-right">
                            <div class="text-[9px] uppercase tracking-widest text-slate-500">{{ item.prescription_no ? 'No. Resep' : 'No. Referensi' }}</div>
                            <div class="mt-0.5 font-serif text-[13px] text-slate-900">{{ item.prescription_no || item.reference_no || '-' }}</div>
                            <div class="mt-0.5 text-[10px] text-slate-500">{{ formatPrescriptionDate(item.visit_date) }}</div>
                        </div>
                    </header>

                    <div class="prescription-body relative px-8 pt-5 print:px-7 print:py-3">
                        <section class="mb-3 grid grid-cols-2 gap-6 pt-0.5">
                            <div>
                                <div class="mb-1.5 text-[10px] font-medium uppercase leading-[1.1] tracking-widest text-gray-400">
                                    Data Pasien
                                </div>
                                <div class="mb-1 font-serif text-base font-semibold leading-tight text-gray-900">{{ item.patient.name }}</div>
                                <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 leading-[1.2]">
                                    <template v-for="info in patientInfo(item.patient)" :key="info.label">
                                        <span class="text-[11px] text-gray-400">{{ info.label }}</span>
                                        <span class="text-[11px] font-medium text-gray-600">{{ info.value }}</span>
                                    </template>
                                </div>
                            </div>

                            <div class="flex flex-col justify-between border-l border-slate-100 pl-6">
                                <div>
                                    <div class="mb-1.5 text-[10px] font-medium uppercase leading-[1.1] tracking-widest text-gray-400">
                                        Dokter Pemeriksa
                                    </div>
                                    <div class="font-serif text-sm font-semibold text-gray-900">{{ item.doctor.name }}</div>
                                    <div class="mb-1.5 mt-0.5 text-[10px] text-gray-400">{{ item.doctor.unit }}</div>
                                    <div class="text-[10px] leading-tight text-gray-400">
                                        SIP {{ item.doctor.sip }}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="mb-2">
                            <div class="mb-1.5 text-[10px] font-medium uppercase tracking-widest text-gray-400">Diagnosa</div>
                            <div class="text-[13px] font-medium text-gray-800">{{ item.patient.diagnosis || '-' }}</div>
                        </section>

                        <section v-if="item.medicines.length" class="mb-2 mt-0.5">
                            <div class="mb-2.5 text-[10px] font-medium uppercase leading-[1.1] tracking-widest text-gray-400">
                                OBAT & TERAPI
                            </div>

                            <el-table :data="item.medicines" class="medicine-table overflow-hidden rounded-lg text-[11px] print:hidden" border size="small"
                                :header-cell-style="medicineHeaderStyle" :cell-style="medicineCellStyle">
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

                            <table class="pdf-medicine-table hidden w-full table-fixed border-collapse text-[9px] leading-tight print:table">
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
                                    <tr v-for="medicine in item.medicines" :key="`print-${item.prescription_no}-${medicine.id}`" class="break-inside-avoid">
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

                        <section v-if="item.compound_medicines.length" class="mb-2 mt-3">
                            <div class="mb-2.5 text-[10px] font-medium uppercase leading-[1.1] tracking-widest text-gray-400">
                                Racikan Puyer
                            </div>

                            <div class="space-y-2">
                                <div v-for="powder in item.compound_medicines" :key="`${item.prescription_no}-${powder.id}`"
                                    class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] leading-snug print:break-inside-avoid print:rounded-none print:px-2 print:py-1 print:text-[9px]">
                                    <div class="mb-1 flex items-start justify-between gap-3 border-b border-slate-100 pb-1">
                                        <div>
                                            <div class="font-serif text-sm font-semibold text-slate-900 print:text-[11px]">{{ powder.name }}</div>
                                            <div class="text-[10px] text-slate-500 print:text-[8px]">{{ powder.form }}</div>
                                        </div>
                                        <div
                                            class="whitespace-nowrap rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 print:bg-white print:px-0 print:text-[8px]">
                                            {{
                                            powder.quantity }}</div>
                                    </div>

                                    <div class="mb-0.5 text-[10px] font-semibold text-slate-600 print:text-[8px]">Komposisi</div>
                                    <div class="space-y-0.5 pl-1">
                                        <div v-for="component in powder.composition" :key="`${item.prescription_no}-${powder.id}-${component.name}`"
                                            class="flex items-baseline gap-2">
                                            <span>{{ component.name }}</span>
                                            <span class="min-w-0 flex-1 border-b border-dotted border-slate-300"></span>
                                            <span class="whitespace-nowrap text-slate-600">{{ formatCompoundDose(component.dose) }}</span>
                                        </div>
                                    </div>

                                    <div class="mt-1.5 border-t border-slate-100 pt-1 text-slate-700">
                                        <div class="text-slate-600">{{ powder.instruction }}</div>
                                        <div class="text-[12px] font-semibold text-slate-900 print:text-[10px]">{{ powder.signa }}</div>
                                        <div v-if="powder.note" class="italic text-slate-500">{{ powder.note }}</div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <footer class="relative z-10 flex items-center justify-between gap-6 px-8 py-3 text-xs print:px-7 print:py-3">
                        <div class="min-w-0 max-w-md flex-1">
                            <div class="mb-1.5 text-[9px] font-medium uppercase tracking-widest text-gray-400">
                                Catatan
                            </div>
                            <div class="space-y-1 border-l-2 border-slate-200 pl-3">
                                <div v-for="note in item.notes" :key="note" class="flex gap-2">
                                    <div class="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-blue-600"></div>
                                    <p class="text-[10px] leading-snug text-gray-600">{{ note }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="min-w-40 text-right">
                            <div class="mb-1.5 text-[9px] uppercase tracking-widest text-gray-400">Dokter Pemeriksa</div>
                            <div class="mb-2 ml-auto h-10 w-32 border-b border-slate-300"></div>
                            <div class="font-serif text-[13px] font-semibold text-gray-900">{{ item.doctor.name }}</div>
                            <div class="mt-0.5 text-[10px] text-gray-400">{{ item.doctor.unit }}</div>
                            <div class="mt-0.5 text-[9px] text-gray-400">SIP {{ item.doctor.sip }}</div>
                        </div>
                    </footer>
                </section>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { computed, nextTick, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getPrescriptionPrintDetail } from "../../api/prescriptionApi";

const fallbackClinic = {
    name: "Klinik Adiyasa Medika",
    address: "Jl. Raya Cisoka - Adiyasa RW.6, Cikuya, Kec. Solear, Kabupaten Tangerang, Banten 15730",
    phone: "082125399860",
};
const prescriptionDoctor = {
    name: "dr. Friska Yeni Sinamo",
    sip: "B/400.7.22.2/2084/XII-DPMPTSP/2025",
    unit: "Dokter Umum",
};
const fallbackNotes = [
    "Gunakan obat sesuai aturan dokter.",
    "Segera hubungi klinik bila muncul reaksi alergi atau keluhan setelah penggunaan obat.",
];
const medicineColumnWidths = {
    quantity: 48,
    name: 210,
    unit: 70,
    dose: 64,
    usage: 116,
    note: 112,
};
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

const loading = ref(false);
const isDownloadingPdf = ref(false);
const errorMessage = ref("");
const prescriptionDetails = ref([]);
const pdfContent = ref(null);
const route = useRoute();

const printPrescriptions = computed(() => prescriptionDetails.value.filter((item) => item.status !== false));
const failedPrescriptions = computed(() => prescriptionDetails.value.filter((item) => item.status === false));

function getSelectedPrescriptionPrintPatients() {
    try {
        const routeItems = String(route.query.items || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
            .map((item) => {
                const [referenceNo, prescriptionNo] = item.split(":");
                return {
                    reference_no: referenceNo,
                    prescription_no: prescriptionNo,
                };
            })
            .filter((item) => item.reference_no && item.prescription_no);

        if (routeItems.length) return routeItems;

        const bulkData = JSON.parse(sessionStorage.getItem("selectedPrescriptionPrintPatients")) || [];
        if (Array.isArray(bulkData) && bulkData.length) return bulkData;

        const singleData = JSON.parse(sessionStorage.getItem("selectedPrescriptionPrintPatient")) || null;
        return singleData ? [singleData] : [];
    } catch (error) {
        return [];
    }
}

function formatPrescriptionDate(dateString) {
    if (!dateString) return "-";

    const visitDate = new Date(dateString);
    if (Number.isNaN(visitDate.getTime())) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(visitDate);
}

function patientInfo(patient) {
    return [
        { label: "No. RM", value: patient.record_no || "-" },
        { label: "No. HP", value: patient.phone || "-" },
        { label: "Lahir", value: patient.birth_date || "-" },
        { label: "Usia", value: patient.age || "-" },
        { label: "Jenis Kelamin", value: patient.gender || "-" },
        { label: "Tinggi / Berat", value: patient.height_weight || "-" },
        { label: "Alergi", value: patient.allergy || "-" },
    ];
}

function normalizePrescriptionDetail(item) {
    if (item.status === false) return item;

    return {
        ...item,
        reference_no: safeText(item.reference_no),
        prescription_no: safeText(item.prescription_no),
        clinic: { ...fallbackClinic, ...(item.clinic || {}), phone: fallbackClinic.phone },
        patient: item.patient || {},
        doctor: prescriptionDoctor,
        medicines: sortMedicinesByDose(item.medicines || []),
        compound_medicines: item.compound_medicines || [],
        notes: item.notes?.length ? item.notes : fallbackNotes,
    };
}

function normalizeDoseSortValue(dose) {
    const value = safeText(dose);
    return value && value !== "-" ? value.toLowerCase() : null;
}

function sortMedicinesByDose(medicines) {
    return [...medicines].sort((firstMedicine, secondMedicine) => {
        const firstDose = normalizeDoseSortValue(firstMedicine.dose);
        const secondDose = normalizeDoseSortValue(secondMedicine.dose);

        if (!firstDose && !secondDose) return 0;
        if (!firstDose) return 1;
        if (!secondDose) return -1;

        return firstDose.localeCompare(secondDose, "id-ID", { numeric: true, sensitivity: "base" });
    });
}

function formatCompoundDose(dose) {
    const value = safeText(dose);
    const match = value.match(/^([\d.,]+)\s*strip$/i);
    if (!match) return value || "-";

    const tabletCount = Number(match[1].replace(",", ".")) * 10;
    if (!Number.isFinite(tabletCount)) return value;

    return `${Number.isInteger(tabletCount) ? tabletCount : tabletCount.toLocaleString("id-ID")} tab`;
}

function safeText(value) {
    if (value === null || value === undefined) return "";

    const text = String(value).trim();
    return text.toLowerCase() === "null" ? "" : text;
}

async function fetchPrescriptionDetails() {
    const selectedPrescriptions = getSelectedPrescriptionPrintPatients();
    if (!selectedPrescriptions.length) {
        errorMessage.value = "Belum ada resep yang dipilih.";
        return;
    }

    loading.value = true;
    errorMessage.value = "";

    try {
        const response = await getPrescriptionPrintDetail({
            prescriptions: selectedPrescriptions.map((item) => ({
                reference_no: item.reference_no,
                prescription_no: item.prescription_no,
            })),
        });
        prescriptionDetails.value = (response.data.data || []).map(normalizePrescriptionDetail);
    } catch (error) {
        prescriptionDetails.value = [];
        errorMessage.value = error?.response?.data?.message || "Gagal mengambil detail cetak resep.";
    } finally {
        loading.value = false;
    }
}

function printPrescription() {
    window.print();
}

function prescriptionPdfFilename() {
    const firstPrescription = printPrescriptions.value[0];
    const identifier = firstPrescription?.prescription_no || firstPrescription?.reference_no || "resep-obat";
    const suffix = printPrescriptions.value.length > 1 ? `-${printPrescriptions.value.length}-resep` : "";

    return `resep-obat-${identifier}${suffix}.pdf`.replace(/[\\/:*?"<>|\s]+/g, "-").toLowerCase();
}

function createPdfExportElement() {
    const clone = pdfContent.value.cloneNode(true);
    clone.classList.add("pdf-export-content");
    clone.querySelectorAll(".medicine-table").forEach((table) => table.remove());
    clone.querySelectorAll(".pdf-medicine-table").forEach((table) => {
        table.classList.remove("hidden");
        table.style.display = "table";
        table.style.width = "100%";
        table.style.tableLayout = "fixed";
    });

    const wrapper = document.createElement("div");
    wrapper.className = "pdf-export-wrapper";
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    return wrapper;
}

async function downloadPrescriptionPdf() {
    if (!pdfContent.value || printPrescriptions.value.length === 0) return;

    isDownloadingPdf.value = true;

    try {
        document.body.classList.add("pdf-exporting");
        await nextTick();

        const { default: html2pdf } = await import("html2pdf.js");
        const pdfElement = createPdfExportElement();

        await html2pdf()
            .set({
                margin: 0,
                filename: prescriptionPdfFilename(),
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff", windowWidth: 560 },
                jsPDF: { unit: "mm", format: [148, 210], orientation: "portrait" },
                pagebreak: { mode: ["css", "legacy"] },
            })
            .from(pdfElement)
            .save();

        pdfElement.remove();
    } catch (error) {
        ElMessage.error("Gagal membuat PDF resep.");
    } finally {
        document.querySelectorAll(".pdf-export-wrapper").forEach((element) => element.remove());
        document.body.classList.remove("pdf-exporting");
        isDownloadingPdf.value = false;
    }
}

function goBack() {
    window.history.back();
}

onMounted(fetchPrescriptionDetails);
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

.prescription-watermark {
    top: 50%;
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

:global(body.pdf-exporting) .prescription-screen,
:global(body.pdf-exporting) main,
:global(body.pdf-exporting) .pdf-content {
    margin: 0 !important;
    padding: 0 !important;
    width: 148mm !important;
    max-width: 148mm !important;
    background: #ffffff !important;
}

:global(.pdf-export-wrapper) {
    position: absolute;
    left: 0;
    top: 0;
    width: 148mm;
    background: #ffffff;
    pointer-events: none;
    z-index: -1;
}

:global(.pdf-export-content) {
    width: 148mm !important;
    max-width: 148mm !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
}

:global(body.pdf-exporting) .prescription-card,
:global(.pdf-export-wrapper) .prescription-card {
    display: block !important;
    box-sizing: border-box !important;
    margin: 0 !important;
    width: 148mm !important;
    max-width: 148mm !important;
    min-height: 205mm !important;
    overflow: visible !important;
    position: relative !important;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
}

:global(body.pdf-exporting) .prescription-body,
:global(.pdf-export-wrapper) .prescription-body {
    padding-bottom: 34mm !important;
}

:global(body.pdf-exporting) .prescription-card footer,
:global(.pdf-export-wrapper) .prescription-card footer {
    position: absolute !important;
    right: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
    margin-top: 0 !important;
}

:global(.pdf-export-wrapper) .prescription-card+.prescription-card {
    break-before: page !important;
}

:global(body.pdf-exporting) .medicine-table,
:global(.pdf-export-wrapper) .medicine-table {
    display: none !important;
}

:global(body.pdf-exporting) .pdf-medicine-table,
:global(.pdf-export-wrapper) .pdf-medicine-table {
    display: table !important;
    width: 100% !important;
    max-width: 100% !important;
    table-layout: fixed !important;
}

:global(body.pdf-exporting) table,
:global(body.pdf-exporting) th,
:global(body.pdf-exporting) td,
:global(.pdf-export-wrapper) table,
:global(.pdf-export-wrapper) th,
:global(.pdf-export-wrapper) td {
    box-sizing: border-box !important;
    word-break: break-word !important;
    white-space: normal !important;
    overflow-wrap: anywhere !important;
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
        display: block !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        width: 100% !important;
        min-height: 205mm !important;
        position: relative !important;
        border: 0 !important;
        border-radius: 0 !important;
    }

    .prescription-body {
        padding-bottom: 34mm !important;
    }

    .prescription-card footer {
        position: absolute !important;
        right: 0 !important;
        bottom: 0 !important;
        left: 0 !important;
        margin-top: 0 !important;
    }

    .prescription-card:last-child {
        break-after: auto !important;
    }

    .prescription-card+.prescription-card {
        break-before: page !important;
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
