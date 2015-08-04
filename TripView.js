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

var TripView = React.createClass({

  getInitialState: function() {
    return {
      loaded: false,
      trips: [],
      serverDate: new Date("2015-07-16 12:28")
    };
  },

  componentDidMount: function() {
    APICommunicator.fetchTrips(this.props.origin, this.props.destination)
      .then((responseData) => {
        console.log(responseData);
        this.setState({
          serverDate: DateUtilities.createDate(responseData.TripList.serverdate, responseData.TripList.servertime),
          trips: responseData.TripList.Trip.slice(0, 2),
          loaded: true
        });
      });
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
    console.log(trips);

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

    return (
      <View style={styles.content}>
        <View style={styles.travelDescription}>
          <Text style={styles.originDestinationName}>{legProps[0].Origin.name}</Text>
          <View style={styles.legsContainer}>{legViews}</View>
          <Text style={styles.originDestinationName}>{legProps[legProps.length - 1].Destination.name}</Text>
        </View>
        <View style={styles.departureTimeContainer}>
          <Text style={styles.timeRemainingSmall}>Avgår om</Text>
          <Text style={styles.timeRemainingBig}>{timeString}</Text>
          <Text style={styles.timeRemainingSmall}>min</Text>
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

  departureTimeContainer: {
    
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