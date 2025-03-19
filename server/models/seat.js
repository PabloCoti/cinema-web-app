'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Seat extends Model {
        static associate(models) {
            Seat.belongsTo(models.Room, { foreignKey: 'roomId' });
        }
    }

    Seat.init({
        roomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Rooms',
                key: 'id'
            }
        },
        row: {
            type: DataTypes.STRING,
            allowNull: false
        },
        number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Seat',
        tableName: 'Seats',
        timestamps: true
    });

    return Seat;
};
