const moment = require("moment-timezone");
function currentDayInEgypt() {
  return moment().tz("Africa/Cairo").format("DD-MM-YYYY");
}
function currentTimeInEgypt() {
  return moment().tz("Africa/Cairo").format("hh:mm:ss A");
}

module.exports = {
  currentDayInEgypt,
  currentTimeInEgypt,
};
