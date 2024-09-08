import { ref } from "vue";
import { catchError } from "./catchResp";
import { listPasienSelect } from "../api/pasienApi";

//Customer Master
export const patientList = ref([]);
export const patientListLoading = ref(false);
export const queryPatientList = async (query) => {
  if (patientList.value?.length && !query) return;
  patientListLoading.value = true;
  catchError(async () => {
    const { status, data } = await listPasienSelect(query);
    if (status == 200 || status == 204) {
      const result = [];
      if (data.data.data?.length) {
        data.data.data.forEach((element) => {
          result.push({
            label: `${element.fullname} (${
              element.record_no ? element.record_no : "-"
            }) · ${element.address}`,
            value: element.id,
          });
        });
      }
      patientList.value = result;
      patientListLoading.value = false;
    }
  });
};
