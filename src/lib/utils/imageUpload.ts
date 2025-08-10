import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { cloudinary } from "../cloudinary";

type UploadResponse =
  | { success: true; result: UploadApiResponse }
  | { success: false; error: UploadApiErrorResponse };

const uploadToCloudinary = (
  fileUri: string,
  fileName: string
): Promise<UploadResponse> => {
  return new Promise((resolve) => {
    cloudinary.uploader
      .upload(fileUri, {
        invalidate: true,
        resource_type: "auto",
        filename_override: fileName,
        folder: "sharix-images",
        use_filename: true,
      })
      .then((result) => {
        resolve({ success: true, result });
      })
      .catch((error) => {
        resolve({ success: false, error });
      });
  });
};

export { uploadToCloudinary };
