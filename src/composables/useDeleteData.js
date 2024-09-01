import { catchError } from "../helpers/catchResp";
import { messageInfo } from "../helpers/utils";

export default function useDeleteData() {
  const deleteData = (callBack, apiURL, OBJECT_ID) => {
    catchError(async () => {
      const { status } = await apiURL(OBJECT_ID);
      if (status == 200) {
        messageInfo("Berhasil menghapus data", "success");
      }
      callBack();
    });
  };

  return { deleteData };
}
