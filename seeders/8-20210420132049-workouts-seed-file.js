'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Workouts', [{
      id: 1,
      TrainingdayId: 1,
      TrainingId: 71,
      repetitions: '50',
      sets: '3',
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 11,
      TrainingdayId: 1,
      TrainingId: 81,
      repetitions: '30',
      sets: '3',
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 21,
      TrainingdayId: 1,
      TrainingId: 91,
      repetitions: '50',
      sets: '3',
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 31,
      TrainingdayId: 1,
      TrainingId: 101,
      repetitions: '30',
      sets: '3',
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 41,
      TrainingdayId: 11,
      TrainingId: 111,
      repetitions: '10',
      sets: '10',
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 51,
      TrainingdayId: 11,
      TrainingId: 121,
      repetitions: '20',
      sets: '10',
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 61,
      TrainingdayId: 11,
      TrainingId: 131,
      repetitions: '20',
      sets: '10',
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 71,
      TrainingdayId: 11,
      TrainingId: 141,
      repetitions: '20',
      sets: '10',
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 81,
      TrainingdayId: 21,
      TrainingId: 31,
      repetitions: '9-11-13-15-17-19',
      sets: '6',
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 91,
      TrainingdayId: 21,
      TrainingId: 41,
      repetitions: '5-7-9-11-13-15',
      sets: '6',
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 101,
      TrainingdayId: 21,
      TrainingId: 51,
      repetitions: '3-5-7-9-11-13',
      sets: '6',
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 111,
      TrainingdayId: 21,
      TrainingId: 61,
      repetitions: '7-9-11-13-15-17',
      sets: '6',
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 121,
      TrainingdayId: 31,
      TrainingId: 1,
      repetitions: '21-15-9',
      sets: '3',
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 131,
      TrainingdayId: 31,
      TrainingId: 11,
      repetitions: '21-15-9',
      sets: '3',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 141,
      TrainingdayId: 31,
      TrainingId: 21,
      repetitions: '21-15-9',
      sets: '3',
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Workouts', null, {})
  }
};
