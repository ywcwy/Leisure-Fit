'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Trainings', [{
      id: 1,
      ExerciseId: 131,
      EquipmentId: null,
      repetitions: '21-15-9',
      sets: '3',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 11,
      ExerciseId: 111,
      EquipmentId: 1,
      repetitions: '21-15-9',
      sets: '3',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 21,
      ExerciseId: 181,
      EquipmentId: 1,
      repetitions: '21-15-9',
      sets: '3',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 31,
      ExerciseId: 191,
      EquipmentId: 131,
      repetitions: '9-11-13-15-17-19',
      sets: '6',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 41,
      ExerciseId: 111,
      EquipmentId: null,
      repetitions: '5-7-9-11-13-15',
      sets: '6',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 51,
      ExerciseId: 201,
      EquipmentId: null,
      repetitions: '3-5-7-9-11-13',
      sets: '6',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 61,
      ExerciseId: 211,
      EquipmentId: null,
      repetitions: '7-9-11-13-15-17',
      sets: '6',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 71,
      ExerciseId: 171,
      EquipmentId: 21,
      repetitions: '50',
      sets: '3',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 81,
      ExerciseId: 131,
      EquipmentId: null,
      repetitions: '30',
      sets: '3',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 91,
      ExerciseId: 221,
      EquipmentId: 11,
      repetitions: '50',
      sets: '3',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 101,
      ExerciseId: 231,
      EquipmentId: 1,
      repetitions: '30',
      sets: '3',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 111,
      ExerciseId: 171,
      EquipmentId: 21,
      repetitions: '10',
      sets: '10',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 121,
      ExerciseId: 221,
      EquipmentId: 11,
      repetitions: '20',
      sets: '10',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 131,
      ExerciseId: 161,
      EquipmentId: 1,
      repetitions: '20',
      sets: '10',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 141,
      ExerciseId: 111,
      EquipmentId: 1,
      repetitions: '20',
      sets: '10',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Trainings', null, {})
  }
};
