"use strict";

var DateUtilities = require("./DateUtilities");

module.exports = {

  getLegDuration: function(leg) {

    var originDate = this.getDateFromLegStop(leg.Origin);
    var destinationDate = this.getDateFromLegStop(leg.Destination);
    return destinationDate - originDate;
  },

  getDateFromLegStop: function(legStop) {
    console.log("TripUtilities: getDateFromLegStop:", legStop);
    var isRealtime = legStop.rtDate !== undefined;

    var date
    if (isRealtime) {
      date = DateUtilities.createDate(legStop.rtDate, legStop.rtTime);
    } else {
      date = DateUtilities.createDate(legStop.date, legStop.time);
    }

    return date;
  },

  getDurationUntilDeparture: function(origin, serverDate) {
    var originDate = this.getDateFromLegStop(origin);
    console.log("TripUtilities: getDurationUntilDeparture: ", originDate, serverDate);
    return originDate - serverDate;
  },

  trimWalks: function(legs) {
    if (legs.length > 0) {
      if (legs[0].type === "WALK") {
        legs = legs.slice(1);
      }

      if (legs[legs.length - 1].type === "WALK") {
        legs = legs.slice(0, legs.length - 1);
      }
    }

    return legs;
  }
};