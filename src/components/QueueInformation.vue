<template>
    <section class="flex items-center justify-center min-h-44 border rounded-lg m-2 p-5 shadow-sm">
        <div class="flex flex-col items-center justify-center space-y-2">
            <h1 class="text-2xl font-bold">Nomor Antrian</h1>
            <h1 class="text-7xl font-extrabold text-black">{{ item.queue }}</h1>

            <div class="flex flex-col items-center justify-center space-y-1">
                <h1>Pasien: <span class="font-semibold">{{ item.patient }}</span></h1>
                <h1>Status: <span class="font-semibold">{{ item.status }}</span></h1>
                <h1>Dokter: <span class="font-semibold">{{ item.doctor }}</span></h1>
            </div>

            <div>
                <el-button type="primary" @click="() => emit('close-click')">Tutup</el-button>
            </div>
        </div>
    </section>
</template>

<script setup>
const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['close-click'])
</script>