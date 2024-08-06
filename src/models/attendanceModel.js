// models/Attendance.js
const mongoose = require("mongoose");
const { EmployeeDayStatus } = require("../config/enums");

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    checkIn: { type: Date },
    checkOut: { type: Date },
    checkInLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    checkOutLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    status: {
      type: String,
      enum: Object.values(EmployeeDayStatus),
      required: true,
    },
    additionalInfo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
attendanceSchema.index({ checkInLocation: "2dsphere" });
attendanceSchema.index({ checkOutLocation: "2dsphere" });

attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

const AttendanceModel = mongoose.model("Attendance", attendanceSchema);
module.exports = AttendanceModel;

/*
const mongoose = require('mongoose');
const { AttendanceModel, UserModel } = require('./models'); // Adjust the path as needed

// Helper function to calculate work duration
const calculateWorkDuration = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  return (checkOut - checkIn) / (1000 * 60 * 60); // Duration in hours
};

// Generate Daily Report
const generateDailyReport = async (date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const dailyReport = await AttendanceModel.aggregate([
    {
      $match: {
        date: { $gte: startOfDay, $lte: endOfDay }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userDetails'
      }
    },
    {
      $unwind: '$userDetails'
    },
    {
      $project: {
        employeeName: { $concat: ['$userDetails.firstName', ' ', '$userDetails.lastName'] },
        department: '$userDetails.department',
        checkIn: 1,
        checkOut: 1,
        status: 1,
        workDuration: {
          $cond: {
            if: { $and: ['$checkIn', '$checkOut'] },
            then: { $divide: [{ $subtract: ['$checkOut', '$checkIn'] }, 3600000] },
            else: 0
          }
        }
      }
    },
    {
      $group: {
        _id: '$department',
        employees: {
          $push: {
            name: '$employeeName',
            checkIn: '$checkIn',
            checkOut: '$checkOut',
            status: '$status',
            workDuration: '$workDuration'
          }
        },
        totalPresent: {
          $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] }
        },
        totalAbsent: {
          $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] }
        },
        averageWorkDuration: { $avg: '$workDuration' }
      }
    },
    {
      $lookup: {
        from: 'departments',
        localField: '_id',
        foreignField: '_id',
        as: 'departmentDetails'
      }
    },
    {
      $unwind: '$departmentDetails'
    },
    {
      $project: {
        department: '$departmentDetails.name',
        employees: 1,
        totalPresent: 1,
        totalAbsent: 1,
        averageWorkDuration: 1
      }
    }
  ]);

  return dailyReport;
};

// Generate Monthly Report
const generateMonthlyReport = async (year, month) => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  const monthlyReport = await AttendanceModel.aggregate([
    {
      $match: {
        date: { $gte: startOfMonth, $lte: endOfMonth }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userDetails'
      }
    },
    {
      $unwind: '$userDetails'
    },
    {
      $group: {
        _id: {
          user: '$user',
          department: '$userDetails.department'
        },
        employeeName: { $first: { $concat: ['$userDetails.firstName', ' ', '$userDetails.lastName'] } },
        totalPresent: {
          $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] }
        },
        totalAbsent: {
          $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] }
        },
        totalLate: {
          $sum: { $cond: [{ $eq: ['$status', 'Late'] }, 1, 0] }
        },
        totalWorkDuration: {
          $sum: {
            $cond: {
              if: { $and: ['$checkIn', '$checkOut'] },
              then: { $divide: [{ $subtract: ['$checkOut', '$checkIn'] }, 3600000] },
              else: 0
            }
          }
        }
      }
    },
    {
      $group: {
        _id: '$_id.department',
        employees: {
          $push: {
            name: '$employeeName',
            totalPresent: '$totalPresent',
            totalAbsent: '$totalAbsent',
            totalLate: '$totalLate',
            averageWorkDuration: { $divide: ['$totalWorkDuration', { $add: ['$totalPresent', '$totalLate'] }] }
          }
        },
        departmentTotalPresent: { $sum: '$totalPresent' },
        departmentTotalAbsent: { $sum: '$totalAbsent' },
        departmentTotalLate: { $sum: '$totalLate' },
        departmentAverageWorkDuration: { $avg: '$totalWorkDuration' }
      }
    },
    {
      $lookup: {
        from: 'departments',
        localField: '_id',
        foreignField: '_id',
        as: 'departmentDetails'
      }
    },
    {
      $unwind: '$departmentDetails'
    },
    {
      $project: {
        department: '$departmentDetails.name',
        employees: 1,
        departmentTotalPresent: 1,
        departmentTotalAbsent: 1,
        departmentTotalLate: 1,
        departmentAverageWorkDuration: 1
      }
    }
  ]);

  return monthlyReport;
};

// Example usage
const runReports = async () => {
  try {
    const today = new Date();
    const dailyReport = await generateDailyReport(today);
    console.log('Daily Report:', JSON.stringify(dailyReport, null, 2));

    const monthlyReport = await generateMonthlyReport(today.getFullYear(), today.getMonth() + 1);
    console.log('Monthly Report:', JSON.stringify(monthlyReport, null, 2));
  } catch (error) {
    console.error('Error generating reports:', error);
  }
};

runReports();
*/
