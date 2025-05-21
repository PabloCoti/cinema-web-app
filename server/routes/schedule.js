const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const scheduleController = require("../controllers/schedule");

router.get("/", scheduleController.listSchedules);
router.get("/:id", scheduleController.getSchedule);

router.post("/", authenticateToken, scheduleController.createSchedule);
router.put("/:id", authenticateToken, scheduleController.updateSchedule);
router.delete("/:id", authenticateToken, scheduleController.deleteSchedule);

module.exports = router;