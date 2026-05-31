<template>
    <section class="space-y-4 rounded-lg bg-gray-50 p-3 md:p-4">
        <div class="rounded-lg bg-blue-600 p-4 text-white md:p-5">
            <div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <p class="text-xs font-semibold uppercase tracking-wider text-blue-100">Dashboard Klinik</p>
                    <h1 class="mt-1 text-2xl font-semibold md:text-3xl">Analisis Waktu Kunjungan</h1>
                    <p class="mt-1 max-w-2xl text-sm text-blue-100">Pantau waktu tunggu, durasi pelayanan, dan pembayaran pasien</p>
                </div>

                <div class="grid gap-3 rounded-md bg-blue-500/40 p-3 md:grid-cols-[1fr_1fr_1.2fr_auto]">
                    <label class="space-y-1 text-sm font-medium text-blue-50">
                        <span>Dari</span>
                        <input v-model="visitFilters.date_from" type="date" class="h-10 w-full rounded-md border border-blue-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-1 focus:ring-blue-200" />
                    </label>
                    <label class="space-y-1 text-sm font-medium text-blue-50">
                        <span>Sampai</span>
                        <input v-model="visitFilters.date_to" type="date" class="h-10 w-full rounded-md border border-blue-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-1 focus:ring-blue-200" />
                    </label>
                    <label v-if="doctorOptions.length" class="space-y-1 text-sm font-medium text-blue-50">
                        <span>Dokter</span>
                        <select v-model="visitFilters.doctor" class="h-10 w-full rounded-md border border-blue-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-1 focus:ring-blue-200">
                            <option value="">Semua dokter</option>
                            <option v-for="doctor in doctorOptions" :key="doctor" :value="doctor">{{ doctor }}</option>
                        </select>
                    </label>
                    <button type="button" :disabled="isVisitLoading" class="mt-0 h-10 rounded-md bg-white px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-70 md:mt-6" @click="fetchVisitTimeAnalysis">
                        {{ isVisitLoading ? 'Memuat...' : 'Refresh' }}
                    </button>
                </div>
            </div>
        </div>

        <div v-if="visitErrorMessage" class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ visitErrorMessage }}</div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div v-for="card in visitSummaryCards" :key="card.label" class="rounded-lg border border-gray-200 bg-white p-3">
                <div v-if="isVisitLoading" class="animate-pulse space-y-4">
                    <div class="h-8 w-8 rounded-md bg-slate-100"></div>
                    <div class="h-4 w-24 rounded bg-slate-100"></div>
                    <div class="h-7 w-20 rounded bg-slate-100"></div>
                </div>
                <template v-else>
                    <div class="flex items-start justify-between gap-3">
                        <div :class="['flex h-9 w-9 items-center justify-center rounded-md text-base', card.bg, card.color]">{{ card.icon }}</div>
                        <span class="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">{{ card.type }}</span>
                    </div>
                    <p class="mt-3 text-sm font-medium text-slate-500">{{ card.label }}</p>
                    <h2 class="mt-1 text-xl font-semibold text-slate-900">{{ card.value }}</h2>
                </template>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div class="rounded-lg border border-gray-200 bg-white p-4 xl:col-span-2">
                <h2 class="text-base font-semibold text-slate-900">Distribusi Kunjungan per Jam</h2>
                <p class="text-sm text-slate-500">Total antrian berdasarkan jam kedatangan</p>
                <ChartSkeleton v-if="isVisitLoading" />
                <apexchart v-else-if="hasHourlyArrivals" type="bar" height="330" :options="hourlyChartOptions" :series="hourlyChartSeries" />
                <EmptyState v-else title="Belum ada data kunjungan per jam pada periode ini." />
            </div>

            <div class="rounded-lg border border-gray-200 bg-white p-4">
                <h2 class="text-base font-semibold text-slate-900">Komposisi Status Kunjungan</h2>
                <p class="text-sm text-slate-500">Proporsi status antrian</p>
                <ChartSkeleton v-if="isVisitLoading" />
                <apexchart v-else-if="hasStatusBreakdown" type="donut" height="330" :options="statusChartOptions" :series="statusChartSeries" />
                <EmptyState v-else title="Belum ada status kunjungan pada periode ini." />
            </div>
        </div>

        <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div class="rounded-lg border border-gray-200 bg-white p-4 xl:col-span-2">
                <h2 class="text-base font-semibold text-slate-900">Performa Dokter</h2>
                <p class="text-sm text-slate-500">Diurutkan dari total kunjungan terbesar</p>
                <div v-if="isVisitLoading" class="mt-4 space-y-3"><div v-for="item in 4" :key="item" class="h-16 animate-pulse rounded-md bg-slate-100"></div></div>
                <div v-else-if="filteredDoctorBreakdown.length" class="mt-4 overflow-x-auto">
                    <table class="w-full min-w-[780px] text-left text-sm">
                        <thead class="text-xs uppercase tracking-wide text-slate-400"><tr><th class="px-3 py-3">Dokter</th><th class="px-3 py-3">Total</th><th class="px-3 py-3">Selesai</th><th class="px-3 py-3">Tunggu Vital</th><th class="px-3 py-3">Daftar → Bayar</th><th class="px-3 py-3">Daftar → Selesai</th><th class="px-3 py-3">Status</th></tr></thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="doctor in filteredDoctorBreakdown" :key="doctorName(doctor)" class="text-slate-700">
                                <td class="px-3 py-4 font-semibold text-slate-900">{{ doctorName(doctor) }}</td><td class="px-3 py-4">{{ numberValue(doctor.total_queues) }}</td><td class="px-3 py-4">{{ numberValue(doctor.completed_queues) }}</td><td class="px-3 py-4">{{ formatMinutes(doctor.avg_wait_to_vital_minutes) }}</td><td class="px-3 py-4">{{ formatMinutes(doctor.avg_registration_to_sale_paid_minutes) }}</td><td class="px-3 py-4">{{ formatMinutes(doctor.avg_registration_to_finished_minutes) }}</td><td class="px-3 py-4"><span :class="doctorBadgeClass(doctor)">{{ doctorBadgeText(doctor) }}</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <EmptyState v-else title="Belum ada data performa dokter pada periode ini." />
            </div>

            <div class="rounded-lg border border-gray-200 bg-white p-4">
                <h2 class="text-base font-semibold text-slate-900">Insight Cepat</h2>
                <p class="text-sm text-slate-500">Ringkasan otomatis efisiensi layanan</p>
                <div v-if="isVisitLoading" class="mt-4 space-y-3"><div v-for="item in 3" :key="item" class="h-20 animate-pulse rounded-md bg-slate-100"></div></div>
                <div v-else class="mt-4 space-y-3"><div v-for="insight in visitInsights" :key="insight.text" :class="['rounded-md border p-3 text-sm font-medium', insight.class]"><p>{{ insight.title }}</p><p class="mt-1 text-xs font-normal opacity-80">{{ insight.text }}</p></div></div>
            </div>
        </div>

        <div class="rounded-lg border border-gray-200 bg-white p-4">
            <h2 class="text-base font-semibold text-slate-900">Kunjungan Paling Lama</h2>
            <p class="text-sm text-slate-500">Antrian selesai dengan durasi tertinggi</p>
            <div v-if="isVisitLoading" class="mt-4 space-y-3"><div v-for="item in 5" :key="item" class="h-14 animate-pulse rounded-md bg-slate-100"></div></div>
            <div v-else-if="filteredSlowestQueues.length" class="mt-4 overflow-x-auto">
                <table class="w-full min-w-[1100px] text-left text-sm">
                    <thead class="text-xs uppercase tracking-wide text-slate-400"><tr><th class="px-3 py-3">No Antrian</th><th class="px-3 py-3">Pasien</th><th class="px-3 py-3">No RM</th><th class="px-3 py-3">Dokter</th><th class="px-3 py-3">Registered At</th><th class="px-3 py-3">Finished At</th><th class="px-3 py-3">Sale Created At</th><th class="px-3 py-3">Sale Paid At</th><th class="px-3 py-3">Daftar → Selesai</th><th class="px-3 py-3">Daftar → Sales Dibuat</th><th class="px-3 py-3">Daftar → Bayar</th></tr></thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="queue in filteredSlowestQueues" :key="queueKey(queue)" class="text-slate-700">
                            <td class="px-3 py-4 font-semibold text-slate-900">{{ queue.queue_no || queue.no_antrian || '-' }}</td><td class="px-3 py-4">{{ queue.patient_name || queue.patient?.name || '-' }}</td><td class="px-3 py-4">{{ queue.medical_record_no || queue.no_rm || queue.patient?.no_rm || '-' }}</td><td class="px-3 py-4">{{ doctorName(queue) }}</td><td class="px-3 py-4">{{ formatDateTime(queue.registered_at) }}</td><td class="px-3 py-4">{{ formatDateTime(queue.finished_at) }}</td><td class="px-3 py-4">{{ formatDateTime(queue.sale_created_at) }}</td><td class="px-3 py-4">{{ formatDateTime(queue.sale_paid_at) }}</td><td class="px-3 py-4"><span :class="durationBadgeClass(queue.registration_to_finished_minutes)">{{ formatMinutes(queue.registration_to_finished_minutes) }}</span></td><td class="px-3 py-4"><span :class="durationBadgeClass(queue.registration_to_sale_created_minutes)">{{ formatMinutes(queue.registration_to_sale_created_minutes) }}</span></td><td class="px-3 py-4"><span :class="durationBadgeClass(queue.registration_to_sale_paid_minutes || queue.registration_to_payment_minutes)">{{ formatMinutes(queue.registration_to_sale_paid_minutes || queue.registration_to_payment_minutes) }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <EmptyState v-else title="Belum ada kunjungan selesai pada periode ini." />
        </div>
    </section>
</template>

<script setup>
import { computed, defineComponent, h, ref } from 'vue';
import { APIVisitTimeAnalysis } from '../../api/apiChart';
import { errorMessage as parseErrorMessage } from '../../helpers/catchResp';

const emptyVisitDashboard = { summary: {}, status_breakdown: [], hourly_arrivals: [], doctor_breakdown: [], slowest_queues: [] };
const visitYesterday = new Date();
visitYesterday.setDate(visitYesterday.getDate() - 1);
const visitFilters = ref({ date_from: formatDateInput(visitYesterday), date_to: formatDateInput(new Date()), doctor: '' });
const visitData = ref({ ...emptyVisitDashboard });
const isVisitLoading = ref(false);
const visitErrorMessage = ref('');
const visitSummary = computed(() => visitData.value?.summary || {});
const statusBreakdown = computed(() => normalizeArray(visitData.value?.status_breakdown));
const hourlyArrivals = computed(() => normalizeArray(visitData.value?.hourly_arrivals));
const doctorBreakdown = computed(() => normalizeArray(visitData.value?.doctor_breakdown).sort((a, b) => numberValue(b.total_queues) - numberValue(a.total_queues)));
const slowestQueues = computed(() => normalizeArray(visitData.value?.slowest_queues));
const doctorOptions = computed(() => [...new Set(doctorBreakdown.value.map((doctor) => doctorName(doctor)).filter((name) => name && name !== '-'))]);
const filteredDoctorBreakdown = computed(() => visitFilters.value.doctor ? doctorBreakdown.value.filter((doctor) => doctorName(doctor) === visitFilters.value.doctor) : doctorBreakdown.value);
const filteredSlowestQueues = computed(() => visitFilters.value.doctor ? slowestQueues.value.filter((queue) => doctorName(queue) === visitFilters.value.doctor) : slowestQueues.value);
const visitSummaryCards = computed(() => [
    makeVisitCard('Total Kunjungan', visitSummary.value.total_queues, '👥', 'Data', 'bg-blue-50', 'text-blue-600'),
    makeVisitCard('Selesai', visitSummary.value.completed_queues, '✓', 'Data', 'bg-green-50', 'text-green-600'),
    makeVisitCard('Batal', visitSummary.value.canceled_queues, '×', 'Data', 'bg-red-50', 'text-red-600'),
    makeVisitCard('Observasi', visitSummary.value.observation_queues, '○', 'Data', 'bg-violet-50', 'text-violet-600'),
    makeVisitCard('Sudah Bayar', visitSummary.value.paid_queues, 'Rp', 'Data', 'bg-emerald-50', 'text-emerald-600'),
    makeVisitCard('Rata-rata Tunggu Vital', visitSummary.value.avg_wait_to_vital_minutes, '⏱', 'Durasi', 'bg-amber-50', 'text-amber-600', true),
    makeVisitCard('Rata-rata Daftar → Sales Dibuat', visitSummary.value.avg_registration_to_sale_created_minutes, 'S', 'Durasi', 'bg-indigo-50', 'text-indigo-600', true),
    makeVisitCard('Rata-rata Daftar → Bayar Selesai', visitSummary.value.avg_registration_to_sale_paid_minutes || visitSummary.value.avg_registration_to_payment_minutes, 'B', 'Durasi', 'bg-cyan-50', 'text-cyan-600', true),
    makeVisitCard('Rata-rata Daftar → Kunjungan Selesai', visitSummary.value.avg_registration_to_finished_minutes, 'F', 'Durasi', 'bg-purple-50', 'text-purple-600', true),
    makeVisitCard('Kunjungan Terlama', visitSummary.value.max_registration_to_finished_minutes, 'Max', 'Durasi', 'bg-orange-50', 'text-orange-600', true),
]);
const hasHourlyArrivals = computed(() => hourlyArrivals.value.length > 0);
const hasStatusBreakdown = computed(() => statusBreakdown.value.length > 0);
const hourlyChartSeries = computed(() => [{ name: 'Total Kunjungan', data: hourlyArrivals.value.map((item) => numberValue(item.total_queues ?? item.total ?? item.count)) }]);
const hourlyChartOptions = computed(() => ({ chart: { toolbar: { show: false } }, plotOptions: { bar: { borderRadius: 3, columnWidth: '45%' } }, dataLabels: { enabled: false }, colors: ['#2563eb'], fill: { opacity: 0.9 }, grid: { borderColor: '#e2e8f0', strokeDashArray: 4 }, xaxis: { categories: hourlyArrivals.value.map((item) => `${item.hour ?? item.jam ?? item.time ?? '-'}:00`) }, yaxis: { title: { text: 'Total Kunjungan' } }, tooltip: { y: { formatter: (value) => `${value} kunjungan` } } }));
const statusChartSeries = computed(() => statusBreakdown.value.map((item) => numberValue(item.total ?? item.total_queues ?? item.count)));
const statusChartOptions = computed(() => ({ chart: { toolbar: { show: false } }, labels: statusBreakdown.value.map((item) => String(item.status ?? item.label ?? '-')), colors: statusBreakdown.value.map((item) => statusColor(item.status ?? item.label)), legend: { position: 'bottom' }, dataLabels: { formatter: (value) => `${value.toFixed(1)}%` }, tooltip: { y: { formatter: (value) => `${value} kunjungan` } } }));
const visitInsights = computed(() => {
    const list = [];
    const totalQueues = numberValue(visitSummary.value.total_queues);
    const canceledQueues = numberValue(visitSummary.value.canceled_queues);
    const avgWaitVital = nullableNumber(visitSummary.value.avg_wait_to_vital_minutes);
    const avgPaid = nullableNumber(visitSummary.value.avg_registration_to_sale_paid_minutes ?? visitSummary.value.avg_registration_to_payment_minutes);
    const avgFinished = nullableNumber(visitSummary.value.avg_registration_to_finished_minutes);
    if (avgWaitVital !== null && avgWaitVital > 30) list.push({ title: 'Waktu tunggu vital cukup tinggi', text: `Rata-rata ${formatMinutes(avgWaitVital)} sebelum vital sign.`, class: 'border-amber-200 bg-amber-50 text-amber-700' });
    if (avgPaid !== null && avgFinished !== null && avgPaid > avgFinished) list.push({ title: 'Pembayaran selesai lebih lambat dari kunjungan', text: 'Perlu cek alur kasir setelah pelayanan selesai.', class: 'border-blue-200 bg-blue-50 text-blue-700' });
    if (totalQueues > 0 && canceledQueues / totalQueues > 0.1) list.push({ title: 'Tingkat pembatalan cukup tinggi', text: `${Math.round((canceledQueues / totalQueues) * 100)}% kunjungan dibatalkan.`, class: 'border-red-200 bg-red-50 text-red-700' });
    if (!list.length) list.push({ title: 'Alur kunjungan terlihat efisien', text: 'Tidak ada indikator risiko utama pada periode ini.', class: 'border-green-200 bg-green-50 text-green-700' });
    return list;
});

async function fetchVisitTimeAnalysis() {
    isVisitLoading.value = true;
    visitErrorMessage.value = '';
    try {
        const response = await APIVisitTimeAnalysis({ date_from: visitFilters.value.date_from, date_to: visitFilters.value.date_to });
        visitData.value = response?.data?.data || { ...emptyVisitDashboard };
        if (visitFilters.value.doctor && !doctorOptions.value.includes(visitFilters.value.doctor)) visitFilters.value.doctor = '';
    } catch (error) {
        visitErrorMessage.value = parseErrorMessage(error);
        visitData.value = { ...emptyVisitDashboard };
    } finally {
        isVisitLoading.value = false;
    }
}
function formatDateInput(date) { const year = date.getFullYear(); const month = String(date.getMonth() + 1).padStart(2, '0'); const day = String(date.getDate()).padStart(2, '0'); return year + '-' + month + '-' + day; }
function makeVisitCard(label, rawValue, icon, type, bg, color, isMinute = false) { return { label, icon, type, bg, color, value: isMinute ? formatMinutes(rawValue) : numberValue(rawValue).toLocaleString('id-ID') }; }
function normalizeArray(value) { return Array.isArray(value) ? value : []; }
function nullableNumber(value) { if (value === null || value === undefined || value === '') return null; const number = Number(value); return Number.isFinite(number) ? number : null; }
function numberValue(value) { return nullableNumber(value) ?? 0; }
function formatMinutes(value) { const minutes = nullableNumber(value); if (minutes === null) return '-'; const rounded = Math.round(minutes); if (rounded < 60) return `${rounded} menit`; const hours = Math.floor(rounded / 60); const remainingMinutes = rounded % 60; return remainingMinutes ? `${hours} jam ${remainingMinutes} menit` : `${hours} jam`; }
function formatDateTime(value) { if (!value) return '-'; const date = new Date(value); if (Number.isNaN(date.getTime())) return '-'; return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(date); }
function doctorName(item) { return item?.doctor_name || item?.doctor?.name || item?.dokter_name || item?.dokter?.name || '-'; }
function queueKey(queue) { return queue.id || queue.queue_id || queue.queue_no || JSON.stringify(queue); }
function statusColor(status) { const key = String(status || '').toLowerCase(); if (['done', 'completed', 'success', 'finished'].includes(key)) return '#22c55e'; if (['waiting', 'on_waiting'].includes(key)) return '#3b82f6'; if (['on_process', 'process', 'processing'].includes(key)) return '#f59e0b'; if (key === 'observation') return '#8b5cf6'; if (['canceled', 'cancelled', 'cancel'].includes(key)) return '#ef4444'; return '#94a3b8'; }
function doctorBadgeText(doctor) { const minutes = nullableNumber(doctor.avg_registration_to_finished_minutes); if (minutes !== null && minutes <= 30) return 'Cepat'; if (minutes !== null && minutes > 60) return 'Perlu Perhatian'; return 'Stabil'; }
function doctorBadgeClass(doctor) { const text = doctorBadgeText(doctor); if (text === 'Cepat') return 'rounded bg-green-50 px-2 py-1 text-xs font-semibold text-green-700'; if (text === 'Perlu Perhatian') return 'rounded bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700'; return 'rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600'; }
function durationBadgeClass(value) { const minutes = nullableNumber(value); if (minutes !== null && minutes > 60) return 'rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-700'; if (minutes !== null && minutes > 30) return 'rounded bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700'; return 'rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600'; }
const EmptyState = defineComponent({ props: { title: { type: String, required: true } }, setup(props) { return () => h('div', { class: 'flex min-h-[220px] items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500' }, props.title); } });
const ChartSkeleton = defineComponent({ setup() { return () => h('div', { class: 'mt-4 h-[330px] animate-pulse rounded-md bg-slate-100' }); } });

fetchVisitTimeAnalysis();
</script>
