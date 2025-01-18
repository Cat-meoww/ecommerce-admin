import { createImageUpload } from "novel/plugins";
import { toast } from "sonner";

const onUpload = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary upload preset

  const promise = fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", { // Replace with your Cloudinary cloud name
    method: "POST",
    body: formData,
  });

  return new Promise((resolve) => {
    toast.promise(
      promise.then(async (res) => {
        // Successfully uploaded image
        if (res.status === 200) {
          const { secure_url }: { secure_url: string } = await res.json();
          // preload the image
          const image = new Image();
          image.src = secure_url;
          image.onload = () => {
            resolve(secure_url);
          };
          // Unknown error
        } else {
          throw new Error(`Error uploading image. Please try again.`);
        }
      }),
      {
        loading: "Uploading image...",
        success: "Image uploaded successfully.",
        error: (e) => e.message,
      },
    );
  });
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      toast.error("File type not supported.");
      return false;
    } else if (file.size / 1024 / 1024 > 20) {
      toast.error("File size too big (max 20MB).");
      return false;
    }
    return true;
  },
});