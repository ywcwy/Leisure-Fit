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
      Trainingday.belongsTo(model.Workout)
      Trainingday.HasMany(model.Record)
    }
  };
  Trainingday.init({
    date: DataTypes.DATE,
    CategoryId: DataTypes.INTEGER,
    duration: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Trainingday',
  });
  return TrainingDay;
};