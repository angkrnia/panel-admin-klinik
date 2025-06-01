<template>
    <section>
        <div id="stickyElement" class="bg-white w-full sticky -top-3 z-10">
            <SearchAndPagination2 :row-total="rowTotal" :page-size="pageSize" :page-index="pageIndex" @change-page="changePage" @search="onSearch" @paginate="onPaginate" />
        </div>
        <div class="py-5">
            <el-table :data="listData" v-loading="loading" stripe border style="width: 100%">
                <el-table-column label="No" min-width="50">
                    <template #default="scope">
                        {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="product.name" label="Produk" min-width="180" />
                <el-table-column prop="movement_type" label="Tipe">
                    <template #default="{ row }">
                        <div class="flex items-center justify-center">
                            <el-tag effect="dark" round :type="row.movement_type == 'IN' ? 'primary' : 'danger'">
                                {{ row.movement_type }}
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="Pergerakan Stok" align="center">
                    <template #header>
                        <span style="font-weight: bold;">Pergerakan Stok</span>
                    </template>
                    <el-table-column prop="qty_in" label="Masuk" />
                    <el-table-column prop="qty_out" label="Keluar" />
                    <el-table-column prop="remaining" label="Sisa" />
                </el-table-column>
                <el-table-column prop="reference_type" label="Referensi" min-width="150" />
                <el-table-column prop="note" label="Catatan" min-width="150">
                    <template #default="scope">
                        <p class="line-clamp-1">{{ scope.row.note || '-' }}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="Dibuat" min-width="120">
                    <template #default="scope">
                        {{ convertDate(scope.row.created_at) }} ({{ scope.row.created_by }})
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="flex items-center justify-center">
            <el-pagination background layout="prev, pager, next" :total="rowTotal" :page-size="pageSize" @current-change="changePage" :current-page="currentPage"
                :hide-on-single-page="false" />
        </div>
    </section>
</template>

<script setup>
import { stockMovementPagination } from '../../api/stockApi';
import usePagination from '../../composables/usePagination';
import { convertDate } from '../../helpers/utils';


const {
    listData,
    rowTotal,
    pageIndex,
    pageSize,
    loading,
    getListData,
    filterData,
    search,
    changeIndex,
    currentPage,
} = usePagination();

function doPaginate(index, pSize) {
    getListData(stockMovementPagination, index, pSize ? pSize : pageSize.value, search.value, filterData.value);
}

function onSearch(textSearch) {
    search.value = textSearch;
    changePage();
}

function onPaginate(pageSize) {
    changeIndex(() => doPaginate(1, pageSize), 1, pageSize);
}

function changePage(index = 1) {
    changeIndex(() => doPaginate(index), index);
}

function onDetailView(row) {
    console.log(row)
}

doPaginate(pageIndex.value);
</script>