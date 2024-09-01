import { ref } from "vue";
import { isObjectEmpty } from "../helpers/utils";
import { catchError, catchErrorFinally } from "../helpers/catchResp";

export default function useGetData() {
  const dataRef = ref([]);
  const isLoading = ref(false);

  const getData = (apiURL, isLoadingInside, isForceCallAndSave, callBack) => {
    async function callAndSave() {
      const { data } = await apiURL();
      if (callBack) {
        callBack(data.data);
      }
      if (Array.isArray(data.data)) {
        dataRef.value = data.data;
      } else {
        if (!data.data) {
          dataRef.value = [];
          return;
        }
        if (Object.entries(data.data).length == 0) {
          dataRef.value.data = [];
        } else {
          dataRef.value = data.data;
        }
      }
    }

    if (isObjectEmpty(dataRef.value) || isForceCallAndSave) {
      if (isLoadingInside) {
        isLoading.value = true;
        catchErrorFinally(
          async () => callAndSave(),
          () => (isLoading.value = false)
        );
      } else {
        catchError(async () => callAndSave());
      }
    }
  };

  return [dataRef, getData, isLoading];
}
