import fileService from "../services/fileService";

export const getImageUrl = (imagePath) => {
  return fileService.getImageUrl(imagePath);
};

export const getPlaceholderImage = () => {
  return fileService.getPlaceholderImage();
};