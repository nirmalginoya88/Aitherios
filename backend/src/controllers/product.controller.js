const db = require('../models');
const Product = db.Product;
const ProductImage = db.ProductImage;
const ProductVariation = db.ProductVariation;
const { uploadImage, deleteImage } = require('../utils/cloudinary');
const fs = require('fs');

// Create Product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, categoryId, tags, stock } = req.body;
        const images = req.files;

        const stockQuantity = parseInt(stock);

        if (categoryId === "Footwear"){
            categoryId = 1;            
        }

        // Create product
        const product = await Product.create({
            name,
            description,
            price,
            categoryId,
            tags,
            stockQuantity
        });

        // Upload images to Cloudinary and save to database
        if (images && images.length > 0) {
            const imageUrls = [];
            for (const image of images) {
                const result = await uploadImage(image.path);
                imageUrls.push({
                    url: result.secure_url,
                    publicId: result.public_id
                });
                // Delete the local file
                fs.unlinkSync(image.path);
            }

            for (const imageUrl of imageUrls) {
                await ProductImage.create({
                    productId: product.id,
                    imageUrl: imageUrl.url,
                    publicId: imageUrl.publicId
                });
            }
        }

        res.status(201).json({ success: true, product });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ success: false, message: 'Failed to create product' });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                {
                    model: ProductImage,
                    as: 'images'
                },
                {
                    model: ProductVariation,
                    as: 'variations'
                }
            ]
        });
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch products' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, categoryId, tags } = req.body;
        const images = req.files;
        const { id } = req.params;

        // Find product
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Update product fields
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.categoryId = categoryId || product.categoryId;
        product.tags = tags || product.tags;

        // Update images if new ones are provided
        if (images && images.length > 0) {
            // Delete existing images from Cloudinary
            const existingImages = await ProductImage.findAll({ where: { productId: id } });
            for (const image of existingImages) {
                await deleteImage(image.publicId);
            }

            // Delete existing records from database
            await ProductImage.destroy({ where: { productId: id } });

            // Upload new images to Cloudinary
            const imageUrls = [];
            for (const image of images) {
                const result = await uploadImage(image.path);
                imageUrls.push({
                    url: result.secure_url,
                    publicId: result.public_id
                });
                // Delete the local file
                fs.unlinkSync(image.path);
            }

            // Save new image records to database
            for (const imageUrl of imageUrls) {
                await ProductImage.create({
                    productId: product.id,
                    imageUrl: imageUrl.url,
                    publicId: imageUrl.publicId
                });
            }
        }

        await product.save();

        // Reload product with associations
        const updatedProduct = await Product.findByPk(id, {
            include: [
                { model: ProductImage, as: 'images' },
                { model: ProductVariation, as: 'variations' }
            ]
        });

        res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Failed to update product' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Find product
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Delete all associated images from Cloudinary
        const images = await ProductImage.findAll({ where: { productId: id } });
        for (const image of images) {
            await deleteImage(image.publicId);
        }

        // Delete product from database
        await Product.destroy({ where: { id } });

        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, message: 'Failed to delete product' });
    }
};

module.exports = { createProduct, getProducts, updateProduct, deleteProduct };