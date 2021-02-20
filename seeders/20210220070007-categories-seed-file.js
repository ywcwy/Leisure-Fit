'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories',
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'hiking'].map((item, index) => ({
        id: index * 10 + 1,
        name: item,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {})
  }
};
