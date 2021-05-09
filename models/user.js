'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Like)
      User.hasMany(models.Record)
      User.hasMany(models.Enroll)
      User.hasMany(models.WaitingList)
      User.belongsToMany(models.Leisurefit, {
        through: models.Like,
        foreignKey: 'UserId',
        as: 'LikedLeisurefits'
      })
      User.belongsToMany(models.Trainingday, {
        through: models.Record,
        foreignKey: 'UserId',
        as: 'CoursesList'
      })
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};