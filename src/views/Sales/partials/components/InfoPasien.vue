<template>
    <section class="relative rounded-2xl bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 p-[1px] shadow ring-1 ring-black/5">
        <div class="rounded-2xl bg-white/90 p-6 backdrop-blur">
            <div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <!-- Pasien ringkas -->
                <div class="flex items-start gap-4">
                    <div class="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-600/10 ring-1 ring-white/60">
                        <UserRound class="h-7 w-7 text-indigo-600" />
                    </div>
                    <div>
                        <div class="flex flex-wrap items-center gap-2">
                            <h1 class="text-xl font-semibold tracking-tight">
                                {{ data?.patient_name || data?.patient?.fullname }}
                            </h1>
                            <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">{{ convertPaymentStatus(data.status)
                            }}</span>
                            <span class="rounded-full bg-fuchsia-50 px-2.5 py-1 text-xs font-semibold text-fuchsia-700 ring-1 ring-fuchsia-200 uppercase">{{ data.payment_method ||
                                '-'
                                }}</span>
                        </div>
                        <p class="mt-1 text-sm text-slate-600">
                            Dokter:
                            <span class="font-medium">{{ data?.doctor_name || '-' }}</span>
                            <span class="mx-2 text-slate-300">•</span>
                            No. Antrian: <span class="font-medium">{{ data?.queue?.queue || '-' }}</span>
                        </p>
                    </div>
                </div>

                <!-- Meta transaksi -->
                <div class="grid grid-cols-2 gap-x-6 text-sm">
                    <div class="text-slate-500">No. Transaksi</div>
                    <div class="font-medium">{{ data.receipt_number }}</div>
                    <div class="text-slate-500">Tanggal</div>
                    <div class="font-medium">{{ dateFormatFull(data.created_at) }}</div>
                    <div class="text-slate-500">Pembayaran</div>
                    <div class="font-medium uppercase">{{ data.payment_method || '-' }}</div>
                    <div class="text-slate-500">Status</div>
                    <div class="font-medium">{{ convertPaymentStatus(data.status) }}</div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { UserRound } from 'lucide-vue-next';
import { convertPaymentStatus, dateFormatFull } from '../../../../helpers/utils';

const props = defineProps({
    data: Object,
});

</script>