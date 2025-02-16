<template>
  <el-input ref="inputRef" v-model="formattedValue" placeholder="Masukkan Nominal">
    <template #append v-if="showCopyButton">
      <div class="cursor-pointer w-full h-full flex items-center" @click="onClick">
        <el-icon>
          <CopyDocument />
        </el-icon>&nbsp;Copy
      </div>
    </template>
  </el-input>
</template>

<script>
import { CopyDocument } from '@element-plus/icons-vue';
import { useCurrencyInput } from 'vue-currency-input';
import { watch, reactive } from 'vue';

export default {
  name: 'ElCurrencyInput',
  components: {
    CopyDocument
  },
  props: {
    modelValue: Number,
    min: {
      type: Number,
      default: undefined,
    },
    max: {
      type: Number,
      default: undefined,
    },
    precision: {
      type: Number,
      default: 0,
    },
    showCopyButton: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const options = reactive({
      currency: 'IDR',
      locale: 'id',
      useGrouping: true,
      hideCurrencySymbolOnFocus: false,
      hideGroupingSeparatorOnFocus: false,
      hideNegligibleDecimalDigitsOnFocus: false,
      valueRange: {
        min: props.min,
        max: props.max,
      },
      precision: props.precision
    });

    const { inputRef, formattedValue, setValue, setOptions } = useCurrencyInput(options);

    watch(
      () => props.modelValue,
      (value) => {
        setValue(value);
      },
    );

    watch(
      () => props.min,
      (newValue) => {
        options.valueRange.min = newValue;
        setOptions(options)
      },
    );

    watch(
      () => props.max,
      (newValue) => {
        options.valueRange.max = newValue;
        setOptions(options)
      },
    );

    watch(
      () => props.precision,
      (newValue) => {
        options.precision = newValue;
        setOptions(options)
      },
    );

    const onClick = () => {
      emit('click-copy');
    }

    return { inputRef, formattedValue, setValue, onClick };
  },
};
</script>
