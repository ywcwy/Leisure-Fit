'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Records', [{
      id: 1,
      UserId: 11,
      TrainingdayId: 1,
      image: null,
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 11,
      UserId: 11,
      TrainingdayId: 11,
      image: null,
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 21,
      UserId: 11,
      TrainingdayId: 21,
      image: null,
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 31,
      UserId: 11,
      TrainingdayId: 31,
      image: null,
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 41,
      UserId: 21,
      TrainingdayId: 1,
      image: null,
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 51,
      UserId: 21,
      TrainingdayId: 11,
      image: null,
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 61,
      UserId: 21,
      TrainingdayId: 21,
      image: null,
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Records', null, {})
  }
};
