const { Room, Seat } = require('../models');
const { sequelize } = require('../models');

exports.listRooms = async (req, res) => {
    try {
        const filters = req.query || {};
        const rooms = await Room.findAll({ where: filters });
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
};

exports.getRoom = async (req, res) => {
    try {
        const roomId = req.params.id;
        const room = await Room.findByPk(roomId, {
            include: [{ model: Seat }]
        });
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch room' });
    }
};

exports.createRoom = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { roomData, seatsData } = req.body;
        const newRoom = await Room.create(roomData, { transaction });

        const seats = seatsData.map(seat => ({ ...seat, roomId: newRoom.id }));
        const formattedSeats = seats.flatMap(seatGroup =>
            Object.values(seatGroup)
                .filter(seat => typeof seat === 'object')
                .map(seat => ({ ...seat, roomId: seatGroup.roomId }))
        );

        await Seat.bulkCreate(formattedSeats, { transaction });
        await transaction.commit();
        res.status(201).json(newRoom);
    } catch (error) {
        console.error('Error creating room:', error.message);

        await transaction.rollback();
        res.status(500).json({ error: 'Failed to create room' });
    }
};

exports.updateRoom = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const roomId = req.params.id;
        const { roomData, seatsData } = req.body;

        const room = await Room.findByPk(roomId);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        await room.update(roomData, { transaction });

        if (seatsData) {
            console.log('entra a actualizar asientos');

            await Seat.destroy({ where: { roomId } }, { transaction });
            const formattedSeats = seatsData.flatMap(seatGroup =>
                Object.values(seatGroup)
                    .filter(seat => typeof seat === 'object')
                    .map(seat => ({ ...seat, roomId: roomId }))
            );

            console.log('Formatted Seats:', formattedSeats);

            await Seat.bulkCreate(formattedSeats, { transaction });
        }

        await transaction.commit();
        res.status(200).json(room);
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: 'Failed to update room' });
    }
};

exports.deleteRoom = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const roomId = req.params.id;
        const room = await Room.findByPk(roomId);

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        await Seat.destroy({ where: { roomId } }, { transaction });
        await room.destroy({ transaction });

        await transaction.commit();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting room:', error.message);

        await transaction.rollback();
        res.status(500).json({ error: 'Failed to delete room' });
    }
}
