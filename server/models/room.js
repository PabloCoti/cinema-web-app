'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      Room.hasMany(models.Seat, { foreignKey: 'room_id' });
    }
  }

  Room.init({
    code: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    screen_type: DataTypes.STRING,
    sound_system: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Room',
    tableName: 'rooms',
    timestamps: true
  });

  return Room;
};