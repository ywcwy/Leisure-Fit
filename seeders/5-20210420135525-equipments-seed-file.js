'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Equipments', [{
      id: 1,
      item: 'dumbbell',
      description: '啞鈴',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 11,
      item: 'kettlebell',
      description: '壺鈴',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 21,
      item: 'medicine ball',
      description: '藥球',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 31,
      item: 'jumping-box',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Equipments', null, {})
  }
};
