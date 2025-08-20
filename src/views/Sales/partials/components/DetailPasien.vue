<template>
    <div class="rounded-2xl bg-white shadow ring-1 ring-slate-200 overflow-hidden">
        <header class="flex items-center gap-3 border-b border-slate-100 px-5 py-2 bg-gradient-to-r from-[#2564ebd7] to-fuchsia-400 text-white">
            <IdCard class="h-5 w-5" />
            <h2 class="text-base font-semibold tracking-tight">
                Data Pasien
            </h2>
        </header>
        <div class="p-5">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="flex items-start gap-3">
                    <UserRound class="mt-0.5 h-5 w-5 text-slate-500"></UserRound>
                    <div>
                        <div class="text-xs text-slate-500">Nama Lengkap</div>
                        <div class="font-medium">{{ data?.fullname }}</div>
                    </div>
                </div>
                <div class="flex items-start gap-3">
                    <InfoIcon class="mt-0.5 h-5 w-5 text-slate-500" />
                    <div>
                        <div class="text-xs text-slate-500">No Rekam Medis</div>
                        <div class="font-medium">{{ data?.record_no }}</div>
                    </div>
                </div>
                <div class="flex items-start gap-3">
                    <VenusAndMars class="mt-0.5 h-5 w-5 text-slate-500" />
                    <div>
                        <div class="text-xs text-slate-500">Jenis Kelamin</div>
                        <div class="font-medium">{{ data?.gender == 'L' ? 'Laki-laki' : 'Perempuan' }}</div>
                    </div>
                </div>
                <div class="flex items-start gap-3">
                    <Phone class="mt-0.5 h-5 w-5 text-slate-500"></Phone>
                    <div>
                        <div class="text-xs text-slate-500">Nomor HP</div>
                        <div class="font-medium">{{ data?.phone || '-' }}</div>
                    </div>
                </div>
                <div class="flex items-start gap-3">
                    <UserRound class="mt-0.5 h-5 w-5 text-slate-500"></UserRound>
                    <div>
                        <div class="text-xs text-slate-500">
                            Nama Keluarga/Darurat
                        </div>
                        <div class="font-medium">{{ data?.nama_keluarga || '-' }}</div>
                    </div>
                </div>
                <div class="flex items-start gap-3">
                    <BadgeCheck class="mt-0.5 h-5 w-5 text-slate-500"></BadgeCheck>
                    <div>
                        <div class="text-xs text-slate-500">No KTP</div>
                        <div class="font-medium">{{ data?.no_ktp || '-' }}</div>
                    </div>
                </div>
                <div class="sm:col-span-2 flex items-start gap-3">
                    <MapPin class="mt-0.5 h-5 w-5 text-slate-500"></MapPin>
                    <div class="w-full">
                        <div class="text-xs text-slate-500">Alamat</div>
                        <div class="font-medium">
                            {{ data?.address }}
                        </div>
                    </div>
                </div>
                <div class="flex items-start gap-3">
                    <TriangleAlert class="mt-0.5 h-5 w-5 text-rose-500"></TriangleAlert>
                    <div>
                        <div class="text-xs text-slate-500">Alergi</div>
                        <div class="font-medium">{{ data?.allergy || '-' }}</div>
                    </div>
                </div>
            </div>

            <div class="mt-4 grid grid-cols-1 gap-4" v-if="queue">
                <div class="flex items-start gap-3">
                    <MessageSquareQuote class="mt-0.5 h-5 w-5 text-slate-500"></MessageSquareQuote>
                    <div class="w-full">
                        <div class="text-xs text-slate-500">Keluhan</div>
                        <div class="font-medium">
                            {{ queue?.history?.complaint || '-' }}
                        </div>
                    </div>
                </div>
                <div class="flex items-start gap-3" v-if="queue?.history?.note">
                    <Notebook class="mt-0.5 h-5 w-5 text-slate-500"></Notebook>
                    <div class="w-full">
                        <div class="text-xs text-slate-500">Catatan</div>
                        <div class="font-medium">{{ queue?.history?.note || '-' }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { BadgeCheck, IdCard, InfoIcon, MapPin, MessageSquareQuote, Notebook, Phone, TriangleAlert, UserRound, VenusAndMars } from 'lucide-vue-next';

const props = defineProps({
    data: Object,
    queue: Object
});

</script>