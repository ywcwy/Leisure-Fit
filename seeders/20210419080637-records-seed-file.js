'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Records', [{
      UserId: 11,
      date: '2021 - 05 - 01',
      workout: '伏地挺身',
      times: '10下 /次，共五次',
      CategoryId: 11,
      image: null,
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      UserId: 11,
      date: '2021 - 05 - 01',
      workout: '仰臥起坐',
      times: '20下 /次，共五次',
      CategoryId: 11,
      image: null,
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      UserId: 21,
      date: '2021 - 05 - 01',
      workout: '深蹲',
      times: '20下 /次，共五次',
      CategoryId: 11,
      image: null,
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      UserId: 21,
      date: '2021 - 05 - 01',
      workout: '伏地挺身',
      times: '10下 /次，共五次',
      CategoryId: 11,
      image: null,
      note: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ])
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Records', null, {})
  }
};
