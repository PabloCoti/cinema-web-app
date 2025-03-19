const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const authMiddleware = require('../middleware/auth');

router.get('/session', authMiddleware.authenticateToken, authController.getSession);
router.post('/logout', authController.logout);

router.post('/signup', authController.signUp);
router.post('/signin', authController.login);

router.get('/users', authMiddleware.authenticateToken, authMiddleware.verifyAdmin, authController.listUsers);
router.delete('/users/:id', authMiddleware.authenticateToken, authMiddleware.verifyAdmin, authController.deleteUser);

module.exports = router;
