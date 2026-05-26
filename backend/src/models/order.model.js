'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // An order belongs to a user (customer)
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'customer'
      });
    }
  }

  Order.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false
    },
    items: {
      type: DataTypes.JSON, // Stores the array of items: [{ productId, name, qty, price }]
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    trackingId: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Order',
  });

  return Order;
};
