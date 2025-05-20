'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Reservation extends Model {
        static associate(models) {
            Reservation.belongsTo(models.User, { foreignKey: 'userId' });
            Reservation.belongsTo(models.Schedule, { foreignKey: 'scheduleId' });
            Reservation.belongsTo(models.Seat, { foreignKey: 'seatId' });
        }
    }

    Reservation.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        scheduleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Schedules',
                key: 'id'
            }
        },
        seatId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Seats',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'reserved'
        }
    }, {
        sequelize,
        modelName: 'Reservation',
        tableName: 'Reservations',
        timestamps: true
    });

    return Reservation;
};
