const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const authMiddleware = require('../middleware/auth');

router.post('/signin', authController.signIn);
router.post('/signup', authController.signUp);
router.post('/logout', authController.logOut);
router.get('/validate-session', authMiddleware.authenticateToken, authController.validateToken);

router.get('/users', authMiddleware.authenticateToken, authMiddleware.verifyAdmin, authController.listUsers);
router.delete('/users/:id', authMiddleware.authenticateToken, authMiddleware.verifyAdmin, authController.deleteUser);

module.exports = router;
