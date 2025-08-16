<template>
    <div class="rounded-2xl bg-white shadow ring-1 ring-slate-200 overflow-hidden" v-if="data">
        <header class="flex items-center gap-3 border-b border-slate-100 px-5 py-2 bg-gradient-to-r from-[#2564ebd7] to-fuchsia-400 text-white">
            <UserCheck class="h-5 w-5" />
            <h2 class="text-base font-semibold tracking-tight">
                Dokter Pemeriksa
            </h2>
        </header>
        <div class="p-5">
            <div class="flex items-start gap-4">
                <img src="https://i.pravatar.cc/120?img=15" alt="Foto Dokter" class="h-16 w-16 rounded-2xl object-cover ring-1 ring-slate-200" />
                <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                        <p class="text-base font-semibold">{{ data.fullname }}</p>
                        <span class="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200">Umum</span>
                    </div>
                    <p class="text-sm text-slate-600">
                        {{ data.phone }}
                    </p>
                    <p class="text-sm text-slate-600">
                        {{ data.description }}
                    </p>
                </div>
            </div>

            <div class="mt-4 flex items-start gap-3" v-if="saran">
                <Sparkles class="mt-0.5 h-5 w-5 text-violet-600"></Sparkles>
                <div class="w-full">
                    <div class="text-xs text-slate-500">Saran Dokter</div>
                    <div class="font-medium">
                        {{ saran }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Sparkles, UserCheck } from 'lucide-vue-next';

const props = defineProps({
    data: Object,
    saran: String
});
</script>