<template>
    <div>
        <div class="text-gray-500 text-sm">{{ label }}</div>
        <div class="font-medium text-gray-800 whitespace-pre-line">{{ value }}</div>
    </div>
</template>

<script setup>
defineProps(['label', 'value'])
</script>