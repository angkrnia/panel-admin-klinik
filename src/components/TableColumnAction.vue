<template>
  <el-table-column fixed="right" :min-width="minWidth">
    <template #header>
      <div class="flex gap-3 items-center justify-center">
        <p>Aksi</p>
      </div>
    </template>
    <template #default="{ row }">
      <div class="table-fixed-icon flex items-center justify-center gap-x-2">
        <el-tooltip v-if="showAmbilAntrian" class="box-item" popper-class="custom-popper" effect="dark" content="Ambil Antrian" placement="top" :enterable="false">
          <el-icon class="item" @click="handlGetQueue(row)">
            <Pointer />
          </el-icon>
        </el-tooltip>
        <el-tooltip v-if="showEdit" class="box-item" popper-class="custom-popper" effect="dark" content="Ubah" placement="top" :enterable="false">
          <el-icon class="item" @click="handleEdit(row)">
            <edit />
          </el-icon>
        </el-tooltip>
        <el-tooltip v-if="showView" class="box-item" popper-class="custom-popper" effect="dark" content="View" placement="top" :enterable="false">
          <el-icon class="item" @click="handleView(row)"><zoom-in /></el-icon>
        </el-tooltip>
        <el-tooltip v-if="showHistory" class="box-item" popper-class="custom-popper" effect="dark" content="History" placement="top" :enterable="false">
          <el-icon class="item" @click="handleHistory(row)"><refresh-left /></el-icon>
        </el-tooltip>
        <el-popconfirm v-if="showDelete" confirm-button-text="Yes" cancel-button-text="No" :icon="InfoFilled" icon-color="red" :title="createDeleteTitle(row)"
          @confirm="handleDelete(row)" content="Hapus">
          <template #reference>
            <el-icon class="item">
              <el-tooltip class="box-item" popper-class="custom-popper" effect="dark" content="Hapus" placement="top" :enterable="false">
                <delete />
              </el-tooltip>
            </el-icon>
          </template>
        </el-popconfirm>
        <el-tooltip v-if="showPrint" class="box-item" popper-class="custom-popper" effect="dark" content="Print" placement="top" :enterable="false">
          <el-icon class="item" @click="handlePrint(row)">
            <Document />
          </el-icon>
        </el-tooltip>
      </div>
    </template>
  </el-table-column>
</template>

<script setup>
import { Edit, Delete, ZoomIn, RefreshLeft, InfoFilled, Document, Pointer } from '@element-plus/icons-vue';
import { toRaw, ref } from 'vue';

const emit = defineEmits([
  'click-edit',
  'click-view',
  'click-history',
  'click-barcode',
  'click-delete',
  'click-void',
  'click-payment',
  'click-usage',
]);
const props = defineProps({
  showEdit: {
    type: Boolean,
    default: false,
  },
  showView: {
    type: Boolean,
    default: false,
  },
  showHistory: {
    type: Boolean,
    default: false,
  },
  showBarcode: {
    type: Boolean,
    default: false,
  },
  showDelete: {
    type: Boolean,
    default: false,
  },
  showVoid: {
    type: Boolean,
    default: false,
  },
  titleVoid: {
    type: String,
    default: 'Apakah Anda akan mengubah status ke Void?',
  },
  showPayment: {
    type: Boolean,
    default: false,
  },
  showUsage: {
    type: Boolean,
    default: false,
  },
  showPrint: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: '',
  },
  tableHeader: {
    type: Array,
    default: () => [],
  },
  showAmbilAntrian: {
    type: Boolean,
    default: false,
  }
});
const minWidth = ref(null);

const handleEdit = (row) => emit('click-edit', toRaw(row));
const handlGetQueue = (row) => emit('click-queue', toRaw(row));
const handleView = (row) => emit('click-view', toRaw(row));
const handleHistory = (row) => emit('click-history', toRaw(row));
const handleDelete = (row) => emit('click-delete', toRaw(row));
const handlePrint = (row) => emit('click-print', toRaw(row));

//get how many menus are active and calculate the minimum width
(() => {
  const showList = toRaw(props);

  let counter = 0;
  for (const key in showList) {
    if (showList[key]) {
      counter++;
    }
  }
  if (counter < 2) {
    minWidth.value = 60;
  } else if (counter < 3) {
    minWidth.value = 70;
  } else if (counter < 4) {
    minWidth.value = 80;
  } else if (counter < 5) {
    minWidth.value = 90;
  } else {
    minWidth.value = 100;
  }
})();

function createDeleteTitle(row) {
  if (props.name) {
    return `Anda yakin akan menghapus (${row[props.name]})?`;
  }
  return `Anda yakin akan menghapus ini?`;
}
</script>

<style scoped>
.custom-popper {
  padding: 5px 10px;
  font-size: 0.7rem;
}

.item {
  font-size: large;
  cursor: pointer;
}
</style>
