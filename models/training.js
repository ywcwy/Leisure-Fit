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
      Training.belongsToMany(models.Trainingday, {
        through: models.Workout,
        foreignKey: 'TrainingId',
        as: 'TrainingdayList'
      })
    }
  };
  Training.init({
    ExerciseId: DataTypes.INTEGER,
    EquipmentId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Training',
  });
  return Training;
};