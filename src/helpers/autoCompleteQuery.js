import { ref } from "vue";
import { catchError } from "./catchResp";
import { listPasienSelect } from "../api/pasienApi";
import { APIProductSelect } from "../api/apiInventory";

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
            label: `${element.fullname} (${element.record_no ? element.record_no : "-"}) - ${element.nama_keluarga ? element.nama_keluarga : "-"} · ${
              element.address
            }`,
            value: element.id,
          });
        });
      }
      patientList.value = result;
      patientListLoading.value = false;
    }
  });
};

//Customer Master
export const productList = ref([]);
export const productListLoading = ref(false);
export const queryProductList = async (query) => {
  if (productList.value?.length && !query) return;
  productListLoading.value = true;
  catchError(async () => {
    const { status, data } = await APIProductSelect(query);
    if (status == 200 || status == 204) {
      const result = [];
      if (data.data?.length) {
        data.data.forEach((element) => {
          result.push({
            label: `${element.name} (stok: ${element.base_stock || "0"})`,
            value: element.id,
          });
        });
      }
      productList.value = result;
      productListLoading.value = false;
    }
  });
};

// Doctor Master
export const doctorList = ref([]);
export const doctorListLoading = ref(false);
