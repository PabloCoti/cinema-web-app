const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const scheduleController = require('../controllers/schedule');

router.get('/', scheduleController.listSchedules);
router.get('/:id', scheduleController.getSchedule);
router.get('/movie/:movieId', scheduleController.getMovieSchedules);

router.post('/', authMiddleware.authenticateToken, authMiddleware.verifyAdmin, scheduleController.createSchedule);
router.put('/:id', authMiddleware.authenticateToken, authMiddleware.verifyAdmin, scheduleController.updateSchedule);

module.exports = router;