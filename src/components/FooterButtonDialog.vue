<template>
  <span class="dialog-footer">
    <el-button v-if="showCancelText" type="danger" plain @click="() => emit('cancel-click')">{{ cancelText }}</el-button>
    <el-popconfirm
      v-if="useConfirmation"
      confirm-button-text="Yes"
      cancel-button-text="No"
      :icon="InfoFilled"
      icon-color="red"
      :title="textConfirm"
      @confirm="() => emit('save-click')"
      content="Hapus"
    >
      <template #reference>
        <el-button type="primary" :icon="Save">{{ saveText }}</el-button>
      </template>
    </el-popconfirm>
    <el-button v-else type="primary" @click="() => emit('save-click')" :icon="Save">{{ saveText }}</el-button>
  </span>
</template>

<script setup>
import { InfoFilled } from '@element-plus/icons-vue';
import { Save } from 'lucide-vue-next';

defineProps({
  saveText: {
    type: String,
    default: 'Simpan',
  },
  cancelText: {
    type: String,
    default: 'Batal',
  },
  useConfirmation: {
    type: Boolean,
    default: false,
  },
  textConfirm: {
    type: String,
    default: 'Apakah anda yakin?',
  },
  showCancelText: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['save-click', 'cancel-click']);
</script>
