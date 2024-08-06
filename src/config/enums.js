const UserRole = Object.freeze({
  EMPLOYEE: "EMPLOYEE",
  ADMIN: "ADMIN",
});

const PermissionType = Object.freeze({
  MEETING: "MEETING",
  SICK_LEAVE: "SICK_LEAVE",
  LATE_ARRIVAL: "LATE_ARRIVAL",
});

const StatusType = Object.freeze({
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
});
const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER'
};
const EmployeeDayStatus = Object.freeze({
  NOT_STARTED: "NOT_STARTED",
  STARTED: "STARTED",
  CHECKED_OUT: "CHECKED_OUT",
  DAY_COMPLETED: "DAY_COMPLETED",
  CHECKED_IN_NO_CHECKOUT: "CHECKED_IN_NO_CHECKOUT",
  OUT_SICK: "OUT_SICK",
  EARLY_OUT: "EARLY_OUT",
  ABSENT: "ABSENT",
  TEMPORARILY_UNAVAILABLE: "TEMPORARILY_UNAVAILABLE",
  PERMISSION_GRANTED: "PERMISSION_GRANTED",
});

module.exports = { UserRole,Gender, PermissionType, StatusType, EmployeeDayStatus };
