'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      Room.hasMany(models.Seat, { foreignKey: 'roomId' });
    }
  }

  Room.init({
    code: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    screenType: DataTypes.STRING,
    soundSystem: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Room',
    tableName: 'Rooms',
    timestamps: true
  });

  return Room;
};