'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Record.belongsTo(models.User)
      Record.belongsTo(models.Category)
    }
  };
  Record.init({
    UserId: DataTypes.INTEGER,
    CategoryId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    workout: DataTypes.STRING,
    times: DataTypes.STRING,
    image: DataTypes.STRING,
    note: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Record',
  });
  return Record;
};