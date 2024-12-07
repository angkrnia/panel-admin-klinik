<template>
    <section>
        <h1>Halo!</h1>
        <el-collapse>
            <el-collapse-item name="1">
                <template #title>
                    <h1 class="tracking-wide capitalize text-base">Filter</h1>
                </template>
                <el-form label-width="150px" label-position="top" :model="filterData" class="mb-5">
                    <div class="rounded-lg border p-2 flex flex-col space-y-3 bg-slate-50">
                        <div class=" py-2 flex gap-2 items-center flex-wrap ">
                            <el-select-v2 v-model="filterData.SORT" :options="[
                                { label: 'Semua', value: '' },
                                { label: 'A-Z', value: 'ASC' },
                                { label: 'Z-A', value: 'DESC' },
                            ]" filterable placeholder="Pilih Urutan" @change="(val) => { onFilterData('SORT', val) }" class="el-width-for-filter text-xs"></el-select-v2>
                            <el-select-v2 v-model="filterData.ORDER_BY" :options="[
                                { label: 'Semua', value: '' },
                                { label: 'Tanggal', value: 'DATE' },
                            ]
                                " filterable placeholder="Pilih Filter" @change="(val) => { onFilterData('ORDER_BY', val) }" class="el-width-for-filter text-xs"></el-select-v2>
                            <ElDateRangeInput v-model:startDate="filterData.EFF_DATE" v-model:endDate="filterData.EXP_DATE" class="flex-1" @change="(val) => {
                                onFilterData('DATE', val)
                            }" />
                        </div>
                    </div>
                </el-form>
            </el-collapse-item>
        </el-collapse>
    </section>
</template>

<script setup>
</script>