'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Trainingdays', 'limitNumber', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Trainingdays', 'limitNumber')
  }
};
