'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Leisurefit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Leisurefit.belongsTo(models.Category)
      Leisurefit.hasMany(models.Like)
      Leisurefit.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'LeisurefitId',
        as: 'LikedUsers'
      })
    }
  };
  Leisurefit.init({
    name: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Leisurefit',
  });
  return Leisurefit;
};