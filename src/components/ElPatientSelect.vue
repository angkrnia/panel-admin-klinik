<template>
    <el-select-v2 v-model="modelValue" filterable remote clearable placeholder="Pilih atau Cari Pasien" :loading="patientListLoading" :remote-method="queryPatientList"
        :options="listData" @focus="(!modelValue && listData.length < 5) || listData.length <= 1 ? queryPatientList('') : ''" @change="updateValue(modelValue)"
        @clear="updateValue(null)" style="width: 100%" :height="240" />
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { queryPatientList, patientList as listData, patientListLoading } from '../helpers/autoCompleteQuery';

const prop = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'handle-change', 'clear']);

const modelV = computed(() => ref(prop.modelValue));
const modelValue = ref(modelV.value);

if (modelValue.value) {
    modelValue.value = modelValue.value;
    setByCode();
}

watch(modelV, (v) => {
    modelValue.value = v.value != undefined ? v.value : v.value;
    if (v.value != undefined) {
        setByCode();
    }
});

function setByCode() {
    let isFound = false;
    if (listData.value.length) {
        listData.value.filter((list) => {
            if (list.value == modelValue.value) {
                isFound = true;
            }
        });
    }
    if (!isFound) {
        queryPatientList(modelValue.value.toString(), true);
    }
}

function updateValue(value) {
    emit('clear', value);
    emit('update:modelValue', value);
    listData.value.filter((list) => {
        if (list.value == value) {
            emit('handle-change', list);
        }
    });
}
</script>