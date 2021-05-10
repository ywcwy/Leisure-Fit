'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Trainingdays', 'time', {
      type: Sequelize.TIME
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Trainingdays', 'time')
  }
};
