<template>
    <el-popover class="box-item" :placement="position" trigger="hover">
        <template #default>
            <div class="text-center text-sm">
                {{ content }}
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
