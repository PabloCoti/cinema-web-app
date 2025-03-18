'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    static associate(models) {
    }
  }
  Movie.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    genre: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    release_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Movie',
    tableName: 'movies',
    timestamps: true
  });

  return Movie;
};