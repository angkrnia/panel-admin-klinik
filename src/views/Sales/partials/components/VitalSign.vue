<template>
    <div class="rounded-2xl bg-white shadow ring-1 ring-slate-200 overflow-hidden" v-if="data">
        <header class="flex items-center gap-3 border-b border-slate-100 px-5 py-2 bg-gradient-to-r from-[#2564ebd7] to-fuchsia-400 text-white">
            <Activity class="h-5 w-5"></Activity>
            <h2 class="text-base font-semibold tracking-tight">
                Vital Sign
            </h2>
        </header>
        <div class="p-5">
            <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div class="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3">
                    <div class="flex items-center gap-2 text-xs text-emerald-700">
                        <Thermometer class="h-4 w-4"></Thermometer>Suhu
                    </div>
                    <div class="mt-1 text-lg font-semibold">{{ data?.temperature }}°C</div>
                </div>
                <div class="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3">
                    <div class="flex items-center gap-2 text-xs text-indigo-700">
                        <Weight class="h-4 w-4"></Weight>Berat
                    </div>
                    <div class="mt-1 text-lg font-semibold">{{ data.weight }} kg</div>
                </div>
                <div class="rounded-2xl border border-violet-100 bg-violet-50/50 p-3">
                    <div class="flex items-center gap-2 text-xs text-violet-700">
                        <Ruler class="h-4 w-4"></Ruler>Tinggi
                    </div>
                    <div class="mt-1 text-lg font-semibold">{{ data.height }} cm</div>
                </div>
                <div class="rounded-2xl border border-fuchsia-100 bg-fuchsia-50/50 p-3">
                    <div class="flex items-center gap-2 text-xs text-fuchsia-700">
                        <HeartPlus class="h-4 w-4"></HeartPlus>Tekanan
                        Darah
                    </div>
                    <div class="mt-1 text-lg font-semibold">{{ data.blood_pressure }} mmHg</div>
                </div>
            </div>

            <div class="mt-4 flex items-start gap-3">
                <Stethoscope class="mt-0.5 h-5 w-5 text-slate-500"></Stethoscope>
                <div class="w-full">
                    <div class="text-xs text-slate-500">Catatan</div>
                    <div class="font-medium">
                        {{ data.note || '-' }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Activity, HeartPlus, Ruler, Stethoscope, Thermometer, Weight } from 'lucide-vue-next';

const props = defineProps({
    data: Object,
});
</script>