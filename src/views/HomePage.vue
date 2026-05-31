<template>
    <section>
        <TitleDashboard title="Dashboard Monitoring" />
    </section>

    <section class="mt-5 space-y-5">

        <div class="p-3 rounded-lg bg-orange-100" v-if="false">
            <h1 class="text-2xl">(Update 19:30 WIB) Mohon informasikan kepada dokter untuk update aplikasi dokter ke versi <span>1.6</span> download di sini <a target="_blank"
                    href="https://gitlab.com/angkrnia/klinik-adiyasa/-/raw/main/klinik-adiyasa-v1.5.apk"
                    class="text-blue-500 font-semibold">https://gitlab.com/angkrnia/klinik-adiyasa/-/raw/main/klinik-adiyasa-v1.6.apk</a></h1>
        </div>

        <!-- Dashboard pendapatan -->
        <DashboardPendapatan @filter-date="onFilterDate" />

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div class="flex-1 border rounded-md overflow-hidden">
                <div class="px-2 py-1 bg-sky-400 border-b">
                    <h1 class="font-semibold text-sm text-white">TOTAL PASIEN</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div v-html="SVG.people" class="size-5 text-slate-600"></div>
                    <h1 class="font-bold text-gray-700">{{ formatRibuan(summaryCount?.total_patients) }}</h1>
                </div>
            </div>
            <div class="flex-1 border rounded-md overflow-hidden">
                <div class="px-2 py-1 bg-sky-400 border-b">
                    <h1 class="font-semibold text-sm text-white">TOTAL KUNJUNGAN</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div v-html="SVG.clockHistory" class="size-5 text-slate-600"></div>
                    <h1 class="font-bold text-gray-700">{{ formatRibuan(summaryCount?.total_queues) }}</h1>
                </div>
            </div>
            <div class="flex-1 border rounded-md overflow-hidden">
                <div class="px-2 py-1 bg-sky-400 border-b">
                    <h1 class="font-semibold text-sm text-white">TOTAL DOKTER</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div v-html="SVG.clipboard" class="size-5 text-slate-600"></div>
                    <h1 class="font-bold text-gray-700">{{ formatRibuan(summaryCount?.total_doctors) }}</h1>
                </div>
            </div>
            <div class="flex-1 border rounded-md overflow-hidden">
                <div class="px-2 py-1 bg-sky-400 border-b">
                    <h1 class="font-semibold text-sm text-white">TOTAL PENGGUNA</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div v-html="SVG.people" class="size-5 text-slate-600"></div>
                    <h1 class="font-bold text-gray-700">{{ formatRibuan(summaryCount?.total_users) }}</h1>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-3">
            <div class="bg-white overflow-hidden border rounded-xl shadow h-[350px] w-full">
                <div class="px-2 py-1 bg-red-400 border-b">
                    <h1 class="font-semibold text-sm text-white">JUMLAH PASIEN PER HARI</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div id="chart" class="w-full" v-if="pasienOptions.xaxis.categories.length">
                        <apexchart type="line" height="350" :options="pasienOptions" :series="pasienSeries"></apexchart>
                    </div>
                    <div v-else class="flex-1 items-center justify-center">
                        <h1 class="font-semibold text-sm text-center">Loading...</h1>
                    </div>
                </div>
            </div>
            <div class="bg-white overflow-hidden border rounded-xl shadow h-[350px] w-full">
                <div class="px-2 py-1 bg-red-400 border-b">
                    <h1 class="font-semibold text-sm text-white">TOTAL KUNJUNGAN PER HARI</h1>
                </div>
                <div class="p-2 flex items-center justify-between">
                    <div id="chart" class="w-full" v-if="historyOptions.xaxis.categories.length">
                        <apexchart type="line" height="350" :options="historyOptions" :series="kunjunganSeries"></apexchart>
                    </div>
                    <div v-else class="flex-1 items-center justify-center">
                        <h1 class="font-semibold text-sm text-center">Loading...</h1>
                    </div>
                </div>
            </div>
        </div>

        <div class="border-b border-gray-300 my-5"></div>

        <DashboardStatistik />

        <div class="border-b border-gray-300 my-5"></div>

        <DashboardDonut />
    </section>
</template>

<script setup>
import { ref } from 'vue';
import SVG from '../helpers/svg';
import useGetData from '../composables/useGetData';
import { historyByDate, patientByDate, summaryData } from '../api/dashboardApi';
import { formatRibuan } from '../helpers/utils';
import DashboardPendapatan from '../components/Dashboard/DashboardPendapatan.vue';
import DashboardDonut from '../components/Dashboard/DashboardDonut.vue';
import DashboardStatistik from '../components/Dashboard/DashboardStatistik.vue';

const summaryCount = ref({
    total_doctors: 0,
    total_patients: 0,
    total_queues: 0,
    total_users: 0
});
const pasienSeries = ref([
    {
        name: "Pasien Baru",
        data: [28, 29, 33, 36, 32, 32, 33]
    },
]);
const kunjunganSeries = ref([
    {
        name: "Total Kunjungan",
        data: [28, 29, 33, 36, 32, 32, 33]
    },
])
const pasienOptions = ref({
    chart: {
        height: 350,
        type: 'line',
        dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.5
        },
        zoom: {
            enabled: false
        },
        toolbar: {
            show: false
        },
        stroke: {
            curve: 'smooth'
        },
    },
    colors: ['#22c55e', '#545454'],
    dataLabels: {
        enabled: true,
    },
    stroke: {
        curve: 'smooth'
    },
    grid: {
        borderColor: '#e7e7e7',
        row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
        },
    },
    markers: {
        size: 1
    },
    xaxis: {
        categories: [],
        title: {
            text: 'Bulan'
        },
    },
    yaxis: {
        title: {
            text: 'Total'
        },
    },
    legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
    }
})
const historyOptions = ref({
    chart: {
        height: 350,
        type: 'line',
        dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.5
        },
        zoom: {
            enabled: false
        },
        toolbar: {
            show: false
        },
        stroke: {
            curve: 'smooth'
        },
    },
    colors: ['#77B6EA', '#545454'],
    dataLabels: {
        enabled: true,
    },
    stroke: {
        curve: 'smooth'
    },
    grid: {
        borderColor: '#e7e7e7',
        row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
        },
    },
    markers: {
        size: 1
    },
    xaxis: {
        categories: [],
        title: {
            text: 'Bulan'
        }
    },
    yaxis: {
        title: {
            text: 'Total'
        },
    },
})
const { 1: fetchData } = useGetData();
const today = formatDateInput(new Date());
const dashboardFilter = ref({ date_from: today, date_to: today });

function getPatientByDate() {
    fetchData(patientByDate, false, true, (data) => {
        pasienSeries.value[0].data = data.map((item) => item.total);
        pasienOptions.value.xaxis.categories = data.map((item) => item.date);
    });
}

function getHistoryByDate() {
    fetchData(historyByDate, false, true, (data) => {
        kunjunganSeries.value[0].data = data.map((item) => item.total);
        historyOptions.value.xaxis.categories = data.map((item) => item.date);
    });
}

function onFilterDate(filter) {
    dashboardFilter.value = filter;
    getSummaryData();
}

function formatDateInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

function getSummaryData() {
    fetchData(() => summaryData(dashboardFilter.value), false, true, (data) => {
        if (data) {
            summaryCount.value = data;
        }
    });
}

getSummaryData();
getPatientByDate();
getHistoryByDate();
</script>
