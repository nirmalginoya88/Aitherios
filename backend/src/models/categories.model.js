'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            Category.hasMany(models.Product, {
                foreignKey: 'categoryId',
                as: 'products'
            });
        }
    }

    Category.init({
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
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        parentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'Categories',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Category',
    });

    return Category;
};