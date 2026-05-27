const db = require('../models');
const Product = db.Product;
const ProductImage = db.ProductImage;
const ProductVariation = db.ProductVariation;
const Category = db.Category;
const { uploadImage, deleteImage } = require('../utils/cloudinary');
const fs = require('fs');

// Helper to map Sequelize product instance to frontend expected payload
const mapProductResponse = (product) => {
    if (!product) return null;
    const json = product.toJSON ? product.toJSON() : product;
    return {
        ...json,
        stock: json.stockQuantity,
        category: json.category?.name || 'Uncategorized',
        variants: {
            sizes: json.variations ? json.variations.map(v => v.name) : []
        }
    };
};

// Create Product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, tags, stock, slug, badge, variants } = req.body;
        const images = req.files;

        const stockQuantity = stock ? parseInt(stock) : 0;
        
        // Resolve category string to categoryId
        let categoryId = null;
        if (category) {
            const [catRecord] = await Category.findOrCreate({
                where: { name: category.trim() },
                defaults: { name: category.trim() }
            });
            categoryId = catRecord.id;
        }

        // Parse tags if they are a JSON string or regular string
        let parsedTags = [];
        if (tags) {
            try {
                parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
            } catch (e) {
                parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
            }
        }

        // Create product
        const product = await Product.create({
            name,
            slug,
            description,
            price: parseFloat(price) || 0,
            categoryId,
            tags: parsedTags,
            stockQuantity,
            badge
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
                try {
                    fs.unlinkSync(image.path);
                } catch (err) {
                    console.error('Failed to delete temp file:', err);
                }
            }

            for (let i = 0; i < imageUrls.length; i++) {
                await ProductImage.create({
                    productId: product.id,
                    imageUrl: imageUrls[i].url,
                    publicId: imageUrls[i].publicId,
                    isPrimary: i === 0
                });
            }
        }

        // Parse and create variations if provided
        if (variants) {
            let parsedVariants = null;
            try {
                parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
            } catch (e) {
                console.error('Error parsing variants:', e);
            }

            if (parsedVariants && Array.isArray(parsedVariants.sizes)) {
                for (const size of parsedVariants.sizes) {
                    await ProductVariation.create({
                        productId: product.id,
                        name: size,
                        price: parseFloat(price) || 0,
                        stockQuantity: Math.ceil(stockQuantity / parsedVariants.sizes.length) || 0
                    });
                }
            }
        }

        // Reload the full product with all nested associations to match frontend expectations
        const createdProduct = await Product.findByPk(product.id, {
            include: [
                { model: ProductImage, as: 'images' },
                { model: ProductVariation, as: 'variations' },
                { model: Category, as: 'category' }
            ]
        });

        res.status(201).json({ success: true, product: mapProductResponse(createdProduct) });
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
                },
                {
                    model: Category,
                    as: 'category'
                }
            ]
        });
        const mappedProducts = products.map(product => mapProductResponse(product));
        res.status(200).json({ success: true, products: mappedProducts });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch products' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, tags, stock, slug, badge, variants } = req.body;
        const images = req.files;
        const { id } = req.params;

        // Find product
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Update basic product fields
        product.name = name || product.name;
        product.slug = slug || product.slug;
        product.description = description || product.description;
        product.price = price ? parseFloat(price) : product.price;
        product.badge = badge || product.badge;

        if (stock !== undefined) {
            product.stockQuantity = parseInt(stock);
        }

        if (category) {
            const [catRecord] = await Category.findOrCreate({
                where: { name: category.trim() },
                defaults: { name: category.trim() }
            });
            product.categoryId = catRecord.id;
        }

        if (tags) {
            try {
                product.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
            } catch (e) {
                product.tags = tags.split(',').map(t => t.trim()).filter(Boolean);
            }
        }

        // Update images if new ones are provided
        if (images && images.length > 0) {
            // Delete existing images from Cloudinary
            const existingImages = await ProductImage.findAll({ where: { productId: id } });
            for (const image of existingImages) {
                if (image.publicId) {
                    try {
                        await deleteImage(image.publicId);
                    } catch (err) {
                        console.error('Cloudinary deletion failed:', err);
                    }
                }
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
                try {
                    fs.unlinkSync(image.path);
                } catch (err) {
                    console.error('Failed to delete temp file:', err);
                }
            }

            // Save new image records to database
            for (let i = 0; i < imageUrls.length; i++) {
                await ProductImage.create({
                    productId: product.id,
                    imageUrl: imageUrls[i].url,
                    publicId: imageUrls[i].publicId,
                    isPrimary: i === 0
                });
            }
        }

        // Update variations if provided
        if (variants) {
            let parsedVariants = null;
            try {
                parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
            } catch (e) {
                console.error('Error parsing variants:', e);
            }

            if (parsedVariants && Array.isArray(parsedVariants.sizes)) {
                // Delete existing variations from database
                await ProductVariation.destroy({ where: { productId: id } });

                // Create new ones
                const stockQty = stock !== undefined ? parseInt(stock) : product.stockQuantity;
                const currentPrice = price ? parseFloat(price) : product.price;

                for (const size of parsedVariants.sizes) {
                    await ProductVariation.create({
                        productId: product.id,
                        name: size,
                        price: currentPrice || 0,
                        stockQuantity: Math.ceil(stockQty / parsedVariants.sizes.length) || 0
                    });
                }
            }
        }

        await product.save();

        // Reload product with associations
        const updatedProduct = await Product.findByPk(id, {
            include: [
                { model: ProductImage, as: 'images' },
                { model: ProductVariation, as: 'variations' },
                { model: Category, as: 'category' }
            ]
        });

        res.status(200).json({ success: true, product: mapProductResponse(updatedProduct) });
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
            if (image.publicId) {
                try {
                    await deleteImage(image.publicId);
                } catch (err) {
                    console.error('Cloudinary deletion failed:', err);
                }
            }
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