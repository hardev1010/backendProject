import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

// Upload a file
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file has been uploaded successfully
    console.log("file has been uploaded on cloudinary", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

//Delete a file
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) {
    console.error("Public ID is required to delete an image.");
    return null;
  }

  try {
    // Call Cloudinary to delete the image by public ID
    const response = await cloudinary.uploader.destroy(publicId);

    if (response.result === "ok") {
      console.log("Image deleted successfully:", publicId);
      return true;
    } else {
      console.error("Failed to delete image:", response);
      return false;
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return false;
  }
};

 export {uploadOnCloudinary, deleteFromCloudinary}