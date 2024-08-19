const moment = require("moment-timezone");
function currentDayInEgypt() {
  return moment().tz("Africa/Cairo").format("DD-MM-YYYY");
}
function currentTimeInEgypt() {
  return moment().tz("Africa/Cairo").format("hh:mm:ss A");
}
const calculateTotalHours = (
  checkInTime,
  checkOutTime,
  checkInDate,
  checkOutDate
) => {
  const format = "DD-MM-YYYY hh:mm:ss A";
  const checkIn = moment.tz(
    `${checkInDate} ${checkInTime}`,
    format,
    "Africa/Cairo"
  );
  const checkOut = moment.tz(
    `${checkOutDate} ${checkOutTime}`,
    format,
    "Africa/Cairo"
  );
  const duration = moment.duration(checkOut.diff(checkIn));
  return duration.asHours();
};

module.exports = {
  currentDayInEgypt,
  currentTimeInEgypt,
  calculateTotalHours,
};
