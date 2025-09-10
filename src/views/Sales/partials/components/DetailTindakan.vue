<template>
    <div class="rounded-2xl bg-white shadow ring-1 ring-slate-200 overflow-hidden">
        <header class="flex items-center gap-3 border-b border-slate-100 px-5 py-2 bg-gradient-to-r from-[#2564ebd7] to-fuchsia-400 text-white">
            <Syringe class="h-5 w-5"></Syringe>
            <h2 class="text-base font-semibold tracking-tight">
                Daftar Tindakan
            </h2>
        </header>
        <div class="p-5 space-y-2">
            <template v-for="(item, index) in data" :key="index">
                <article class="flex items-start justify-between rounded-lg border border-slate-200/70 px-4 py-3 hover:shadow bg-gradient-to-r from-indigo-50 to-fuchsia-50">
                    <div>
                        <p class="font-medium">{{ item.tindakan_name }}</p>
                        <p class="text-sm text-slate-500">{{ item.quantity }} × {{ convertRp(item.tindakan_price) }}</p>
                        <p class="text-xs text-slate-400 capitalize">Input: {{ item.source }}</p>
                        <p class="text-xs text-slate-400 capitalize" v-if="item.note">Catatan: {{ item.note }}</p>
                    </div>
                    <p class="font-semibold">{{ convertRp(item.total_price) }}</p>
                </article>
            </template>

            <!-- Jika kosong -->
            <template v-if="!data || !data.length || data.length == 0">
                <article class="flex items-start justify-center rounded-lg border border-slate-200/70 px-4 py-3 hover:shadow bg-gradient-to-r from-indigo-50 to-fuchsia-50">
                    <div>
                        <p class="font-medium text-center text-gray-500">Tidak ada tindakan</p>
                    </div>
                </article>
            </template>
        </div>
    </div>
</template>

<script setup>
import { Syringe } from 'lucide-vue-next';
import { convertRp } from '../../../../helpers/utils';

const props = defineProps({
    data: Array,
});
</script>