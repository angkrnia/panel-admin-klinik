<template>
  <el-form :rules="rules" :model="search">
    <section class="flex flex-col md:flex-row items-center justify-center md:justify-between h-full">
      <div class="flex items-center gap-3 w-full h-full">
        <div class="w-60" id="searchInput">
          <el-form-item class="pt-4" prop="search">
            <el-input class="h-[35px]" placeholder="Search" :prefix-icon="Search" clearable v-model="search.search"></el-input>
          </el-form-item>
        </div>
        <div class="min-w-24 h-auto" id="menuLength">
          <el-select fit-input-width v-model="record" placeholder="Records per page">
            <el-option label="10" value="10" />
            <el-option label="25" value="25" />
            <el-option label="50" value="50" />
            <el-option label="100" value="100" />
          </el-select>
        </div>
        <slot />
      </div>
      <div class="w-full flex justify-center sm:justify-end">
        <div id="pagination">
          <PaginationView :total="rowTotal" :page-size="pageSize" :current-page="pageIndex" @current-change="changePage" />
        </div>
      </div>
    </section>
  </el-form>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Search } from '@element-plus/icons-vue';

const route = useRoute();
const props = defineProps({
  showFilter: {
    type: Boolean,
    default: false,
  },
  activeFilter: {
    type: Boolean,
    default: false,
  },
  rowTotal: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 0,
  },
  pageIndex: {
    type: Number,
    default: 1,
  },
});
const defaultRecord = computed(() => (route.query.page ? route.query.page : import.meta.env.VITE_PAGE_SIZE));
const record = ref(defaultRecord.value);
const search = ref({ search: null });
const rules = {
  search: [
    {
      min: 3,
      message: 'Min 3 karakter',
      trigger: ['blur', 'change'],
    },
    {
      max: 150,
      message: 'Max 150 karakter',
      trigger: ['blur', 'change'],
    },
  ],
};
const searchValue = computed(() => search.value.search);

watch(record, (value) => {
  emit('paginate', value);
});

watch(searchValue, (value) => {
  if ((value.length >= rules.search[0].min && value.length <= rules.search[1].max) || value.length == 0) {
    createDebounce(value);
  }
});

let timeout = null;
function createDebounce(value) {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit('search', value);
  }, 500);
}

function onClickFilter() {
  emit('filter');
}

function changePage(current) {
  emit('change-page', current);
}

const emit = defineEmits(['search', 'paginate', 'filter', 'change-page']);
</script>