const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const scheduleController = require('../controllers/schedule');

router.get('/', scheduleController.listSchedules);

router.post('/', authMiddleware.authenticateToken, authMiddleware.verifyAdmin, scheduleController.createSchedule);

module.exports = router;