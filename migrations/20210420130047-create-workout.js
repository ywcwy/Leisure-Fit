'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Workouts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      TrainingdayId: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED
      },
      TrainingId: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED
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