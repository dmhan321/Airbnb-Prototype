'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    static associate(models) {
      Property.belongsTo(models.Owner, {
        foreignKey: 'ownerId',
        as: 'owner'
      });
      
      Property.hasMany(models.Booking, {
        foreignKey: 'propertyId',
        as: 'bookings'
      });
      
      Property.hasMany(models.Favorite, {
        foreignKey: 'propertyId',
        as: 'favorites'
      });
    }
  }
  Property.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: DataTypes.STRING,
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    amenities: DataTypes.TEXT,
    maxGuests: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    availableFrom: DataTypes.DATE,
    availableTo: DataTypes.DATE,
    images: DataTypes.JSON,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Owners',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Property',
  });
  return Property;
};