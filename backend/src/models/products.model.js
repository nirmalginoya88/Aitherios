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
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        basePrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Categories',
                key: 'id'
            }
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