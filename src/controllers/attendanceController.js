const { EmployeeDayStatus } = require("../config/enums");
const asyncHandler = require("../handlers/asyncHandler");
const { attendanceServices } = require("../models/attendanceModel");
const { currentDayInEgypt, currentTimeInEgypt } = require("../utils/common");

exports.checkIn = asyncHandler(async (req, res) => {
  const { userId, latitude, longitude } = req.body;
  const today = currentDayInEgypt();
  const existingAttendance = await attendanceServices.findOne({
    user: userId,
    date: today,
    "actions.type": EmployeeDayStatus.CHECKED_IN,
  });

  if (existingAttendance) {
    return res.badRequest({ message: "You have already checked in today" });
  }
  const filter = { user: userId, date: today };
  const data = {
    $push: {
      actions: {
        type: EmployeeDayStatus.CHECKED_IN,
        time: currentTimeInEgypt(),
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
    },
    $set: { status: EmployeeDayStatus.STARTED },
  };
  const options = { upsert: true, new: true };
  const attendance = await attendanceServices.updateOne(filter, data, options);
  return res.success({ data: attendance });
});
exports.checkOut = asyncHandler(async (req, res) => {
  const { userId, latitude, longitude } = req.body;
  const today = currentDayInEgypt();
  const existingAttendance = await attendanceServices.findOne({
    user: userId,
    date: today,
    "actions.type": EmployeeDayStatus.CHECKED_OUT,
  });
  if (existingAttendance) {
    return res.badRequest({ message: "You have already checked out today" });
  }
  const attendance = await attendanceServices.findOne({
    user: userId,
    date: today,
    "actions.type": EmployeeDayStatus.CHECKED_IN,
  });

  if (!attendance) {
    return res.badRequest({
      message: "You need to check in first before checking out",
    });
  }
  const filter = { user: userId, date: today };
  const data = {
    $push: {
      actions: {
        type: EmployeeDayStatus.CHECKED_OUT,
        time: currentTimeInEgypt(),
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
    },
    $set: { status: EmployeeDayStatus.CHECKED_OUT },
  };
  const updatedAttendance = await attendanceServices.updateOne(filter, data);
  if (!updatedAttendance) {
    return res.recordNotFound({
      message: "No check-in record found for today",
    });
  }
  return res.success({ data: updatedAttendance });
});
exports.getAttendance = asyncHandler(async (req, res) => {
  const { userId, date } = req.params;

  const attendance = await attendanceServices.findOne({
    user: userId,
    date,
  });

  if (!attendance) {
    return res.recordNotFound({
      message: "No attendance record found for the specified date",
    });
  }
  return res.success({ data: attendance });
});
exports.recordAction = asyncHandler(async (req, res) => {
  const { actionType, latitude, longitude, details } = req.body;
  const { userId } = req.user;
  const today = currentDayInEgypt();
  const filter = { user: userId, date: today };
  const data = {
    $push: {
      actions: {
        type: actionType,
        time: currentTimeInEgypt(),
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        details,
      },
    },
  };

  const attendance = await attendanceServices.updateOne(filter, data);
  if (!attendance) {
    return res.recordNotFound({
      message: "No attendance record found for today",
    });
  }
  return res.success({ data: attendance });
});
exports.getAttendanceReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const { userId } = req.user;
  const filter = {
    user: userId,
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  };
  const attendances = await attendanceServices.find({ filter });
  return res.success({ data: attendances });
});
