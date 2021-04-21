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
      Training.hasMany(models.Workout)
      Training.belongsTo(models.Exercise)
      Training.belongsTo(models.Equipment)
    }
  };
  Training.init({
    ExerciseId: DataTypes.INTEGER,
    EquipmentId: DataTypes.INTEGER,
    repetitions: DataTypes.STRING,
    sets: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Training',
  });
  return Training;
};