"use strict";

module.exports = {
  /**
   * Create a date from time and date string
   * @param  {String} dateString YYYY-MM-DD
   * @param  {String} timeString HH:MM
   * @return {Date} A date object
   */
  createDate: function(dateString, timeString) {

    // For some reason, a regular new Date(dateString) does not work
    // in React Native when running on device.

    var dateArray = dateString.split("-");
    var year = parseInt(dateArray[0], 10);
    var month = parseInt(dateArray[1], 10) - 1;
    var day = parseInt(dateArray[2], 10);

    var timeArray = timeString.split(":");
    var hour = parseInt(timeArray[0], 10);
    var minute = parseInt(timeArray[1], 10);

    return new Date(year, month, day, hour, minute);
  }
};