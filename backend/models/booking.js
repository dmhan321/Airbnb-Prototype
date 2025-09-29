'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init({
    travelerId: DataTypes.INTEGER,
    propertyId: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    guests: DataTypes.INTEGER,
    status: DataTypes.STRING,
    totalPrice: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};