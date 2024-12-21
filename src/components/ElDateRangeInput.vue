<template>
  <el-date-picker
    v-model="filterDateRange"
    :type="dateType"
    unlink-panels
    range-separator="To"
    start-placeholder="Tanggal Mulai"
    end-placeholder="Tanggal Akhir"
    :disabled-date="isDateUpTo ? disabledDateUpTo : disabledDateDownTo"
    @calendar-change="dateChange"
    :shortcuts="useShortCut ? shortcuts : []"
    style="width: 100%"
    :height="240"
    :format="formatDate"
    :value-format="formatDateValue"
  />
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const prop = defineProps({
  isDateUpTo: {
    type: Boolean,
    default: true,
  },
  startDate: {
    type: String,
    default: '',
  },
  endDate: {
    type: String,
    default: '',
  },
  dateFormat: {
    type: String,
    default: '',
  },
  dateFormatValue: {
    type: String,
    default: '',
  },
  dateType: {
    type: String,
    default: 'daterange',
  },
  useShortCut: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['update:startDate', 'update:endDate']);

// format date and value format date is set default to this below, if you not supplied as property

const formatDate = computed(() => prop.dateFormat || 'YYYY/MM/DD');
const formatDateValue = computed(() => prop.dateFormatValue || 'YYYY-MM-DD');

const filterDateRange = ref(null);
let pickFirstDate = null;

filterDateRange.value = [prop.startDate, prop.endDate];

watch(filterDateRange, () => {
  if (filterDateRange.value) {
    emit('update:startDate', filterDateRange.value[0]);
    emit('update:endDate', filterDateRange.value[1]);
  } else {
    emit('update:startDate', null);
    emit('update:endDate', null);
    pickFirstDate = null;
  }
});

const disabledDateUpTo = (time) => {
  const today = new Date();
  return time.getTime() >= today.getTime();
};

const disabledDateDownTo = (time) => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  return time.getTime() <= today.getTime();
};

function dateChange(time) {
  pickFirstDate = time[0];
}

const shortcuts = [
  {
    text: 'This month',
    value: () => {
      const end = new Date();
      const start = new Date(end.getFullYear(), end.getMonth(), 1);
      return [start, end];
    },
  },
  {
    text: 'Last month',
    value: () => {
      const date = new Date();
      const end = new Date(date.getFullYear(), date.getMonth(), 0);
      const start = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      return [start, end];
    },
  },
  {
    text: 'Last 30 days',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: 'Last 90 days',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
  {
    text: 'This year',
    value: () => {
      const date = new Date();
      const end = new Date();
      const start = new Date(end.getFullYear(), 0, 1);
      return [start, end];
    },
  },
  {
    text: 'Last year',
    value: () => {
      const date = new Date();
      const end = new Date(date.getFullYear() - 1, 12, 0);
      const start = new Date(date.getFullYear() - 1, 0, 1);
      return [start, end];
    },
  },
  {
    text: 'Last 1 year',
    value: () => {
      const date = new Date();
      const end = new Date();
      const start = new Date(end.getFullYear() - 1, date.getMonth(), date.getDate());
      return [start, end];
    },
  },
];
</script>

<style lang="scss" scoped></style>
