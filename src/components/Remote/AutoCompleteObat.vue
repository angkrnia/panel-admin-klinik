<template>
    <el-autocomplete v-model="text" :fetch-suggestions="getSaran" :trigger-on-focus="false" :highlight-first-item="true" placeholder="Cari nama obat" clearable
        class="w-full rounded-lg" @select="(s) => $emit('select', s._raw)">
        <!-- prefix icon -->
        <template #prefix>
            <el-icon class="text-gray-400">
                <Search />
            </el-icon>
        </template>

        <!-- item tampilan -->
        <template #default="{ item }">
            <div class="flex items-center gap-3 py-2 border-b">
                <div class="h-9 w-9 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center">
                    <img v-if="item._raw.image" :src="item._raw.image" alt="" class="h-full w-full object-cover" />
                    <Pill v-else class="h-5 w-5 text-slate-400" />
                </div>

                <!-- Teks utama -->
                <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                        <p class="font-medium truncate capitalize" v-html="highlight(item._raw?.name || '', text)"></p>
                        <p v-if="item._raw.unit_name" class="text-[11px] px-2 py-0 rounded bg-blue-100 text-blue-600 whitespace-nowrap">
                            {{ item._raw.unit_name }}
                        </p>
                    </div>
                    <p class="text-xs text-gray-500 truncate">SKU: <span v-html="highlight(item._raw?.sku || '', text)"></span></p>
                </div>

                <!-- Harga -->
                <div class="text-sm font-semibold whitespace-nowrap">
                    {{ convertRp(item._raw.new_price || item._raw.sell_price) }}
                </div>
            </div>
        </template>
    </el-autocomplete>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Pill, Search } from 'lucide-vue-next'
import { APISelectProductsWithUnits } from '../../api/apiHelper'
import { convertRp, highlight } from '../../helpers/utils'

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
        const { data } = await APISelectProductsWithUnits(q)
        const result = data?.data || [];
        cb(
            result?.map(p => ({
                value: p.name,
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