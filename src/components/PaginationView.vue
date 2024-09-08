<template>
  <div class="paginate" v-if="total">
    <el-pagination layout="prev, pager, next" :total="total" :page-size="pageSize" @current-change="changePage" :current-page="currentPage" background
      :hide-on-single-page="false"></el-pagination>
  </div>
  <div v-if="total" class="text-center paginate-info">
    <p class="text-sm text-gray-600 pt-1">Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ ((currentPage * pageSize) > total) ? total : currentPage * pageSize }} from
      {{ total }} data ({{ Math.ceil(total / pageSize) }} page)</p>
  </div>
</template>

<script setup>
// defineProps({
//   total: {
//     type: Number,
//     required: true,
//   },
//   pageSize: {
//     type: Number,
//     required: true,
//   },
//   currentPage: {
//     type: Number,
//     required: true,
//   },
// });
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
