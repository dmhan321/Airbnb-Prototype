'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Owners', 'languages', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Owners', 'gender', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Owners', 'languages');
    await queryInterface.removeColumn('Owners', 'gender');
  }
};
