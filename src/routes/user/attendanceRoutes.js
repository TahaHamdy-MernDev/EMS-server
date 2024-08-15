const express = require("express");
const router = express.Router();
const attendanceController = require("../../controllers/attendanceController");
const { validateRequest } = require("../../utils/validateRequest");
const {
  checkInSchema,
  checkOutSchema,
  getAttendanceSchema,
} = require("../../utils/validation/attendance");

router.post(
  "/check-in",
  validateRequest(checkInSchema),
  attendanceController.checkIn
);
router.post(
  "/check-out",
  validateRequest(checkOutSchema),
  attendanceController.checkOut
);
router.get(
  "/:userId/:date",
  validateRequest(getAttendanceSchema, "params"),
  attendanceController.getAttendance
);
// router.post('/record-action', attendanceController.recordAction);
// router.put('/update-status', attendanceController.updateAttendanceStatus);
// router.get('/report', attendanceController.getAttendanceReport);

module.exports = router;
