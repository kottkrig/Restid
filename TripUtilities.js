"use strict";

var DateUtilities = require("./DateUtilities");

module.exports = {

  getLegDuration: function(leg) {

    var originDate = this.getDateFromLegStop(leg.Origin);
    var destinationDate = this.getDateFromLegStop(leg.Destination);
    return destinationDate - originDate;
  },

  getDateFromLegStop: function(legStop) {
    var isRealtime = legStop.rtDate !== undefined;

    var date
    if (isRealtime) {
      date = DateUtilities.createDate(legStop.rtDate, legStop.rtTime);
    } else {
      date = DateUtilities.createDate(legStop.date, legStop.time);
    }

    return date;
  }
};