'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trainingday extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Trainingday.hasMany(models.Workout)
      Trainingday.hasMany(models.Record)
      Trainingday.belongsTo(models.Category)
      Trainingday.hasMany(models.Enroll)
      Trainingday.hasMany(models.WaitingList)
      Trainingday.belongsToMany(models.Training, {
        through: models.Workout,
        foreignKey: 'TrainingdayId',
        as: 'TrainingList'
      })
      Trainingday.belongsToMany(models.User, {
        through: models.Record,
        foreignKey: 'TrainingdayId',
        as: 'TrainingTrainee'
      })
    }
  };
  Trainingday.init({
    date: DataTypes.DATE,
    CategoryId: DataTypes.INTEGER,
    enroll: DataTypes.BOOLEAN,
    time: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'Trainingday',
  });
  return Trainingday;
};