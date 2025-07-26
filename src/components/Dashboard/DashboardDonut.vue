<template>
    <div class="mb-5 2xl:mb-10">
        <p class="text-gray-600 mb-1">Filter data berdasarkan tanggal:</p>
        <div class="flex items-center gap-x-2">
            <ElDateRangeInput v-model:startDate="startDate" v-model:endDate="endDate" />
            <el-button type="primary" @click="onFilter">Filter</el-button>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
            <h1 class="text-center font-semibold text-gray-700">Konsultasi</h1>
            <div v-if="dokter.options.labels.length && dokter.series.length" class="bg-white p-4 border rounded-xl shadow h-[350px] flex items-center justify-center">
                <apexchart :key="dokterIndex" type="pie" width="100%" height="100%" :options="dokter.options" :series="dokter.series" />
            </div>
            <div v-else class="flex-1 items-center justify-center">
                <h1 class="text-center text-gray-500">Loading...</h1>
            </div>
        </div>
        <div>
            <h1 class="text-center font-semibold text-gray-700">Layanan</h1>
            <div v-if="layanan.options.labels.length && layanan.series.length" class="bg-white p-4 border rounded-xl shadow h-[350px] flex items-center justify-center">
                <apexchart :key="layananIndex" type="donut" width="100%" height="100%" :options="layanan.options" :series="layanan.series" />
            </div>
            <div v-else class="flex-1 items-center justify-center">
                <h1 class="text-center text-gray-500">Loading...</h1>
            </div>
        </div>
        <div>
            <h1 class="text-center font-semibold text-gray-700">Tindakan</h1>
            <div v-if="tindakan.options.labels.length && tindakan.series.length" class="bg-white p-4 border rounded-xl shadow h-[350px] flex items-center justify-center">
                <apexchart :key="tindakanIndex" type="pie" width="100%" height="100%" :options="tindakan.options" :series="tindakan.series" />
            </div>
            <div v-else class="flex-1 items-center justify-center">
                <h1 class="text-center text-gray-500">Loading...</h1>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { formatRibuan } from '../../helpers/utils'
import useGetData from '../../composables/useGetData';
import { APISummaryDoctor, APISummaryLayanan, APISummaryTindakan } from '../../api/apiChart';
import ElDateRangeInput from '../ElDateRangeInput.vue';

const { 1: fetchData } = useGetData();

const dokterIndex = ref(null)
const layananIndex = ref(null)
const tindakanIndex = ref(null)

const startDate = ref(null);
const endDate = ref(null);

const dokter = ref({
    series: [],
    options: {
        chart: {
            type: 'pie'
        },
        labels: [],
        legend: {
            position: 'bottom'
        },
        dataLabels: {
            enabled: true,
            formatter: pieLabelFormatter
        }
    }
})


const layanan = ref({
    series: [],
    options: {
        chart: {
            type: 'donut'
        },
        labels: [],
        legend: {
            position: 'bottom'
        },
        dataLabels: {
            enabled: true,
            formatter: pieLabelFormatter
        }
    }
})

const tindakan = ref({
    series: [],
    options: {
        chart: {
            type: 'pie'
        },
        labels: [],
        legend: {
            position: 'bottom'
        },
        dataLabels: {
            enabled: true,
            formatter: pieLabelFormatter
        }
    }
})


function pieLabelFormatter(val, opts) {
    const series = opts.w.globals.series;
    const seriesIndex = opts.seriesIndex;
    const total = series.reduce((a, b) => a + b, 0);
    const value = series[seriesIndex];
    const percent = ((value / total) * 100).toFixed(1);
    return `${formatRibuan(value)} (${percent}%)`;
}

function getSummaryDokter() {
    fetchData(() => APISummaryDoctor({ start_date: startDate.value, end_date: endDate.value }), false, true, (data) => {
        if (data) {
            dokter.value.options.labels = data.map((item) => item.doctor_fullname);
            dokter.value.series = data.map((item) => item.total_visits);

            dokterIndex.value = new Date().getTime();
        }
    })
}

function getSummaryLayanan() {
    fetchData(() => APISummaryLayanan({ start_date: startDate.value, end_date: endDate.value }), false, true, (data) => {
        if (data) {
            layanan.value.options.labels = data.map((item) => item.service_name);
            layanan.value.series = data.map((item) => item.total_usage);

            layananIndex.value = new Date().getTime();
        }
    })
}

function getSummaryTindakan() {
    fetchData(() => APISummaryTindakan({ start_date: startDate.value, end_date: endDate.value }), false, true, (data) => {
        if (data) {
            tindakan.value.options.labels = data.map((item) => item.tindakan_name);
            tindakan.value.series = data.map((item) => item.total_usage);

            tindakanIndex.value = new Date().getTime();
        }
    })
}

function onFilter() {
    getSummaryDokter()
    getSummaryLayanan()
    getSummaryTindakan()
}

getSummaryDokter()
getSummaryLayanan()
getSummaryTindakan()
</script>
