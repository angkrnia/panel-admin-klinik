<template>
    <el-autocomplete v-model="text" :fetch-suggestions="getSaran" :trigger-on-focus="false" :highlight-first-item="true" placeholder="Cari pasien, erm, no. hp" clearable
        class="w-full rounded-lg" @select="(s) => $emit('select', s._raw)">
        <!-- prefix icon -->
        <template #prefix>
            <el-icon class="text-gray-400">
                <Search />
            </el-icon>
        </template>

        <!-- item tampilan -->
        <template #default="{ item }">
            <div class="flex flex-col">
                <p class="font-medium truncate capitalize" v-html="highlight(item._raw?.fullname || '', text)"></p>
                <span class="text-xs text-gray-500" v-html="highlight(item._raw?.record_no || '', text)"></span>
            </div>
        </template>
    </el-autocomplete>
</template>

<script setup>
import { ref, watch } from 'vue'
import { listPasienPagination } from '../../api/pasienApi'
import { Search } from 'lucide-vue-next'
import { highlight } from '../../helpers/utils'

const props = defineProps({
    modelValue: { type: String, default: '' },
    minChars: { type: Number, default: 2 },
})
const emit = defineEmits(['update:modelValue', 'select'])

const text = ref(props.modelValue)
watch(() => props.modelValue, v => (text.value = v))
watch(text, v => emit('update:modelValue', v))

async function getSaran(q, cb) {
    if (!q || q.length < props.minChars) return cb([])
    try {
        const { data } = await listPasienPagination(1, 25, q)
        const result = data?.data?.data || [];
        cb(
            result?.map(p => ({
                value: p.fullname,
                _raw: p,
            }))
        )
    } catch (e) {
        cb([])
    }
}
</script>

<style scoped>
:deep(.el-input__wrapper) {
    border-radius: 8px !important;
}
</style>