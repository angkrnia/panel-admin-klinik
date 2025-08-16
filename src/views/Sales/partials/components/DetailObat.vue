<template>
    <div class="rounded-2xl bg-white shadow ring-1 ring-slate-200 overflow-hidden">
        <header class="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-2 bg-gradient-to-r from-[#2564ebd7] to-fuchsia-400 text-white">
            <div class="flex items-center gap-3">
                <Pill class="h-5 w-5" />
                <h2 class="text-base font-semibold tracking-tight">
                    Daftar Obat
                </h2>
            </div>
            <span class="text-xs">{{ data.length || 0 }} item</span>
        </header>
        <div class="p-5 space-y-2">
            <article v-for="(item, index) in data" :key="index" class="rounded-lg border border-slate-200/70 px-4 py-2 hover:shadow bg-gradient-to-r from-indigo-50 to-fuchsia-100">
                <div class="flex items-start justify-between">
                    <div>
                        <p class="font-semibold">{{ item.product_name }}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-slate-500">Harga Total</p>
                        <p class="text-base font-semibold">{{ convertRp(item.total_price) }}</p>
                    </div>
                </div>
                <div class="text-sm">
                    <div>
                        <span class="text-slate-500">Jumlah: </span>
                        <span class="font-medium">{{ item.quantity }} {{ item.unit_name || '' }}</span>
                    </div>
                    <div>
                        <span class="text-slate-500">Harga Satuan: </span>
                        <span class="font-medium">{{ convertRp(item.unit_price) }}</span>
                    </div>
                    <div v-if="item.note">
                        <span class="text-slate-500">Catatan: </span>
                        <span class="font-medium">{{ item.note }}</span>
                    </div>
                </div>
            </article>

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
import { Pill } from 'lucide-vue-next';
import { convertRp } from '../../../../helpers/utils';

const props = defineProps({
    data: Array,
});
</script>