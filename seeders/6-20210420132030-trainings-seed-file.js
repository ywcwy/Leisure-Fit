'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Trainings', [{
      id: 1,
      ExerciseId: 131,
      EquipmentId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 11,
      ExerciseId: 111,
      EquipmentId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 21,
      ExerciseId: 181,
      EquipmentId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 31,
      ExerciseId: 191,
      EquipmentId: 131,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 41,
      ExerciseId: 111,
      EquipmentId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 51,
      ExerciseId: 201,
      EquipmentId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 61,
      ExerciseId: 211,
      EquipmentId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 71,
      ExerciseId: 171,
      EquipmentId: 21,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 81,
      ExerciseId: 131,
      EquipmentId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 91,
      ExerciseId: 221,
      EquipmentId: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 101,
      ExerciseId: 231,
      EquipmentId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 111,
      ExerciseId: 171,
      EquipmentId: 21,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 121,
      ExerciseId: 221,
      EquipmentId: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 131,
      ExerciseId: 161,
      EquipmentId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 141,
      ExerciseId: 111,
      EquipmentId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Trainings', null, {})
  }
};
