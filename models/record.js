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
      Record.belongsTo(model.User)
      Record.belongsTo(model.Trainingday)
    }
  };
  Record.init({
    Trainingday: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    note: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Record',
  });
  return Record;
};