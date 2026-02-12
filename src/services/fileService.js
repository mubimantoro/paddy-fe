import config from "./env";

class FileService {
  /**
   * Get full image URL
   */
  getImageUrl(imagePath) {
    if (!imagePath) return null;
    
    // If already full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Build full URL
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${config.apiBaseUrl}${cleanPath}`;
  }

  
  getPlaceholderImage() {
    return '/images/placeholder.png';
  }
}

export default new FileService();