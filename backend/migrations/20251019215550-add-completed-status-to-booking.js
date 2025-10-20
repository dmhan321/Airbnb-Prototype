'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add COMPLETED status to the booking status enum
    await queryInterface.changeColumn('Bookings', 'status', {
      type: Sequelize.ENUM('PENDING', 'ACCEPTED', 'CANCELLED', 'COMPLETED'),
      allowNull: false,
      defaultValue: 'PENDING'
    });
  },

  async down (queryInterface, Sequelize) {
    // Revert back to original enum without COMPLETED
    await queryInterface.changeColumn('Bookings', 'status', {
      type: Sequelize.ENUM('PENDING', 'ACCEPTED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PENDING'
    });
  }
};
