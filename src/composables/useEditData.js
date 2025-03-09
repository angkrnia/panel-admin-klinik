import { ref } from "vue";
import { isValElForm, messageInfo } from "../helpers/utils";
import { catchError } from "../helpers/catchResp";

export default function useEditData(options = { returnAsArray: false }) {
    const editData = ref({});
    const editForm = ref(null);
    const editDialog = ref(false);
    let editOrigin = {};

    const openEditDialog = async (objectEdit) => {
        editData.value = { ...objectEdit }; //create new object v1
        editDialog.value = true;
        editOrigin = JSON.parse(JSON.stringify(objectEdit)); //create new object v2
    };

    const saveEdit = async (apiURL, OBJECT_ID, callback, message) => {
        const resultVal = await isValElForm(editForm.value);
        if (!resultVal) return;

        catchError(async () => {
            const { status, data } = await apiURL(editData.value[OBJECT_ID], editData.value);
            if (status == 200 || status == 201) {
                if (!message) {
                    messageInfo("Berhasil mengubah data", "success");
                } else {
                    messageInfo(message, "success");
                }
                editDialog.value = false;
                if (callback) callback(data.data);
            }
        });
    };

    const cancelEdit = () => {
        editDialog.value = false;
        editForm.value.clearValidate();
    };

    if (options.returnAsArray) {
        return [editData, editForm, editDialog, openEditDialog, saveEdit, cancelEdit];
    } else {
        return {
            editData,
            editForm,
            editDialog,
            openEditDialog,
            saveEdit,
            cancelEdit,
        };
    }
}
