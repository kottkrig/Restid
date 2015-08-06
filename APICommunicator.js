"use strict";

var apiKey = require("./api-key.json");

var authKey = apiKey.authKey;

var walkSpeed = 140;

module.exports = {
  fetchTrips: function(origin, destination) {
    var tripUrl = `http://api.vasttrafik.se/bin/rest.exe/v1/trip?authKey=${authKey}&format=json&walkSpeed=${walkSpeed}${this.getOriginString(origin)}${this.getDestinationString(destination)}`;
    console.log(tripUrl);
    return fetch(tripUrl)
      .then((response) => response.json(), (error) => console.error(error));
  },

  fetchLocationsForSearchString: function(searchString) {
    var url = `http://api.vasttrafik.se/bin/rest.exe/v1/location.name?authKey=${authKey}&format=json&input=${searchString}`;
    console.log("APICommunicator: fetchLocationsForSearchString: url: ", url);
    return fetch(url)
      .then((response) => response.json(), (error) => console.error(error));
  },

  getDestinationString: function(destination) {
    if (destination.id) {
      return `&destId=${destination.id}`;
    } else if (destination.coord.lat && destination.coord.long) {
      return `&destCoordLat=${destination.coord.lat}&destCoordLong=${destination.coord.long}&destCoordName=${destination.name}`;
    }
  },

  getOriginString: function(origin) {
    return `&originCoordLat=${origin.coord.lat}&originCoordLong=${origin.coord.long}&originCoordName=${origin.coord.name}`;
  }
};