'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MovieGenre extends Model {
        static associate(models) {
        }
    }
    MovieGenre.init({
        name: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'MovieGenre',
        tableName: 'MovieGenres',
        timestamps: true
    });

    return MovieGenre;
};