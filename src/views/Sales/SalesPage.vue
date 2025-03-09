<template>
    <section>
        <TitleDashboard title="Riwayat Transaksi" />
    </section>

    <section>
        <el-collapse>
            <el-collapse-item name="1">
                <template #title>
                    <h1 class="tracking-wide capitalize text-base">Filter</h1>
                </template>
                <el-form label-width="150px" label-position="top" :model="filterData">
                    <div class="rounded-lg border p-2 bg-slate-50">
                        <div class=" py-2 gap-2 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
                            <el-select v-model="filterData.doctor_id" clearable filterable placeholder="Pilih Dokter" @change="(val) => { onFilterData('doctor_id', val) }"
                                class="el-width-for-filter text-xs">
                                <el-option v-for="item in doctorList" :key="item.id" :label="item.fullname" :value="item.id"></el-option>
                            </el-select>
                            <el-select-v2 v-model="filterData.sort" :options="[
                                { label: 'Semua', value: '' },
                                { label: 'A-Z', value: 'ASC' },
                                { label: 'Z-A', value: 'DESC' },
                            ]" filterable placeholder="Pilih Urutan" @change="(val) => { onFilterData('sort', val) }" class="el-width-for-filter text-xs"></el-select-v2>
                            <el-select v-model="filterData.status" filterable placeholder="Pilih Status" @change="(val) => { onFilterData('status', val) }"
                                class="el-width-for-filter text-xs">
                                <el-option v-for="item in filters" :key="item.name" :label="item.label" :value="item.name"></el-option>
                            </el-select>
                            <ElDateRangeInput v-model:startDate="filterData.from" v-model:endDate="filterData.to" class="flex-1" @change="(val) => {
                                onFilterData('date', val)
                            }" />
                        </div>
                    </div>
                </el-form>
            </el-collapse-item>
        </el-collapse>
    </section>
</template>

<script setup>
import useListDataPaginate from '../../composables/usePagination';

const { listData, rowTotal, pageIndex, pageSize, getListData, changeIndex, loading, filterData, search } = useListDataPaginate();
</script>