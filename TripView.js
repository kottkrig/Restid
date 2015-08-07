"use strict"

var React = require('react-native');
var {
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Text,
} = React;

var APICommunicator = require("./APICommunicator");
var DateUtilities = require("./DateUtilities");

var Leg = require("./Leg");
var TripTimeVisualisation = require("./TripTimeVisualisation");

var TripView = React.createClass({

  getInitialState: function() {
    return {
      loaded: false,
      trips: [],
      serverDate: new Date("2015-07-16 12:28")
    };
  },

  componentDidMount: function() {
    this.fetchTrips(this.props.origin, this.props.destination);
  },

  componentWillReceiveProps: function(nextProps) {
    this.fetchTrips(nextProps.origin, nextProps.destination);
  },

  fetchTrips: function(origin, destination) {
    return APICommunicator.fetchTrips(origin, destination)
      .then((responseData) => {
        console.log("TripView: fetchTrips: responseData:", responseData);
        if (responseData.TripList.error) {
          return;
        }

        this.setState({
          serverDate: DateUtilities.createDate(responseData.TripList.serverdate, responseData.TripList.servertime),
          trips: responseData.TripList.Trip.slice(0, 2),
          loaded: true
        });
      })
      .done();
  },

  render: function() {

    if (!this.state.loaded) {
      return (
        <View style={styles.container}>
          <Text style={styles.header}>{this.props.destination.name.toUpperCase()}</Text>
          <View style={styles.headerSeparator} />
          <View style={styles.content}>
            <ActivityIndicatorIOS 
              animating={true}
              style={{justifyContent: "center", alignItems: "center"}} />
          </View>
          
        </View>
      );
    }

    var trips = this.state.trips.map((trip, index) => {return <Trip trip={trip} key={index} serverDate={this.state.serverDate} />});

    return (
      <View style={styles.container}>
        <Text style={styles.header}>{this.props.destination.name.toUpperCase()}</Text>
        <View style={styles.headerSeparator} />
        {trips}
      </View>
    )
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
});

var Trip = React.createClass({
  render: function() {

    var legProps = this.trimWalks(this.props.trip.Leg);
    var legViews = legProps.map((leg, index) => <Leg leg={leg} key={index} />);

    var isRealtime = legProps[0].Origin.rtDate !== undefined;

    var departureDate;

    if (isRealtime) {
      departureDate = DateUtilities.createDate(legProps[0].Origin.rtDate, legProps[0].Origin.rtTime);
    } else {
      departureDate = DateUtilities.createDate(legProps[0].Origin.date, legProps[0].Origin.time);
    }

    console.log("Leaving in: ", departureDate - this.props.serverDate);

    var minutes = (departureDate - this.props.serverDate) / 1000 / 60;
    var timeString = isRealtime ? `${minutes}` : `ca ${minutes}`;

    var lastDestination = legProps[legProps.length - 1].Destination;
    var arrivalTimeString = lastDestination.rtDate ? lastDestination.rtTime : "ca " + lastDestination.time;

    return (
      <View style={styles.content}>
        <View style={styles.travelDescription}>
          <Text style={styles.departureStop}>Från {legProps[0].Origin.name.split(",")[0]}</Text>
          <TripTimeVisualisation legs={legProps} serverDate={this.props.serverDate} />
          <View style={styles.timeContainer}>
            <Text style={styles.departureTime}>Om {timeString} min</Text>
            <Text style={styles.arrivalTime}>Framme {arrivalTimeString}</Text>
          </View>
        </View>
      </View>
    );
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
})

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 20
  },

  header: {
    fontStyle: "italic",
    color: "#545454",
    marginBottom: 5
  },

  headerSeparator: {
    height: 1,
    backgroundColor: "#d1d1d1"
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30
  },

  originDestinationName: {
    fontWeight: "bold"
  },

  travelDescription: {
    flex: 1
  },

  timeContainer: {
    flexDirection: "row",
    marginTop: 5
  },

  departureTime: {
    fontWeight: "bold",
    marginRight: 10
  },

  arrivalTime: {
    color: "#999"
  },

  departureStop: {
    color: "#999",
    marginBottom: 5
  },

  timeRemainingBig: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold"
  },

  timeRemainingSmall: {
    color: "#545454",
    fontSize: 6,
    textAlign: "center",
  }
});

module.exports = TripView;