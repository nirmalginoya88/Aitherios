const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a local file to Cloudinary under the 'aitherios/products' folder.
 * @param {string} filePath - Absolute path to the local file (from multer disk storage).
 * @returns {Promise<object>} Cloudinary upload result containing secure_url, public_id, etc.
 */
const uploadImage = (filePath) => {
    return cloudinary.uploader.upload(filePath, {
        folder: 'aitherios/products',
        resource_type: 'image',
    });
};

/**
 * Delete an image from Cloudinary by its public_id.
 * @param {string} publicId - The public_id returned when the image was uploaded.
 * @returns {Promise<object>} Cloudinary deletion result.
 */
const deleteImage = (publicId) => {
    return cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadImage, deleteImage };
