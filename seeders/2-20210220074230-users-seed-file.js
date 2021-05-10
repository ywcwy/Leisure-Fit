'use strict';
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [
      {
        id: 1,
        name: 'root',
        email: 'root@example.com',
        password: bcrypt.hashSync('123', bcrypt.genSaltSync(10)),
        isAdmin: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    Array.from({ length: 25 }).map((item, index) => {
      return users.push(
        {
          id: 10 * (index + 1) + 1,
          name: `user${index + 1}`,
          email: `user${index + 1}@example.com`,
          password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
          isAdmin: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      )
    })

    await queryInterface.bulkInsert('Users', users)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
