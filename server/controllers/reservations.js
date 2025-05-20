const { Reservation, Seat, Schedule, User, sequelize } = require("../models");
const QRCode = require("qrcode");
const { Op } = require("sequelize");

exports.createReservation = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { scheduleId, seatIds } = req.body;
        const userId = req.user.id;

        const existing = await Reservation.findAll({
            where: {
                scheduleId,
                seatId: { [Op.in]: seatIds },
                status: "reserved",
            },
            transaction: transaction,
            lock: transaction.LOCK.UPDATE,
        });
        if (existing.length > 0) {
            await transaction.rollback();
            return res.status(400).json({ error: "Uno o más asientos ya están reservados." });
        }

        const reservations = await Promise.all(
            seatIds.map(seatId =>
                Reservation.create({
                    userId,
                    scheduleId,
                    seatId,
                    status: "reserved",
                }, { transaction: transaction })
            )
        );

        const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
        const qrLink = `${clientUrl}/reservations/view/${reservations[0].id}`;
        const qrDataUrl = await QRCode.toDataURL(qrLink);

        await transaction.commit();
        res.status(201).json({ qrUrl: qrDataUrl });
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ error: "Error al crear la reservación" });
    }
};

exports.getReservationsBySchedule = async (req, res) => {
    try {
        const { scheduleId } = req.query;
        if (!scheduleId) {
            return res.status(400).json({ error: "scheduleId requerido" });
        }
        const reservations = await Reservation.findAll({
            where: { scheduleId, status: "reserved" },
            attributes: ["id", "seatId", "userId"],
        });
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener reservaciones" });
    }
};

exports.getMyReservations = async (req, res) => {
    try {
        const userId = req.user.id;
        const reservations = await Reservation.findAll({
            where: { userId },
            include: [
                {
                    model: require("../models").Schedule,
                    as: "Schedule",
                    include: [
                        { model: require("../models").Movie, as: "Movie" },
                        { model: require("../models").Room, as: "Room" }
                    ]
                },
                {
                    model: require("../models").Seat,
                    as: "Seat"
                }
            ],
            order: [["createdAt", "DESC"]]
        });
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener reservaciones del usuario" });
    }
};

exports.getReservationById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const reservation = await Reservation.findOne({
            where: { id, userId },
            include: [
                {
                    model: require("../models").Schedule,
                    as: "Schedule",
                    include: [
                        { model: require("../models").Movie, as: "Movie" },
                        { model: require("../models").Room, as: "Room" }
                    ]
                },
                {
                    model: require("../models").Seat,
                    as: "Seat"
                }
            ]
        });
        if (!reservation) {
            return res.status(404).json({ error: "Reservación no encontrada" });
        }

        const group = await Reservation.findAll({
            where: {
                userId,
                scheduleId: reservation.scheduleId,
                createdAt: reservation.createdAt,
                status: "reserved",
            },
            include: [
                {
                    model: require("../models").Schedule,
                    as: "Schedule",
                    include: [
                        { model: require("../models").Movie, as: "Movie" },
                        { model: require("../models").Room, as: "Room" }
                    ]
                },
                {
                    model: require("../models").Seat,
                    as: "Seat"
                }
            ]
        });

        const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
        const ids = group.map(r => r.id).join(",");
        const qrLink = `${clientUrl}/reservations/view/${ids}`;
        const qrDataUrl = await QRCode.toDataURL(qrLink);

        res.json({
            ...reservation.toJSON(),
            group,
            qrUrl: qrDataUrl
        });
    } catch (err) {
        res.status(500).json({ error: "Error al obtener la reservación" });
    }
};
