<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div v-role="['admin']">
            <h1 class="text-center font-semibold text-gray-700">Pendapatan</h1>
            <div class="bg-white p-4 border rounded-xl shadow h-[350px] w-full">
                <apexchart :key="salesIndex" type="area" width="100%" height="100%" :options="sales.options" :series="sales.series" />
            </div>
        </div>
        <div>
            <h1 class="text-center font-semibold text-gray-700">Statistik</h1>
            <div class="bg-white p-4 border rounded-xl shadow h-[350px] w-full">
                <apexchart :key="layananIndex" type="bar" width="100%" height="100%" :options="layanan.options" :series="layanan.series" />
            </div>
        </div>
        <div>
            <h1 class="text-center font-semibold text-gray-700">Usia Pasien</h1>
            <div class="bg-white p-4 border rounded-xl shadow h-[350px] w-full">
                <apexchart :key="ageIndex" type="bar" width="100%" height="100%" :options="age.options" :series="age.series" />
            </div>
        </div>
        <div>
            <h1 class="text-center font-semibold text-gray-700">Jenis Kelamin</h1>
            <div class="bg-white p-4 border rounded-xl shadow h-[350px] w-full">
                <apexchart :key="genderIndex" type="bar" width="100%" height="100%" :options="gender.options" :series="gender.series" />
            </div>
        </div>
        <div>
            <h1 class="text-center font-semibold text-gray-700">Pergerakan Obat</h1>
            <div class="bg-white p-4 border rounded-xl shadow h-[350px] w-full">
                <apexchart :key="obatIndex" type="line" width="100%" height="100%" :options="obat.options" :series="obat.series" />
            </div>
        </div>
        <div>
            <h1 class="text-center font-semibold text-gray-700">Obat Terjual</h1>
            <div class="bg-white p-4 border rounded-xl shadow h-[350px] w-full">
                <apexchart :key="topObatIndex" type="donut" width="100%" height="100%" :options="topObat.options" :series="topObat.series" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { convertRp, formatCurrencyToString, formatRibuan } from '../../helpers/utils'
import useGetData from '../../composables/useGetData';
import { APIMedicineMovementChart, APIStatisticChart, APIStatisticsPatient, APITopMedicines, APITransactionDateByDate } from '../../api/apiChart';

const { 1: fetchData, 2: isLoading } = useGetData();

const salesIndex = ref(0)
const layananIndex = ref(0)
const ageIndex = ref(0)
const obatIndex = ref(0)
const genderIndex = ref(0)
const topObatIndex = ref(0)

const sales = ref({
    series: [{
        name: "Pendapatan",
        data: []
    }],
    options: {
        chart: {
            type: 'area',
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: true,
            formatter(val, opts) {
                return formatRibuan(val);
            },
        },
        stroke: {
            curve: 'smooth'
        },
        labels: [],
        yaxis: {
            opposite: true,
            labels: {
                formatter: function (val) {
                    return formatCurrencyToString(val)
                }
            }
        },
        legend: {
            horizontalAlign: 'bottom',
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return convertRp(val)
                }
            }
        }
    }
})

const layanan = ref({
    series: [{
        name: 'Layanan',
        data: []
    }, {
        name: 'Obat',
        data: []
    }, {
        name: 'Tindakan',
        data: []
    }],
    options: {
        chart: {
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 5,
                borderRadiusApplication: 'end'
            },
        },
        dataLabels: {
            enabled: true,
            formatter(val, opts) {
                return formatRibuan(val);
            },
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: [],
        },
        yaxis: {
            title: {
                text: 'Jumlah'
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return formatRibuan(val)
                }
            }
        }
    }
})

const age = ref({
    series: [{
        name: 'Pasien',
        data: [0]
    }],
    options: {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                borderRadiusApplication: 'end',
                horizontal: true,
            }
        },
        dataLabels: {
            enabled: true,
            formatter(val, opts) {
                return formatRibuan(val);
            },
        },
        xaxis: {
            categories: ['0-3 Tahun', '3-5 Tahun', '6-10 Tahun', '11-20 Tahun', '21-30 Tahun', '31-40 Tahun', '41-50 Tahun', '51-60 Tahun', '61-70 Tahun', '80+ Tahun'],
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return formatRibuan(val)
                }
            }
        }
    }
});

const obat = ref({
    series: [{
        name: 'Obat Keluar',
        type: 'column',
        data: []
    }, {
        name: 'Obat Masuk',
        type: 'line',
        data: []
    }],
    options: {
        chart: {
            height: 350,
            type: 'line',
            toolbar: {
                show: false
            }
        },
        stroke: {
            width: [0, 1]
        },
        dataLabels: {
            enabled: true,
            formatter(val, opts) {
                return formatRibuan(val);
            },
        },
        labels: [],
    }
})

const gender = ref({
    series: [{
        name: 'Laki-laki',
        data: [0]
    }, {
        name: 'Perempuan',
        data: [0]
    }],
    options: {
        chart: {
            type: 'bar',
            stacked: true,
            stackType: '100%',
            toolbar: {
                show: false
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
            },
        },
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return formatRibuan(val)
                },
            }
        },
        dataLabels: {
            enabled: true,
            formatter(val, opts) {
                const jumlah = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex];
                return `${formatRibuan(jumlah)} (${Math.round(val)}%)`;
            },
        },
        xaxis: {
            categories: ['Jenis Kelamin'],
            labels: {
                show: false
            }
        },
        yaxis: {
            labels: {
                show: false
            }
        },
    }
})

const topObat = ref({
    series: [1],
    options: {
        chart: {
            type: 'donut',
        },
        labels: ['Tidak ada data'],
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 90,
                offsetY: 10
            }
        },
        grid: {
            padding: {
                bottom: -100
            }
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'top'
                }
            }
        }],
        dataLabels: {
            enabled: true,
            formatter(val, opts) {
                const jumlah = opts.w.config.series[opts.seriesIndex];
                return formatRibuan(jumlah) + ' (' + val.toFixed(1) + '%)';
            },
            style: {
                colors: ['#fff'],
                fontWeight: 'bold',
            }
        }
    }
})

function getStatisticPatient() {
    fetchData(APIStatisticsPatient, false, true, (data) => {
        if (data) {
            age.value.series[0].data = data.age;
            gender.value.series[0].data = [data.gender[0]];
            gender.value.series[1].data = [data.gender[1]];
        }
    })
}

function getStatisticChart() {
    fetchData(APIStatisticChart, false, true, (data) => {
        if (data) {
            layanan.value.options.xaxis.categories = data.map((item) => item.date);
            layanan.value.series[0].data = data.map((item) => item.layanan);
            layanan.value.series[1].data = data.map((item) => item.obat);
            layanan.value.series[2].data = data.map((item) => item.tindakan);
            layananIndex.value = new Date().getTime();
        }
    })
}

function getTransactionDateByDate() {
    fetchData(APITransactionDateByDate, false, true, (data) => {
        if (data) {
            const date = data.map((item) => item.date);
            sales.value.series[0].data = data.map((item) => item.total_sales);
            sales.value.options.labels = date;
        }
    });
}

function getTopMedicines() {
    fetchData(APITopMedicines, false, true, (data) => {
        if (data?.length) {
            topObat.value.series = data.map(item => Number(item.quantity));
            topObat.value.options.labels = data.map(item => item.product_name);
        } else {
            topObat.value.series = [1];
            topObat.value.options.labels = ['Tidak ada data'];
        }
        topObatIndex.value = new Date().getTime();
    })
}

function getMedicineMovementChart() {
    fetchData(APIMedicineMovementChart, false, true, (data) => {
        if (data) {
            obat.value.options.labels = data.map((item) => item.date);
            obat.value.series[0].data = data.map((item) => item.medicine_out);
            obat.value.series[1].data = data.map((item) => item.medicine_in);
            obatIndex.value = new Date().getTime();
        }
    })
}

getTransactionDateByDate();
getStatisticChart();
getStatisticPatient();
getMedicineMovementChart();
getTopMedicines();
</script>
