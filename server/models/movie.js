'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    static associate(models) {
      Movie.belongsTo(models.MovieGenre, { foreignKey: 'genreId' });
    }
  }
  Movie.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    genreId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'MovieGenres',
        key: 'id'
      }
    },
    duration: DataTypes.INTEGER,
    releaseDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Movie',
    tableName: 'Movies',
    timestamps: true
  });

  return Movie;
};