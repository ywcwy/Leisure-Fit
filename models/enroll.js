'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Enroll extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Enroll.belongsTo(models.User)
      Enroll.belongsTo(models.Trainingday)
    }
  };
  Enroll.init({
    UserId: DataTypes.INTEGER,
    TrainingdayId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Enroll',
  });
  return Enroll;
};