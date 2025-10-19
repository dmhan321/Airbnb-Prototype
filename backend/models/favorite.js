'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate(models) {
      Favorite.belongsTo(models.Traveler, {
        foreignKey: 'travelerId',
        as: 'traveler'
      });
      
      Favorite.belongsTo(models.Property, {
        foreignKey: 'propertyId',
        as: 'property'
      });
    }
  }
  Favorite.init({
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
    }
  }, {
    sequelize,
    modelName: 'Favorite',
  });
  return Favorite;
};