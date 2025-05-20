const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const roomController = require('../controllers/room');

router.get('/', authMiddleware.authenticateToken, authMiddleware.verifyAdmin, roomController.listRooms);
router.get('/:id', authMiddleware.authenticateToken, roomController.getRoom);

router.post('/', authMiddleware.authenticateToken, authMiddleware.verifyAdmin, roomController.createRoom);
router.put('/:id', authMiddleware.authenticateToken, authMiddleware.verifyAdmin, roomController.updateRoom);

router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.verifyAdmin, roomController.deleteRoom);

module.exports = router;