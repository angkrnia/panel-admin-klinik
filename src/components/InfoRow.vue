<template>
    <div class="flex items-start gap-3">
        <component :is="Icon" class="w-4 h-4 text-gray-400 mt-0.5" />
        <div class="flex-1">
            <div class="text-xs text-gray-500">{{ label }}</div>
            <div :class="['font-medium', isEmpty ? 'italic text-gray-400' : 'text-gray-800']">
                {{ value }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import {
    Pill,
    Database,
    CircleDot,
    Package,
    GlassWater,
    StickyNote
} from 'lucide-vue-next'

const props = defineProps({
    icon: String,
    label: String,
    value: String,
    isEmpty: {
        type: Boolean,
        default: false
    }
})

const iconMap = {
    pill: Pill,
    database: Database,
    'circle-dot': CircleDot,
    package: Package,
    'glass-water': GlassWater,
    'sticky-note': StickyNote
}

const Icon = computed(() => iconMap[props.icon])
</script>
