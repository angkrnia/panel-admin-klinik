<script setup>
import { computed } from 'vue';
import { convertRp } from '../../../helpers/utils';

const props = defineProps({
    procedureList: {
        type: Array,
        required: true
    }
})

const total = computed(() =>
    props.procedureList.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0)
)
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="item in procedureList" :key="item.id" class="border rounded-xl p-4 shadow-sm bg-white">
            <div class="flex justify-between items-center">
                <div>
                    <p class="font-medium text-gray-800">{{ item.procedure_name }}</p>
                    <p class="text-sm text-gray-500">{{ item.quantity }} x {{ convertRp(item.price) }}</p>
                    <p class="text-sm text-gray-500 capitalize">{{ item.source }}</p>
                    <p class="text-sm text-gray-500 capitalize">{{ item.notes || '-' }}</p>
                </div>
                <div class="text-sm font-semibold text-gray-700">
                    {{ convertRp(item.price * item.quantity) }}
                </div>
            </div>
        </div>
    </div>
</template>
