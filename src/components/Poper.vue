<template>
    <el-popover class="box-item" effect="dark" :placement="position" trigger="hover">
        <template #default>
            <div class="text-center text-sm">
                <p class="leading-4 capitalize">{{ content }}</p>
            </div>
        </template>

        <template #reference>
            <slot></slot>
        </template>
    </el-popover>
</template>

<script setup>
const props = defineProps({
    content: {
        type: String,
        required: true
    },
    position: {
        type: String,
        default: 'top'
    }
})
</script>
