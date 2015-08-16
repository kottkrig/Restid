"use strict"

var React = require('react-native');
var {
  ActivityIndicatorIOS,
  AlertIOS,
  StyleSheet,
  View,
  Text,
} = React;

var APICommunicator = require("./APICommunicator");
var DateUtilities = require("./DateUtilities");
var TripUtilities = require("./TripUtilities");

var Leg = require("./Leg");
var TripTimeVisualisation = require("./TripTimeVisualisation");

var TripView = React.createClass({

  getInitialState: function() {
    return {
      loaded: false,
      failed: false,
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

        if (!responseData) {
          AlertIOS.alert(
            "responseData is null",
            `destination: ${destination.name}`
          );
          this.setState({failed: true, loaded: true});
          return;
        }

        if (!responseData.TripList) {
          AlertIOS.alert(
            "responseData.TripList is null",
            JSON.stringify(responseData)
          );
          this.setState({failed: true, loaded: true});
          return;
        }

        if (responseData.TripList.error) {
          this.setState({failed: true, loaded: true});
          return;
        }

        this.setState({
          serverDate: DateUtilities.createDate(responseData.TripList.serverdate, responseData.TripList.servertime),
          trips: responseData.TripList.Trip.slice(0, 2),
          loaded: true,
          failed: false
        });
      })
      .done();
  },

  render: function() {

    var destinationName = this.props.destination.name.split(",")[0];

    if (!this.state.loaded) {
      return (
        <View style={styles.container}>
          <View style={styles.tripsContainer}>
            <Text style={styles.header}>TILL {destinationName.toUpperCase()}:</Text>
            <View style={styles.loadingContainer}>
              <ActivityIndicatorIOS 
                animating={true}
                style={{}} />
            </View>
          </View>
        </View>
      );
    }

    if (this.state.failed) {
      return(<View />);
    }

    var trips = this.state.trips.map((trip, index) => {return <Trip trip={trip} key={index} serverDate={this.state.serverDate} />});

    return (
      <View style={styles.container}>
        <View style={styles.tripsContainer}>
          <Text style={styles.header}>TILL {destinationName.toUpperCase()}:</Text>
          {trips}
        </View>
      </View>
    )
  }
});

var Trip = React.createClass({
  render: function() {

    var legProps = TripUtilities.trimWalks(this.props.trip.Leg);
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
  }
})

var styles = StyleSheet.create({
  container: {
    
  },

  loadingContainer: {
    height: 220,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },

  tripsContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 2,
    shadowColor: "#d6d6d8",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 0,
    marginBottom: 30
  },

  header: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
    marginBottom: 15
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
    flex: 1,
    overflow: "hidden"
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