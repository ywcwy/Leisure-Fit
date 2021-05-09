'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WaitingList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      WaitingList.belongsTo(models.User)
      WaitingList.belongsTo(models.Trainingday)
    }
  };
  WaitingList.init({
    UserId: DataTypes.INTEGER,
    TrainingdayId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'WaitingList',
  });
  return WaitingList;
};