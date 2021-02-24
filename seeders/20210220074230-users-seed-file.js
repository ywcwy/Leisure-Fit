'use strict';
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        name: 'root',
        email: 'root@example.com',
        password: bcrypt.hashSync('123', bcrypt.genSaltSync(10)),
        isAdmin: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 11,
        name: 'user1',
        email: 'user1@example.com',
        password: bcrypt.hashSync('123', bcrypt.genSaltSync(10)),
        isAdmin: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 21,
        name: 'user2',
        email: 'user2@example.com',
        password: bcrypt.hashSync('123', bcrypt.genSaltSync(10)),
        isAdmin: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
