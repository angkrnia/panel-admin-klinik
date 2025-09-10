<template>
    <section class="rounded-2xl h-fit bg-white p-5 shadow ring-1 ring-slate-200">
        <h3 class="mb-4 flex items-center gap-2 text-base font-semibold tracking-tight">
            <ReceiptText class="h-5 w-5 text-slate-700"></ReceiptText>
            Ringkasan Pembayaran
        </h3>
        <div class="space-y-3 text-sm">
            <div class="flex items-center justify-between">
                <span class="text-slate-600">Subtotal Layanan</span><span class="font-medium">{{ convertRp(data.subtotal_layanan) }}</span>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-slate-600">Subtotal Obat</span><span class="font-medium">{{ convertRp(data.subtotal_obat) }}</span>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-slate-600">Subtotal Tindakan</span><span class="font-medium">{{ convertRp(data.subtotal_tindakan) }}</span>
            </div>
            <div class="my-2 border-t border-dashed border-slate-300"></div>
            <div class="flex items-center justify-between">
                <span class="text-slate-700">Grand Total</span><span class="text-lg font-semibold">{{ convertRp(data.grand_total) }}</span>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-slate-700">
                    Bayar
                    <span v-if="data.payment_method" class="uppercase">
                        ({{ data.payment_method }})
                    </span>
                </span>
                <span class="font-semibold">
                    {{ convertRp(data.paid_amount) }}
                </span>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-slate-700">Kembalian</span><span class="font-semibold text-emerald-600">{{ convertRp(data.change) }}</span>
            </div>
        </div>
        <div class="mt-5">
            <template v-if="data.status === 'waiting'">
                <button @click="onClickBayar"
                    class="inline-flex w-full col-span-2 items-center justify-center gap-2 rounded-lg bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 active:scale-[.99]">
                    <ShieldCheck class="h-4 w-4"></ShieldCheck> Bayar
                </button>
            </template>
            <div class="grid grid-cols-2 gap-2" v-else-if="data.status === 'done'">
                <button @click="onShare" v-role="['admin']"
                    class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-transparent transition hover:bg-slate-50 active:scale-[.99]">
                    <TriangleAlert class="h-4 w-4"></TriangleAlert> Batalkan
                </button>
                <button @click="onPrint"
                    class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2564ebd7] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[.99]">
                    <Printer class="h-4 w-4"></Printer> Cetak
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Printer, ReceiptText, Share2, Shield, ShieldCheck, TriangleAlert } from 'lucide-vue-next';
import { convertRp } from '../../../../helpers/utils';

const props = defineProps({
    data: Object,
});

const emit = defineEmits(['click-bayar']);

function onClickBayar() {
    emit('click-bayar');
}

function onPrint() {
    window.open('/sales/print?receipt_number=' + props.data.receipt_number, '_blank');
}

const onShare = () => {
    navigator.clipboard.writeText(window.location.href);
}
</script>