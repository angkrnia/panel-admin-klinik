import { ref } from "vue";
import { isObjectEmpty } from "../helpers/utils";
import { catchError, catchErrorFinally } from "../helpers/catchResp";

export default function useGetData(params = { defaultLoading: false }) {
  const dataRef = ref([]);
  const isLoading = ref(params.defaultLoading || false);

  const getData = (
    apiURL,
    isLoadingInside = false,
    isForceCallAndSave = false,
    callBack
  ) => {
    async function callAndSave() {
      const { data } = await apiURL();
      isLoading.value = false;
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
          () => {
            isLoading.value = false;
            if (callBack) {
              callBack(null);
            }
          }
        );
      } else {
        catchError(
          async () => callAndSave(),
          () => {
            if (callBack && !Array.isArray(dataRef.value) && dataRef.value.length == 0) {
              callBack(null);
            }
          }
        );
      }
    }
  };

  return [dataRef, getData, isLoading];
}
