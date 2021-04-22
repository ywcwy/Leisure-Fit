'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Workout extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Workout.belongsTo(models.Trainingday)
      Workout.belongsTo(models.Training)
    }
  };
  Workout.init({
    TrainingdayId: DataTypes.INTEGER,
    TrainingId: DataTypes.INTEGER,
    repetitions: DataTypes.STRING,
    sets: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Workout',
  });
  return Workout;
};