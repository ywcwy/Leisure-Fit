'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Training extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Training.belongsTo(model.Workout)
      Training.hasMany(model.Exercise)
    }
  };
  Training.init({
    ExerciseId: DataTypes.INTEGER,
    repetition: DataTypes.INTEGER,
    set: DataTypes.INTEGER,
    TrainingdayId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Training',
  });
  return Training;
};