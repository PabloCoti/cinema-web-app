'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Reservation extends Model {
        static associate(models) {
            Reservation.belongsTo(models.User, { foreignKey: 'user_id' });
            Reservation.belongsTo(models.Schedule, { foreignKey: 'schedule_id' });
            Reservation.belongsTo(models.Seat, { foreignKey: 'seat_id' });
        }
    }

    Reservation.init({
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        schedule_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Schedules',
                key: 'id'
            }
        },
        seat_id: {
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
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Reservation',
        tableName: 'reservations',
        timestamps: true
    });

    return Reservation;
};
