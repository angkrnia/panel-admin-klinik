<template>
    <!-- Product Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-6">
        <div v-for="medicine in props.medicines" :key="medicine.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
            <!-- Product Image -->
            <div class="relative h-48">
                <img :src="medicine.image" :alt="medicine.name" class="w-full h-full object-cover" />
                <div class="absolute top-2 right-2">
                    <span class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {{ medicine?.category?.name }}
                    </span>
                </div>
            </div>

            <!-- Product Info -->
            <div class="p-4 flex flex-col">
                <div class="mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">{{ medicine.name }}</h3>
                    <div class="flex items-center gap-2 text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        </svg>
                        <span>{{ medicine.sku }}</span>
                    </div>
                </div>

                <!-- Description -->
                <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ medicine.description }}</p>

                <!-- Units & Prices -->
                <div class="space-y-2 mb-4">
                    <div v-for="(unit, idx) in medicine.units" :key="idx" class="flex justify-between items-center text-sm">
                        <div>
                            <span class="font-medium">{{ unit.name }}</span>
                            <span class="text-gray-500 text-xs block">{{ unit.pivot.description }}</span>
                        </div>
                        <div class="text-right">
                            <span class="font-bold text-gray-800">
                                {{ convertRp(unit.pivot.new_price) }}
                            </span>
                            <span class="block text-xs" :class="unit.stock < 50 ? 'text-red-600' : 'text-green-600'">
                                Stok: {{ Math.floor(medicine.base_stock / unit.pivot.conversion_to_base) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 mt-auto p-3">
                <button class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors" @click="handleDetail(medicine)">
                    Detail
                </button>
                <button class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors" @click="handleEdit(medicine)">
                    Edit
                </button>
            </div>
        </div>
    </div>

    <!-- Vie Dialog -->
    <el-dialog v-model="viewDialog" title="Detail Obat" :width="dialogWidth()" top="5vh" @close="closeView">
        <div class="bg-white rounded-lg max-w-2xl w-full">
            <!-- Content -->
            <div class="p-6">
                <div class="flex flex-col md:flex-row gap-6">
                    <!-- Product Image -->
                    <div class="md:w-1/3">
                        <div class="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                            <img :src="viewData.image" :alt="viewData.name" class="w-full h-48 object-contain rounded-lg" />
                        </div>
                    </div>

                    <!-- Product Info -->
                    <div class="md:w-2/3">
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ viewData.name }}</h3>

                        <div class="flex items-center gap-2 mb-4">
                            <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {{ viewData.type.toUpperCase() }}
                            </span>
                            <span class="text-gray-500 text-sm">SKU: {{ viewData.sku }}</span>
                        </div>

                        <!-- Unit Selection -->
                        <div class="mb-6">
                            <label class="text-sm text-gray-600 mb-2 block">Pilih Satuan</label>
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <button v-for="unit in viewData.units" :key="unit.id" @click="selectedUnit = unit" :class="[
                                    'p-3 rounded-lg border text-left transition-all',
                                    selectedUnit.id === unit.id
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                ]">
                                    <div class="font-medium">{{ unit.name }}</div>
                                    <div class="text-sm text-gray-500">{{ unit.pivot.description }}</div>
                                </button>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div class="flex items-center gap-2">
                                <el-icon size="20">
                                    <Box />
                                </el-icon>
                                <div>
                                    <p class="text-sm text-gray-500">Stok</p>
                                    <p class="font-medium">{{ calculateStock(selectedUnit) }} {{ selectedUnit.name }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <el-icon size="20">
                                    <Paperclip />
                                </el-icon>
                                <div>
                                    <p class="text-sm text-gray-500">Kemasan</p>
                                    <p class="font-medium">{{ selectedUnit.pivot.description }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gray-50 rounded-lg p-4 mb-6">
                            <div class="flex items-center gap-2 mb-2">
                                <el-icon size="16">
                                    <Clock />
                                </el-icon>
                                <h4 class="font-medium text-gray-800">Aturan Pakai</h4>
                            </div>
                            <p class="text-gray-600">{{ viewData.dosage }}</p>
                        </div>

                        <div class="flex items-center justify-between bg-blue-50 rounded-lg p-4">
                            <div>
                                <p class="text-sm text-gray-600">Harga per {{ selectedUnit.name }}</p>
                                <p class="text-2xl font-bold text-blue-600">
                                    {{ convertRp(selectedUnit.pivot.sell_price) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Description -->
                <div class="mt-8">
                    <h4 class="font-semibold text-gray-800 mb-3">Deskripsi Produk</h4>
                    <div class="bg-gray-50 rounded-lg p-4">
                        <p class="text-gray-600 leading-relaxed">{{ viewData.description }}</p>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { convertRp, dialogWidth, formatRibuan } from '../../../helpers/utils'
import useViewData from '../../../composables/useViewData'
import { ref } from 'vue'
import { Box, Clock, Paperclip } from '@element-plus/icons-vue'

const props = defineProps({
    medicines: Array
})

const { viewData, viewDialog, closeView, openViewDialog } = useViewData()

const selectedUnit = ref({})

const handleDetail = (medicine) => {
    console.log('Detail medicine:', medicine)
    selectedUnit.value = medicine.units[0]
    openViewDialog(medicine)
}

const calculateStock = (unit) => {
    const baseStock = viewData.value.base_stock
    return formatRibuan(Math.floor(baseStock / unit.pivot.conversion_to_base))
}

const handleEdit = (medicine) => {
    console.log('Edit medicine:', medicine)
    // Implement edit logic
}
</script>