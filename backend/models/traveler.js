'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Traveler extends Model {
    static associate(models) {
      Traveler.hasMany(models.Booking, {
        foreignKey: 'travelerId',
        as: 'bookings'
      });
      
      Traveler.hasMany(models.Favorite, {
        foreignKey: 'travelerId',
        as: 'favorites'
      });
    }
  }
  Traveler.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: DataTypes.STRING,
    aboutMe: DataTypes.TEXT,
    address: DataTypes.TEXT,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    languages: DataTypes.STRING,
    gender: DataTypes.STRING,
    profilePicture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Traveler',
  });
  return Traveler;
};