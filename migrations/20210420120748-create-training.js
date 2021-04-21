'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Trainings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ExerciseId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      EquipmentId: {
        type: Sequelize.INTEGER
      },
      repetition: {
        allowNull: false,
        type: Sequelize.STRING
      },
      set: {
        allowNull: false,
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Trainings');
  }
};