'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Owners', 'address', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('Owners', 'city', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Owners', 'state', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Owners', 'country', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Owners', 'address');
    await queryInterface.removeColumn('Owners', 'city');
    await queryInterface.removeColumn('Owners', 'state');
    await queryInterface.removeColumn('Owners', 'country');
  }
};
