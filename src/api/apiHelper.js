import { axiosAuth } from "../config/axios";

export function APIUploadPhotos(imageFiles) {
  const formData = new FormData();
  if (Array.isArray(imageFiles)) {
    for (const img of imageFiles) {
      formData.append("images[]", img, img.name);
    }
  } else {
    formData.append("images[]", imageFiles, imageFiles.name);
  }
  return axiosAuth.post("/upload/photos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 600000,
  });
}
