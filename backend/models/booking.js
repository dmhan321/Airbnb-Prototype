'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.Traveler, {
        foreignKey: 'travelerId',
        as: 'traveler'
      });
      
      Booking.belongsTo(models.Property, {
        foreignKey: 'propertyId',
        as: 'property'
      });
    }
  }
  Booking.init({
    travelerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Travelers',
        key: 'id'
      }
    },
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Properties',
        key: 'id'
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    guests: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'CANCELLED', 'COMPLETED'),
      defaultValue: 'PENDING'
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};