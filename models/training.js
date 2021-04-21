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
      Training.belongsTo(models.Workout)
      Training.hasMany(models.Exercise)
      Training.hasMany(models.Equipment)
    }
  };
  Training.init({
    ExerciseId: DataTypes.INTEGER,
    EquipmentId: DataTypes.INTEGER,
    repetition: DataTypes.STRING,
    set: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Training',
  });
  return Training;
};