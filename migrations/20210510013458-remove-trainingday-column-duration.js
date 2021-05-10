'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Trainingdays', 'duration')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Trainingdays', 'duration', {
      allowNull: false,
      type: Sequelize.STRING
    })
  }
};
