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
import { APIStatisticsPatient, APITransactionDateByDate } from '../../api/apiChart';

const { 1: fetchData, 2: isLoading } = useGetData();

const salesIndex = ref(null)
const layananIndex = ref(null)
const ageIndex = ref(null)
const obatIndex = ref(null)
const genderIndex = ref(null)
const topObatIndex = ref(null)

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
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    }, {
        name: 'Obat',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    }, {
        name: 'Tindakan',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
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
            categories: ['1 Jul', '2 Jul', '3 Jul', '4 Jul', '5 Jul', '6 Jul', '7 Jul', '8 Jul', '9 Jul'],
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
        data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
    }, {
        name: 'Obat Masuk',
        type: 'line',
        data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
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
        labels: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan', '10 Jan', '11 Jan', '12 Jan'],
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
    series: [44, 55, 41, 17, 15],
    options: {
        chart: {
            type: 'donut',
        },
        labels: ['Paracetamol', 'Amoxicillin', 'Ibuprofen', 'Antalgin', 'Vitamin C'],
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

function getTransactionDateByDate() {
    fetchData(APITransactionDateByDate, false, true, (data) => {
        if (data) {
            const date = data.map((item) => item.date);
            sales.value.series[0].data = data.map((item) => item.total_sales);
            sales.value.options.labels = date;
        }
    });
}

getTransactionDateByDate();
getStatisticPatient();
</script>
