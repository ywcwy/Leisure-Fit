'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Trainingdays', [{
      id: 1,
      date: '2021-3-18',
      CategoryId: 31,
      time: '20:00:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 11,
      date: '2021-3-25',
      CategoryId: 31,
      time: '20:00:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 21,
      date: '2021-4-8',
      CategoryId: 31,
      time: '20:00:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 31,
      date: '2021-4-15',
      CategoryId: 31,
      time: '20:00:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Trainingdays', null, {})
  }
};
