const { Schedule, sequelize } = require('../models');
const { Op } = require('sequelize');

const checkScheduleConflict = async (roomId, date, startTime, endTime, scheduleId = null) => {
    const whereClause = {
        roomId,
        date,
        startTime,
        endTime
    };

    if (!!scheduleId) {
        whereClause.id = { [Op.ne]: scheduleId };
    }

    const conflictingSchedule = await Schedule.findOne({
        where: whereClause
    });

    return conflictingSchedule;
}

exports.listSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            include: ['Room', 'Movie'],
            order: [['date', 'DESC']],
        });
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener funciones' });
    }
};

exports.createSchedule = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        let scheduleData = req.body;

        const existingSchedule = await checkScheduleConflict(
            scheduleData.roomId,
            scheduleData.date,
            scheduleData.startTime,
            scheduleData.endTime
        );

        if (!!existingSchedule) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Schedule already taken' });
        }

        scheduleData.isActive = scheduleData.isActive ? 1 : 0;

        const newSchedule = await Schedule.create(scheduleData, { transaction });

        await transaction.commit();
        res.status(201).json(newSchedule);
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Error creating schedule', error });
    }
};

exports.getSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id, {
            include: ['Room', 'Movie'],
        });
        if (!schedule) return res.status(404).json({ error: 'No encontrada' });
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener función' });
    }
};

exports.getMovieSchedules = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const schedules = await Schedule.findAll({
            where: { movieId },
            include: ['Room']
        });

        if (!schedules) {
            return res.status(404).json({ message: 'Schedules not found' });
        }

        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedules', error });
    }
}

exports.updateSchedule = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const scheduleId = req.params.id;
        let scheduleData = req.body;

        const schedule = await Schedule.findByPk(scheduleId);

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        const existingSchedule = await checkScheduleConflict(
            scheduleData.roomId || null,
            scheduleData.date || null,
            scheduleData.startTime || null,
            scheduleData.endTime || null,
            scheduleId
        );

        if (!!existingSchedule) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Schedule already taken' });
        }

        scheduleData.isActive = scheduleData.isActive ? 1 : 0;

        await schedule.update(scheduleData, { transaction });
        await transaction.commit();
        res.status(200).json({ message: 'Schedule updated successfully' });
    } catch (error) {
        console.error('Error updating schedule:', error.message);

        await transaction.rollback();
        res.status(500).json({ message: 'Error updating schedule', error });
    }
};

exports.deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (!schedule) return res.status(404).json({ error: 'No encontrada' });
        await schedule.destroy();
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar función' });
    }
};
