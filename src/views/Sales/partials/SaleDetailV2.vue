<template>
    <div>
        <!-- Tombol Kembali -->
        <router-link :to="{ name: 'transaksi-penjualan' }" class="flex items-center gap-2 font-bold hover:text-blue-500 text-gray-600 mb-2">
            <ArrowLeft class="h-4 w-4" />
            Kembali
        </router-link>

        <div class="min-h-screen flex items-center justify-center">
            <div>
                <Loader2 class="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                <p class="text-gray-600 font-medium">Loading...</p>
            </div>
        </div>

        <template>
            <!-- HERO -->
            <InfoPasien />
            <!-- CONTENT -->
            <section class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <!-- Col kiri 2/3 -->
                <div class="lg:col-span-2 space-y-4">
                    <!-- Detail Pasien -->
                    <DetailPasien />
                    <!-- Vital Sign -->
                    <VitalSign />
                    <!-- Dokter -->
                    <DetailDokter />
                    <!-- OBAT -->
                    <DetailObat />
                    <!-- LAYANAN -->
                    <DetailLayanan />
                    <!-- TINDAKAN -->
                    <DetailTindakan />
                </div>
                <!-- Col kanan 1/3: Ringkasan -->
                <InfoPembayaran />
            </section>
        </template>
    </div>
</template>

<script setup>
import InfoPasien from './components/InfoPasien.vue';
import DetailPasien from './components/DetailPasien.vue';
import VitalSign from './components/VitalSign.vue';
import DetailDokter from './components/DetailDokter.vue';
import DetailLayanan from './components/DetailLayanan.vue';
import DetailTindakan from './components/DetailTindakan.vue';
import InfoPembayaran from './components/InfoPembayaran.vue';
import DetailObat from './components/DetailObat.vue';
import { ArrowLeft, Loader2 } from 'lucide-vue-next';
</script>