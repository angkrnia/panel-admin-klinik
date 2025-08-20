<script setup>
import { computed } from 'vue';
import { convertRp } from '../../../helpers/utils';

const props = defineProps({
    procedureList: {
        type: Array,
        required: true
    },
    loadingTindakan: {
        type: Boolean,
        required: true
    }
})

const total = computed(() =>
    props.procedureList.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0)
)
</script>

<template>
    <template v-if="loadingTindakan">
        <div class="flex items-center justify-center w-full">
            <h1 class="font-semibold text-sm text-center">Loading...</h1>
        </div>
    </template>
    <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="item in procedureList" :key="item.id" class="border rounded-xl p-4 shadow-sm bg-white">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-medium text-gray-800">{{ item.tindakan_name }}</p>
                        <p class="text-sm text-gray-500">{{ item.quantity }} x {{ convertRp(item.tindakan_price) }}</p>
                        <p class="text-sm text-gray-500 capitalize">{{ item.source }}</p>
                        <p class="text-sm text-gray-500 capitalize" v-if="item.notes">{{ item.notes }}</p>
                    </div>
                    <div class="text-sm font-semibold text-gray-700">
                        {{ convertRp(item.total_price) }}
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>
