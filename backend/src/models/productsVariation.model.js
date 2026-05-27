'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProductVariation extends Model {
        static associate(models) {
            ProductVariation.belongsTo(models.Product, {
                foreignKey: 'productId',
                as: 'product',
                onDelete: 'CASCADE'
            });
        }
    }

    ProductVariation.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        productId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        stockQuantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sku: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'ProductVariation',
    });

    return ProductVariation;
};