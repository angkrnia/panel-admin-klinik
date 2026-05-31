<template>
    <section class="p-4 space-y-4">
        <TitleDashboard title="Report Fee Dokter" />

        <el-card shadow="never">
            <el-form ref="filterFormRef" :model="filters" :rules="rules" label-position="top">
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <el-form-item label="Date from" prop="date_from">
                        <el-date-picker v-model="filters.date_from" type="date" value-format="YYYY-MM-DD" placeholder="Pilih tanggal" class="w-full" />
                    </el-form-item>
                    <el-form-item label="Date to" prop="date_to">
                        <el-date-picker v-model="filters.date_to" type="date" value-format="YYYY-MM-DD" placeholder="Pilih tanggal" class="w-full" />
                    </el-form-item>
                    <el-form-item label="Time from" prop="time_from">
                        <el-time-picker v-model="filters.time_from" format="HH:mm" value-format="HH:mm" placeholder="00:00" class="w-full" />
                    </el-form-item>
                    <el-form-item label="Time to" prop="time_to">
                        <el-time-picker v-model="filters.time_to" format="HH:mm" value-format="HH:mm" placeholder="23:59" class="w-full" />
                    </el-form-item>
                    <el-form-item label="Dokter">
                        <el-select v-model="filters.doctor_id" clearable filterable placeholder="Semua dokter" class="w-full">
                            <el-option v-for="doctor in doctorOptions" :key="doctor.id" :label="doctor.fullname || doctor.name" :value="doctor.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Jenis item">
                        <el-select v-model="filters.item_type" class="w-full">
                            <el-option label="Semua" value="all" />
                            <el-option label="Layanan" value="layanan" />
                            <el-option label="Tindakan" value="tindakan" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Per page">
                        <el-select v-model="perPage" class="w-full" @change="onPerPageChange">
                            <el-option v-for="size in perPageOptions" :key="size" :label="size" :value="size" />
                        </el-select>
                    </el-form-item>
                    <div class="flex items-end gap-2 pb-[18px]">
                        <el-button type="primary" :loading="loading" @click="applyFilter">Terapkan Filter</el-button>
                        <el-button :disabled="loading" @click="resetFilter">Reset</el-button>
                        <el-button :disabled="!appliedFilters || loading" @click="exportReport">Export Excel</el-button>
                    </div>
                </div>

                <el-collapse class="mt-2">
                    <el-collapse-item title="Advanced filter" name="advanced">
                        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pt-2">

                            <el-form-item label="Service">
                                <el-select v-model="filters.service_id" clearable filterable placeholder="Semua service" class="w-full">
                                    <el-option v-for="service in serviceOptions" :key="service.id" :label="service.name" :value="service.id" />
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </el-form>
        </el-card>

        <el-alert v-if="isDirty && hasLoaded" title="Filter berubah, klik Terapkan Filter." type="warning" show-icon :closable="false" />
        <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon :closable="false" />

        <div v-if="loading" class="space-y-4">
            <el-skeleton :rows="4" animated />
            <el-skeleton :rows="8" animated />
        </div>

        <el-empty v-else-if="!hasLoaded" description="Pilih filter untuk menampilkan report." />

        <template v-else>
            <el-empty v-if="!rows.length" description="Data report tidak ditemukan." />

            <div v-else class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                    <el-card shadow="never" class="bg-blue-50 border-blue-200">
                        <p class="text-sm text-blue-700">Total Fee Dokter</p>
                        <p class="text-2xl font-bold text-blue-700">{{ formatRp(summary.total_doctor_fee) }}</p>
                    </el-card>
                    <el-card shadow="never"><p class="text-sm text-gray-500">Gross Amount</p><p class="text-xl font-semibold">{{ formatRp(summary.gross_amount) }}</p></el-card>
                    <el-card shadow="never"><p class="text-sm text-gray-500">Total Transaksi</p><p class="text-xl font-semibold">{{ formatNumber(summary.total_transaction) }}</p></el-card>
                    <el-card shadow="never"><p class="text-sm text-gray-500">Total Antrian</p><p class="text-xl font-semibold">{{ formatNumber(summary.total_queue) }}</p></el-card>
                    <el-card shadow="never"><p class="text-sm text-gray-500">Total Item</p><p class="text-xl font-semibold">{{ formatNumber(summary.total_qty) }}</p></el-card>
                </div>

                <div class="flex flex-wrap gap-2">
                    <el-tag>{{ periodChip }}</el-tag>
                    <el-tag v-if="selectedDoctorName" type="success">Dokter: {{ selectedDoctorName }}</el-tag>
                    <el-tag type="info">Jenis: {{ itemTypeLabel(appliedFilters.item_type) }}</el-tag>
                    <el-tag v-if="selectedServiceName" type="success">Service: {{ selectedServiceName }}</el-tag>
                </div>

                <el-card shadow="never">
                    <div class="flex items-center justify-start mb-3">
                        <el-switch v-model="isExpandAll" active-text="Expand all" inactive-text="Collapse" @change="toggleExpandAll" />
                    </div>
                    <el-table ref="tableRef" :data="rows" border stripe class="w-full" row-key="queue_id">
                        <el-table-column type="expand" width="48">
                            <template #default="{ row }">
                                <div class="p-3 bg-slate-50">
                                    <el-table :data="row.items || []" border size="small" class="w-full">
                                        <el-table-column label="Jenis" width="110"><template #default="{ row: item }"><el-tag size="small">{{ itemTypeLabel(item.item_type) }}</el-tag></template></el-table-column>
                                        <el-table-column prop="item_name" label="Item" min-width="220" />
                                        <el-table-column label="Qty" width="90" align="right"><template #default="{ row: item }">{{ formatNumber(item.qty) }}</template></el-table-column>
                                        <el-table-column label="Harga" min-width="130" align="right"><template #default="{ row: item }">{{ formatRp(item.price) }}</template></el-table-column>
                                        <el-table-column label="Subtotal" min-width="130" align="right"><template #default="{ row: item }">{{ formatRp(item.subtotal) }}</template></el-table-column>
                                        <el-table-column label="Fee Dokter" min-width="130" align="right"><template #default="{ row: item }">{{ formatRp(item.doctor_fee) }}</template></el-table-column>
                                        <el-table-column label="Total Fee" min-width="130" align="right"><template #default="{ row: item }"><span class="font-bold">{{ formatRp(item.total_doctor_fee) }}</span></template></el-table-column>
                                    </el-table>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="Waktu transaksi" min-width="170"><template #default="{ row }">{{ formatDateTime(row.transaction_datetime) }}</template></el-table-column>
                        <el-table-column prop="receipt_number" label="Invoice" min-width="150" />
                        <el-table-column prop="queue_number" label="Antrian" min-width="120" />
                        <el-table-column label="Pasien" min-width="180"><template #default="{ row }"><p class="font-medium">{{ row.patient_name || '-' }}</p><p class="text-xs text-gray-400">{{ row.patient_record_no || '-' }}</p></template></el-table-column>
                        <el-table-column prop="doctor_name" label="Dokter" min-width="160" />
                        <el-table-column label="Item" min-width="120" align="right"><template #default="{ row }">{{ formatNumber(row.summary?.total_qty || row.items?.length || 0) }}</template></el-table-column>
                        <el-table-column label="Gross Amount" min-width="140" align="right"><template #default="{ row }">{{ formatRp(row.summary?.gross_amount) }}</template></el-table-column>
                        <el-table-column label="Fee Layanan" min-width="130" align="right"><template #default="{ row }">{{ formatRp(row.summary?.total_layanan_fee) }}</template></el-table-column>
                        <el-table-column label="Fee Tindakan" min-width="130" align="right"><template #default="{ row }">{{ formatRp(row.summary?.total_tindakan_fee) }}</template></el-table-column>
                        <el-table-column label="Total Fee" min-width="130" align="right"><template #default="{ row }"><span class="font-bold">{{ formatRp(row.summary?.total_doctor_fee) }}</span></template></el-table-column>
                        <el-table-column prop="payment_method" label="Pembayaran" min-width="130" />
                        <el-table-column prop="sales_status" label="Status" min-width="120" />
                    </el-table>

                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
                        <p class="text-sm text-gray-500">{{ paginationInfo }}</p>
                        <el-pagination v-if="isPaginated" background layout="prev, pager, next" :total="total" :page-size="perPage" :current-page="currentPage" @current-change="changePage" />
                    </div>
                </el-card>
            </div>
        </template>
    </section>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import TitleDashboard from '../../components/TitleDashboard.vue';
import { APISelectTipeLayanan } from '../../api/apiHelper';
import { getDokterSelect } from '../../api/dokterApi';
import { APIExportDoctorFeeDetail, APIGetDoctorFeeDetail } from '../../api/apiReport';
import useDownloadFile from '../../composables/useDownloadFile';

const today = new Date().toISOString().slice(0, 10);
const perPageOptions = [10, 25, 50, 100];
const defaultFilters = () => ({ date_from: today, date_to: today, time_from: '00:00', time_to: '23:59', doctor_id: null, item_type: 'all', service_id: null });

const filterFormRef = ref(null);
const filters = ref(defaultFilters());
const appliedFilters = ref(null);
const doctorOptions = ref([]);
const serviceOptions = ref([]);
const summary = ref({});
const rows = ref([]);
const tableRef = ref(null);
const isExpandAll = ref(false);
const loading = ref(false);
const hasLoaded = ref(false);
const errorMessage = ref('');
const isDirty = ref(false);
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);
const isPaginated = ref(false);
const { downloadBlobFile } = useDownloadFile();

const rules = {
    date_from: [{ required: true, message: 'Date from wajib diisi', trigger: 'change' }],
    date_to: [{ required: true, message: 'Date to wajib diisi', trigger: 'change' }],
    time_from: [{ required: true, message: 'Time from wajib diisi', trigger: 'change' }],
    time_to: [{ required: true, message: 'Time to wajib diisi', trigger: 'change' }],
};

const periodChip = computed(() => appliedFilters.value ? `Periode: ${formatDate(appliedFilters.value.date_from)} ${appliedFilters.value.time_from} - ${formatDate(appliedFilters.value.date_to)} ${appliedFilters.value.time_to}` : '');
const selectedDoctorName = computed(() => doctorOptions.value.find((item) => item.id === appliedFilters.value?.doctor_id)?.fullname || doctorOptions.value.find((item) => item.id === appliedFilters.value?.doctor_id)?.name || '');
const selectedServiceName = computed(() => serviceOptions.value.find((item) => item.id === appliedFilters.value?.service_id)?.name || '');
const paginationInfo = computed(() => {
    if (!total.value) return '0 data';
    const from = ((currentPage.value - 1) * perPage.value) + 1;
    const to = Math.min(currentPage.value * perPage.value, total.value);
    return `${formatNumber(from)} - ${formatNumber(to)} dari ${formatNumber(total.value)} data`;
});

watch(filters, () => { if (hasLoaded.value) isDirty.value = true; }, { deep: true });

async function applyFilter() {
    const valid = await filterFormRef.value.validate().catch(() => false);
    if (!valid) return;
    appliedFilters.value = normalizeParams(filters.value);
    isExpandAll.value = false;
    currentPage.value = 1;
    await fetchReport();
}

async function fetchReport() {
    if (!appliedFilters.value) return;
    loading.value = true;
    errorMessage.value = '';
    try {
        const response = await APIGetDoctorFeeDetail({ ...appliedFilters.value, group_by: 'queue', page: currentPage.value, per_page: perPage.value });
        const normalized = normalizeResponse(response.data || {});
        summary.value = normalized.summary;
        rows.value = normalized.rows;
        total.value = normalized.total;
        currentPage.value = normalized.currentPage;
        perPage.value = normalized.perPage;
        isPaginated.value = normalized.isPaginated;
        hasLoaded.value = true;
        isDirty.value = false;
        if (isExpandAll.value) expandAllRows();
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Gagal mengambil report fee dokter.';
        rows.value = [];
        summary.value = {};
        total.value = 0;
        isPaginated.value = false;
        hasLoaded.value = true;
    } finally {
        loading.value = false;
    }
}

function toggleExpandAll(value) {
    if (value) {
        expandAllRows();
        return;
    }
    collapseAllRows();
}

function expandAllRows() {
    nextTick(() => {
        rows.value.forEach((row) => tableRef.value?.toggleRowExpansion(row, true));
    });
}

function collapseAllRows() {
    nextTick(() => {
        rows.value.forEach((row) => tableRef.value?.toggleRowExpansion(row, false));
    });
}
function exportReport() {
    if (!appliedFilters.value) return;
    downloadBlobFile(APIExportDoctorFeeDetail, appliedFilters.value, "doctor-fees.xlsx");
}
function normalizeParams(data) {
    return Object.fromEntries(Object.entries({ ...data }).filter(([, value]) => value !== '' && value !== null && value !== undefined));
}

function normalizeResponse(payload) {
    const report = payload.data && (payload.summary || payload.data.data) ? payload : payload.data || payload;
    const dataSource = report.data || report.details || report.items || report;
    const tableRows = Array.isArray(dataSource) ? dataSource : dataSource.data || [];
    return {
        summary: report.summary || {},
        rows: tableRows,
        total: dataSource.total || report.total || tableRows.length,
        currentPage: dataSource.current_page || report.current_page || currentPage.value,
        perPage: Number(dataSource.per_page || report.per_page || perPage.value),
        isPaginated: Boolean(dataSource.total || report.total || dataSource.current_page || report.current_page),
    };
}

function resetFilter() {
    filters.value = defaultFilters();
    appliedFilters.value = null;
    summary.value = {};
    rows.value = [];
    total.value = 0;
    isPaginated.value = false;
    currentPage.value = 1;
    hasLoaded.value = false;
    errorMessage.value = '';
    isDirty.value = false;
    filterFormRef.value?.clearValidate();
}

function changePage(page) {
    isExpandAll.value = false;
    currentPage.value = page;
    fetchReport();
}

function onPerPageChange() {
    if (!hasLoaded.value || !isPaginated.value) return;
    isExpandAll.value = false;
    currentPage.value = 1;
    fetchReport();
}

function formatRp(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0));
}

function formatNumber(value) {
    return new Intl.NumberFormat('id-ID').format(Number(value || 0));
}

function formatDate(value) {
    if (!value) return '-';
    return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value) {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function itemTypeLabel(value) {
    if (value === 'all') return 'Semua';
    if (value === 'layanan') return 'Layanan';
    if (value === 'tindakan') return 'Tindakan';
    return value || '-';
}

async function loadFilterOptions() {
    try {
        const [doctorResponse, serviceResponse] = await Promise.all([getDokterSelect(), APISelectTipeLayanan()]);
        doctorOptions.value = doctorResponse.data?.data || [];
        serviceOptions.value = serviceResponse.data?.data || [];
    } catch (error) {
        errorMessage.value = 'Gagal memuat opsi filter.';
    }
}

onMounted(loadFilterOptions);
</script>














