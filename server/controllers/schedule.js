const { Schedule, sequelize } = require('../models');

const checkScheduleConflict = async (roomId, date, startTime, endTime, scheduleId = null) => {
    const whereClause = {
        roomId,
        date,
        startTime,
        endTime
    };

    if (scheduleId) {
        whereClause.id = { [sequelize.Op.ne]: scheduleId };
    }

    const conflictingSchedule = await Schedule.findOne({
        where: whereClause
    });

    return conflictingSchedule;
}

exports.listSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            include: ['Movie', 'Room']
        });
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedules', error });
    }
};

exports.createSchedule = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const scheduleData = req.body;

        if (scheduleData.isActive) {
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
        }
        else {
            scheduleData.isActive = false;
        }

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
        const scheduleId = req.params.id;
        const schedule = await Schedule.findByPk(scheduleId, {
            include: ['Movie', 'Room']
        });

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedule', error });
    }
};

exports.updateSchedule = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const scheduleId = req.params.id;
        const scheduleData = req.body;

        const schedule = await Schedule.findByPk(scheduleId);

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        if (scheduleData.isActive) {
            const existingSchedule = await checkScheduleConflict(
                scheduleData.roomId,
                scheduleData.date,
                scheduleData.startTime,
                scheduleData.endTime,
                scheduleId
            );

            if (!!existingSchedule) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Schedule already taken' });
            }
        }

        await schedule.update(scheduleData, { transaction });
        await transaction.commit();
        res.status(200).json({ message: 'Schedule updated successfully' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Error updating schedule', error });
    }
};
