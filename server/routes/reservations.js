const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const reservationsController = require("../controllers/reservations");

router.get("/", reservationsController.getReservationsBySchedule);

router.post("/", authenticateToken, reservationsController.createReservation);
router.get("/my", authenticateToken, reservationsController.getMyReservations);
router.get("/:id", authenticateToken, reservationsController.getReservationById);

module.exports = router;
