const { Schedule } = require('../models');

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
    try {
        const scheduleData = req.body;

        if (scheduleData.isActive) {
            const existingSchedule = await Schedule.findOne({
                where: {
                    roomId: scheduleData.roomId,
                    date: scheduleData.date,
                    startTime: scheduleData.startTime,
                    endTime: scheduleData.endTime
                }
            });

            if (!!existingSchedule) {
                return res.status(400).json({ message: 'Schedule already taken' });
            }
        }
        else {
            scheduleData.isActive = false;
        }

        const newSchedule = await Schedule.create(scheduleData);

        res.status(201).json(newSchedule);
    } catch (error) {
        console.error('Error creating schedule:', error);

        res.status(500).json({ message: 'Error creating schedule', error });
    }
};