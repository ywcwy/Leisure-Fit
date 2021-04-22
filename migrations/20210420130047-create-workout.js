'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Workouts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      TrainingdayId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      TrainingId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      repetitions: {
        allowNull: false,
        type: Sequelize.STRING
      },
      sets: {
        allowNull: false,
        type: Sequelize.STRING
      },
      note: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Workouts');
  }
};