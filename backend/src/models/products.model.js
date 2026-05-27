'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            // A product has many images
            Product.hasMany(models.ProductImage, {
                foreignKey: 'productId',
                as: 'images',
                onDelete: 'CASCADE'
            });

            // A product has many variations
            Product.hasMany(models.ProductVariation, {
                foreignKey: 'productId',
                as: 'variations',
                onDelete: 'CASCADE'
            });
        }
    }

    Product.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        discountedPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Categories',
                key: 'id'
            }
        },
        stockQuantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        badge: {
            type: DataTypes.STRING,
            allowNull: true
        },
        variantGroups: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        },
        tags: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        image: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        }
    }, {
        sequelize,
        modelName: 'Product',
    });

    return Product;
};