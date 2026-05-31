<template>
    <div class="p-4">
        <div class="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div class="mb-4 flex flex-col gap-1">
                <h1 class="text-lg font-semibold text-slate-900">Cari Pasien untuk Cetak Resep</h1>
                <p class="text-sm text-slate-500">Cari resep berdasarkan pasien, nomor RM, nomor resep, atau invoice.</p>
            </div>

            <div class="grid grid-cols-1 gap-3 md:grid-cols-[1fr_280px_240px_auto]">
                <el-input v-model="search" clearable placeholder="Cari nama pasien / no RM / no resep / no invoice" size="large" />
                <el-date-picker v-model="dateRange" class="!w-full" clearable end-placeholder="Sampai tanggal" format="DD/MM/YYYY" range-separator="-" size="large" start-placeholder="Dari tanggal" type="daterange" value-format="YYYY-MM-DD" />
                <el-select v-model="doctorId" class="!w-full" clearable filterable placeholder="Dokter" size="large">
                    <el-option v-for="doctor in doctorList" :key="doctor.id" :label="doctor.fullname" :value="doctor.id" />
                </el-select>
                <el-button :disabled="selectedRows.length === 0" size="large" type="primary" @click="printSelectedPrescription">Cetak Resep</el-button>
            </div>

            <el-alert v-if="errorMessage" :closable="false" class="mt-3" show-icon :title="errorMessage" type="error" />
        </div>

        <div class="rounded-lg border border-slate-200 bg-white shadow-sm">
            <el-table ref="tableRef" v-loading="loading" :data="rows" border class="w-full" empty-text="Tidak ada data resep" highlight-current-row @row-click="selectRow" @selection-change="onSelectionChange">
                <el-table-column type="selection" width="44" />
                <el-table-column label="No Resep" min-width="160" prop="prescription_no" />
                <el-table-column label="Reference / Invoice" min-width="170" prop="reference_no" />
                <el-table-column label="Nama Pasien" min-width="190" prop="patient_name" />
                <el-table-column label="No HP" min-width="140" prop="phone" />
                <el-table-column label="No RM" min-width="100" prop="record_no" />
                <el-table-column label="Dokter" min-width="140" prop="doctor" />
                <el-table-column label="Tanggal Kunjungan" min-width="170">
                    <template #default="{ row }">
                        {{ formatVisitDate(row.visit_date) }}
                    </template>
                </el-table-column>
            </el-table>

            <div class="flex flex-col gap-3 border-t border-slate-100 p-3 md:flex-row md:items-center md:justify-between">
                <div class="text-sm text-slate-500">Total {{ pagination.total }} data</div>
                <el-pagination background layout="prev, pager, next" :current-page="pagination.current_page" :page-size="pagination.per_page" :total="pagination.total" @current-change="changePage" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { getPrescriptionPrintPatients } from "../../api/prescriptionApi";
import { doctorListHelper } from "../../helpers/utils";

const router = useRouter();
const tableRef = ref(null);
const search = ref("");
const dateRange = ref([]);
const doctorId = ref(null);
const doctorList = ref([]);
const rows = ref([]);
const selectedRows = ref([]);
const loading = ref(false);
const errorMessage = ref("");
const page = ref(1);
const limit = 25;
const pagination = ref({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: limit,
});

let debounceTimer = null;

function formatVisitDate(dateString) {
    if (!dateString) return "-";

    const visitDate = new Date(dateString);
    if (Number.isNaN(visitDate.getTime())) return "-";

    const parts = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).formatToParts(visitDate).reduce((result, part) => {
        result[part.type] = part.value;
        return result;
    }, {});

    return `${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute}`;
}

function normalizeSelectedRow(row) {
    return {
        reference_no: row.reference_no,
        prescription_no: row.prescription_no,
        patient_name: row.patient_name,
        phone: row.phone,
        record_no: row.record_no,
        doctor: row.doctor,
        visit_date: row.visit_date,
    };
}

async function fetchPrescriptionPrintPatients() {
    loading.value = true;
    errorMessage.value = "";

    try {
        const params = {
            search: search.value || undefined,
            start_date: dateRange.value?.[0] || undefined,
            end_date: dateRange.value?.[1] || undefined,
            doctor_id: doctorId.value || undefined,
            page: page.value,
            limit,
        };
        const response = await getPrescriptionPrintPatients(params);
        const responseData = response.data.data;

        rows.value = responseData.data || [];
        pagination.value = {
            current_page: responseData.current_page || 1,
            last_page: responseData.last_page || 1,
            total: responseData.total || 0,
            per_page: responseData.per_page || limit,
        };
        selectedRows.value = [];
        tableRef.value?.clearSelection();
    } catch (error) {
        rows.value = [];
        errorMessage.value = error?.response?.data?.message || "Gagal mengambil data resep.";
    } finally {
        loading.value = false;
    }
}

function queueSearch() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        page.value = 1;
        fetchPrescriptionPrintPatients();
    }, 400);
}

function changePage(nextPage) {
    page.value = nextPage;
    fetchPrescriptionPrintPatients();
}

function selectRow(row) {
    tableRef.value?.toggleRowSelection(row);
}

function onSelectionChange(selection) {
    selectedRows.value = selection;
}

function printSelectedPrescription() {
    if (selectedRows.value.length === 0) {
        ElMessage.warning("Pilih resep yang akan dicetak.");
        return;
    }

    const selectedPrescriptionRows = selectedRows.value.map(normalizeSelectedRow);
    sessionStorage.setItem("selectedPrescriptionPrintPatients", JSON.stringify(selectedPrescriptionRows));
    sessionStorage.setItem("selectedPrescriptionPrintPatient", JSON.stringify(selectedPrescriptionRows[0]));
    router.push({
        name: "resep-obat-cetak",
        query: {
            items: selectedPrescriptionRows.map((item) => `${item.reference_no}:${item.prescription_no}`).join(","),
        },
    });
}

watch(search, queueSearch);
watch([dateRange, doctorId], () => {
    page.value = 1;
    fetchPrescriptionPrintPatients();
});

onMounted(async () => {
    doctorList.value = await doctorListHelper();
    fetchPrescriptionPrintPatients();
});
</script>
