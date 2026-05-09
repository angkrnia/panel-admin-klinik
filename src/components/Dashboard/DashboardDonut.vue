<template>
    <div class="mb-5 2xl:mb-10">
        <p class="text-gray-600 mb-1">Filter data berdasarkan tanggal:</p>
        <div class="flex items-center gap-x-2">
            <ElDateRangeInput v-model:startDate="startDate" v-model:endDate="endDate" />
            <el-button type="primary" @click="onFilter">Filter</el-button>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="bg-white border rounded-xl shadow p-4">
            <div class="flex items-center justify-between mb-3">
                <div>
                    <h1 class="font-semibold text-gray-700">Konsultasi</h1>
                    <p class="text-xs text-gray-400">Jumlah kunjungan per dokter</p>
                </div>
                <p class="text-sm font-semibold text-primary bg-blue-50 px-3 py-1 rounded-full">{{ dokterTotal }}</p>
            </div>
            <div v-if="dokter.options.xaxis.categories.length && dokter.series[0].data.length" class="h-[320px]">
                <apexchart :key="dokterIndex" type="bar" width="100%" height="100%" :options="dokter.options" :series="dokter.series" />
            </div>
            <div v-else class="h-[320px] flex items-center justify-center">
                <h1 class="text-center text-gray-500">Loading...</h1>
            </div>
        </div>
        <div class="bg-white border rounded-xl shadow p-4">
            <div class="flex items-center justify-between mb-3">
                <div>
                    <h1 class="font-semibold text-gray-700">Layanan</h1>
                    <p class="text-xs text-gray-400">Distribusi layanan terpakai</p>
                </div>
                <p class="text-sm font-semibold text-primary bg-blue-50 px-3 py-1 rounded-full">{{ layananTotal }}</p>
            </div>
            <div v-if="layanan.options.xaxis.categories.length && layanan.series[0].data.length" class="h-[320px]">
                <apexchart :key="layananIndex" type="bar" width="100%" height="100%" :options="layanan.options" :series="layanan.series" />
            </div>
            <div v-else class="h-[320px] flex items-center justify-center">
                <h1 class="text-center text-gray-500">Loading...</h1>
            </div>
        </div>
        <div class="lg:col-span-2">
            <h1 class="text-center font-semibold text-gray-700">Tindakan</h1>
            <div v-if="tindakan.options.xaxis.categories.length && tindakan.series[0].data.length" class="bg-white p-4 border rounded-xl shadow h-[520px] overflow-y-auto">
                <apexchart :key="tindakanIndex" type="bar" width="100%" :height="tindakanChartHeight" :options="tindakan.options" :series="tindakan.series" />
            </div>
            <div v-else class="flex-1 items-center justify-center">
                <h1 class="text-center text-gray-500">Loading...</h1>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
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
const dokterTotal = computed(() => formatRibuan(dokter.value.series[0].data.reduce((total, item) => total + Number(item), 0)));
const layananTotal = computed(() => formatRibuan(layanan.value.series[0].data.reduce((total, item) => total + Number(item), 0)));
const tindakanChartHeight = computed(() => Math.max(500, tindakan.value.series[0].data.length * 28));

const dokter = ref({
    series: [{
        name: 'Kunjungan',
        data: []
    }],
    options: createBarOptions([])
})


const layanan = ref({
    series: [{
        name: 'Jumlah',
        data: []
    }],
    options: createBarOptions([])
})

const tindakan = ref({
    series: [{
        name: 'Jumlah',
        data: []
    }],
    options: createBarOptions([])
})


function createBarOptions(categories) {
    return {
        chart: {
            type: 'bar',
            toolbar: {
                show: false
            },
            parentHeightOffset: 0
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 6,
                borderRadiusApplication: 'end',
                barHeight: '52%',
            }
        },
        dataLabels: {
            enabled: true,
            textAnchor: 'start',
            offsetX: 8,
            style: {
                fontSize: '11px',
                fontWeight: 600,
                colors: ['#ffffff']
            },
            formatter(val) {
                return formatRibuan(val);
            }
        },
        xaxis: {
            categories,
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            labels: {
                style: {
                    colors: '#94a3b8',
                    fontSize: '11px'
                },
                formatter(val) {
                    return formatRibuan(val);
                }
            }
        },
        yaxis: {
            labels: {
                maxWidth: 260,
                style: {
                    colors: '#334155',
                    fontSize: '11px'
                }
            }
        },
        grid: {
            borderColor: '#e2e8f0',
            strokeDashArray: 4,
            padding: {
                left: 8,
                right: 20,
            }
        },
        colors: ['#3b82f6'],
        legend: {
            show: false
        },
        tooltip: {
            y: {
                formatter(val) {
                    return formatRibuan(val);
                }
            }
        }
    }
}

function getSummaryDokter() {
    fetchData(() => APISummaryDoctor({ start_date: startDate.value, end_date: endDate.value }), false, true, (data) => {
        if (data) {
            const summary = data.filter((item) => Number(item.total_visits) > 0);
            dokter.value.options.xaxis.categories = summary.map((item) => item.doctor_fullname);
            dokter.value.series[0].data = summary.map((item) => item.total_visits);

            dokterIndex.value = new Date().getTime();
        }
    })
}

function getSummaryLayanan() {
    fetchData(() => APISummaryLayanan({ start_date: startDate.value, end_date: endDate.value }), false, true, (data) => {
        if (data) {
            const summary = data.filter((item) => Number(item.total_usage) > 0);
            layanan.value.options.xaxis.categories = summary.map((item) => item.service_name);
            layanan.value.series[0].data = summary.map((item) => item.total_usage);

            layananIndex.value = new Date().getTime();
        }
    })
}

function getSummaryTindakan() {
    fetchData(() => APISummaryTindakan({ start_date: startDate.value, end_date: endDate.value }), false, true, (data) => {
        if (data) {
            const summary = data.filter((item) => Number(item.total_usage) > 0);
            tindakan.value.options.xaxis.categories = summary.map((item) => item.tindakan_name);
            tindakan.value.series[0].data = summary.map((item) => item.total_usage);

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
