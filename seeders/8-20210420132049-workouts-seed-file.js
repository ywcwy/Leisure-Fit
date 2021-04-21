'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Workouts', [{
      id: 1,
      TrainingdayId: 1,
      TrainingId: 71,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 11,
      TrainingdayId: 1,
      TrainingId: 81,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 21,
      TrainingdayId: 1,
      TrainingId: 91,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 31,
      TrainingdayId: 1,
      TrainingId: 101,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 41,
      TrainingdayId: 11,
      TrainingId: 111,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 51,
      TrainingdayId: 11,
      TrainingId: 121,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 61,
      TrainingdayId: 11,
      TrainingId: 131,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 71,
      TrainingdayId: 11,
      TrainingId: 141,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 81,
      TrainingdayId: 21,
      TrainingId: 31,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 91,
      TrainingdayId: 21,
      TrainingId: 41,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 101,
      TrainingdayId: 21,
      TrainingId: 51,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 111,
      TrainingdayId: 21,
      TrainingId: 61,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 121,
      TrainingdayId: 31,
      TrainingId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 131,
      TrainingdayId: 31,
      TrainingId: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 141,
      TrainingdayId: 31,
      TrainingId: 21,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Workouts', null, {})
  }
};
