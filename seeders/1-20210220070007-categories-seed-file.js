'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories', [
      {
        id: 1,
        name: '瑜珈',
        day: 'Monday',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 11,
        name: '戶外體能',
        day: 'Tuesday',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 21,
        name: '女性限定',
        day: 'Wednesday',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 31,
        name: 'Cross-Fit',
        day: 'Thursday',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 41,
        name: 'Hiking',
        day: 'Hiking Day',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {})
  }
};
