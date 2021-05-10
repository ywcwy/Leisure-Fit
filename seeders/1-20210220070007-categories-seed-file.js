'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories', [
      {
        id: 1,
        name: '瑜珈',
        day: 'Monday',
        day_CH: 'ㄧ',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 11,
        name: '戶外體能',
        day: 'Tuesday',
        day_CH: '二',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 21,
        name: '女性限定',
        day: 'Wednesday',
        day_CH: '三',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 31,
        name: 'Cross-Fit',
        day: 'Thursday',
        day_CH: '四',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 41,
        name: 'Hiking',
        day: 'Hiking Day',
        day_CH: '爬山日',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {})
  }
};
