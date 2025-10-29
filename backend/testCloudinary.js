import cloudinary from './src/lib/cloudinary.js';

const testUpload = async () => {
  try {
    // Complete 1x1 pixel PNG base64 string
    const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'chat_images',
      resource_type: 'image', // Explicitly specify image type
    });
    console.log('Cloudinary upload result:', result);
  } catch (error) {
    console.error('Cloudinary test error:', error);
  }
};

testUpload();