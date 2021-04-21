'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Exercises', [{
      id: 1,
      move: 'squat',
      description: '深蹲',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 11,
      move: 'air-squat',
      description: '空蹲',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 21,
      move: 'front-squat',
      description: '前蹲',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 31,
      move: 'over-head-squat',
      description: '過頭深蹲',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 41,
      move: 'push-up',
      description: '伏地挺身',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 51,
      move: 'sit-up',
      description: '仰臥起坐',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 61,
      move: 'crunch (curl)',
      description: '卷腹',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 71,
      move: 'lunge',
      description: '弓箭步',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 81,
      move: 'plank',
      description: '棒式',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 91,
      move: 'bench-press',
      description: '臥推',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 101,
      move: 'shoulder-press',
      description: '肩推',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 111,
      move: 'push-press',
      description: '借力推',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 121,
      move: 'push-jerk',
      description: '借力挺',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 131,
      move: 'burpee',
      description: '波比跳',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 141,
      move: 'jumping-jacks',
      description: '開合跳',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 151,
      move: 'dead-lift',
      description: '硬舉',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 161,
      move: 'snatch',
      description: '抓舉',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 171,
      move: 'wall-ball',
      description: '丟牆球',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 181,
      move: 'hang-squat-clean',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 191,
      move: 'box-jump',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 201,
      move: 'wall-walk',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 211,
      move: 'goblet-squat',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 221,
      move: 'swing',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 231,
      move: 'clean',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Exercises', null, {})
  }
};
