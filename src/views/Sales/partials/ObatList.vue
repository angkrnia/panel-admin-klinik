<script setup>
import { computed } from 'vue'
import { convertRp } from '../../../helpers/utils'

const props = defineProps({
    medicineList: {
        type: Array,
        required: true,
    },
    loadingMedicine: {
        type: Boolean,
        required: true
    }
})

const getPrice = (item) => {
    if (item.is_compound) {
        return item.compound_meds.reduce((total, med) => {
            return total + (parseFloat(med.product?.sell_price || 0) * parseFloat(med.amount))
        }, 0)
    }
    return parseFloat(item.product?.sell_price || 0) * item.qty
}

const totalHarga = computed(() => {
    return props.medicineList.reduce((sum, item) => sum + getPrice(item), 0)
})
</script>

<template>
    <template v-if="loadingMedicine">
        <div class="flex items-center justify-center w-full col-span-2">
            <h1 class="font-semibold text-sm text-center">Loading...</h1>
        </div>
    </template>
    <template v-else>
        <div v-for="(item, index) in medicineList" :key="index" class="border border-gray-200 rounded-xl p-4 shadow-sm bg-white flex flex-col">
            <!-- Konten utama -->
            <div class="flex-1">
                <span class="text-sm px-3 py-1 rounded-lg font-bold" :class="{
                    'bg-orange-200 text-orange-600': item.status === 'completed',
                    'bg-red-400 text-white': item.status === 'rejected',
                    'bg-green-200 text-green-600': item.status === 'pending',
                }">{{ item.status_name || '-' }}</span>
                <h2 class="text-lg font-semibold mb-1 mt-2 text-gray-800">
                    {{ item.is_compound ? item.compound_name : item.product?.name }}
                </h2>
                <div class="text-sm text-gray-500 mb-2">
                    Dosis: <span class="text-gray-700">{{ item.dosage }}</span> |
                    Jumlah: <span class="text-gray-700">{{ item.qty }}</span>
                    <template v-if="!item.is_compound && item.unit?.name">
                        <span class="text-gray-700">({{ item.unit.name }})</span>
                    </template>
                </div>
                <div class="text-sm text-gray-600 mb-1">Petunjuk: {{ item.usage_instruction || '-' }}</div>
                <div class="text-sm text-gray-600 mb-1">Catatan: {{ item.notes || '-' }}</div>
                <div class="text-sm text-gray-600 mb-2" v-if="item.mix_instruction">
                    Instruksi Racik: {{ item.mix_instruction }}
                </div>

                <!-- Obat campuran -->
                <div v-if="item.is_compound" class="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                    <h3 class="font-medium text-sm text-gray-600 mb-2">Detail Campuran:</h3>
                    <div v-for="(med, idx) in item.compound_meds" :key="idx" class="text-sm text-gray-700">
                        <div class="flex justify-between">
                            <span>{{ med.product?.name }} ({{ med.amount }} {{ med.unit?.name }})</span>
                            <span>{{ convertRp(parseFloat(med.product?.sell_price || 0) * parseFloat(med.amount)) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Harga di bawah -->
            <div class="mt-4 border-t pt-2 flex justify-between text-sm font-semibold text-gray-700">
                <span>Total</span>
                <span>{{ convertRp(getPrice(item)) }}</span>
            </div>
        </div>
    </template>
</template>
