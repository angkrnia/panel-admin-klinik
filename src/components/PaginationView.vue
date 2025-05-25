<template>
  <div class="paginate" v-if="total">
    <el-pagination layout="prev, pager, next" :total="total" :page-size="pageSize" @current-change="changePage" :current-page="currentPage" background
      :hide-on-single-page="false"></el-pagination>
  </div>
  <div v-if="total" class="text-center paginate-info">
    <p class="text-sm text-gray-600 pt-1">{{ (currentPage - 1) * pageSize + 1 }} – {{ ((currentPage * pageSize) > total) ? total : currentPage * pageSize }} dari
      {{ formatRibuan(total) }} data ({{ formatRibuan(Math.ceil(total / pageSize)) }} halaman)</p>
  </div>
</template>

<script setup>
import { formatRibuan } from '../helpers/utils';

defineProps(['total', 'pageSize', 'currentPage']);
function changePage(current) {
  emit('current-change', current);
}
const emit = defineEmits(['current-change']);
</script>

<style scoped>
.paginate {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.paginate-info {
  font-size: 14px;
}
</style>
