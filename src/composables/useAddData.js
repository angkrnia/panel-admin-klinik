import { ref, watch } from "vue";
import { createDebounce, isValElForm, messageInfo } from "../helpers/utils";
import { catchError, catchErrorFinally } from "../helpers/catchResp";

export default function useAddData(options = { returnAsArray: false }) {
  const addData = ref({});
  const addForm = ref(null);
  const addDialog = ref(false);
  const requiredLabel = ref([]);
  const successLabel = ref([]);
  const requiredLabelLength = ref({});
  const clickElement = ref(0);
  const isLoading = ref(false);

  watch(addDialog, () => {
    if (!addDialog.value && addForm.value) {
      addForm.value.clearValidate();
      addForm.value.resetFields();
    } else if (addForm.value) {
      addForm.value.clearValidate();
      addForm.value.resetFields();
      addForm.value = null;
    }
  });

  watch(addForm, () => {
    if (addForm.value && addDialog.value) {
      setTimeout(() => {
        addForm.value.$el[0].click();
        addForm.value.$el[0].focus();
        requiredLabel.value = document.querySelectorAll(
          ".el-form-item.is-required"
        );
      }, 100);
    }
  });

  watch(addData.value, () => {
    createDebounce(() => {
      requiredLabel.value = document.querySelectorAll(
        ".el-form-item.is-required"
      );
      successLabel.value = document.querySelectorAll(
        ".el-form-item.is-success"
      );
      requiredLabelLength.value = {
        requiredLabel: requiredLabel.value?.length,
        successLabel: successLabel.value?.length,
      };
    });
  });

  const saveAdd = async (
    apiURL,
    callback,
    optionalData,
    loadingComponent = true
  ) => {
    const resultVal = await isValElForm(addForm.value);
    if (!resultVal) {
      return messageInfo("Terdapat form yang belum diisi.");
    }
    if (loadingComponent) {
      catchError(async () => {
        const { status, data } = await apiURL(optionalData || addData.value);
        if (status == 201 || status == 200) {
          addDialog.value = false;
          messageInfo(data.message || "Berhasil menyimpan data", "success");
          if (callback) callback(data.data);
        }
      });
    } else {
      isLoading.value = true;
      catchErrorFinally(
        async () => {
          const { status, data } = await apiURL(optionalData || addData.value);
          if (status == 201 || status == 200) {
            addDialog.value = false;
            messageInfo(data.message || "Berhasil menyimpan data", "success");
            if (callback) callback(data.data);
          }
        },
        () => (isLoading.value = false)
      );
    }
  };

  const cancelAdd = () => {
    addDialog.value = false;
  };

  const openDialog = (autoClickElement) => {
    if (autoClickElement) clickElement.value = autoClickElement;
    addDialog.value = true;
  };

  if (options.returnAsArray) {
    return [
      addData,
      addForm,
      addDialog,
      saveAdd,
      cancelAdd,
      requiredLabelLength,
      openDialog,
      isLoading,
    ];
  } else {
    return {
      addData,
      addForm,
      addDialog,
      saveAdd,
      cancelAdd,
      requiredLabelLength,
      openDialog,
      isLoading,
    };
  }
}
