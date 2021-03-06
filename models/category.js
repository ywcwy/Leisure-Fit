'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.hasMany(models.Leisurefit)
      Category.hasMany(models.Trainingday)
    }
  };
  Category.init({
    name: DataTypes.STRING,
    day: DataTypes.STRING,
    day_CH: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};