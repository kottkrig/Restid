/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var home = {
  name: "Hem",
  coord: {
    long: 11.91974,
    lat: 57.69011
  }
};

var work = {
  name: "Funkis",
  coord: {
    long: 11.96590,
    lat: 57.70530
  }
};

var DESTINATIONS_STORAGE_KEY = "@Restid:destinations";

var React = require('react-native');
var {
  AsyncStorage,
  AppRegistry,
  AppStateIOS,
  NavigatorIOS,
  StyleSheet,
  MapView,
  View,
  Text,
  ListView,
  StatusBarIOS,
  ScrollView,
  AlertIOS
} = React;


var TripView = require("./TripView");
var AddView = require("./AddView");

console.log(StatusBarIOS.Style);

var Restid = React.createClass({

  watchID: (null: ?number),

  getInitialState: function() {
    return {
      lastPosition: null,
      trip: {"Leg":[{"name":"Gå","type":"WALK","Origin":{"name":"Vallgatan 27, 411 16 GÃ¶teborg","type":"ADR","time":"12:28","date":"2015-07-16","$":"\n"},"Destination":{"name":"Kungsportsplatsen, Göteborg","type":"ST","id":"9022014004090002","time":"12:32","date":"2015-07-16","track":"B","$":"\n"}},{"name":"Spårvagn 9","sname":"9","type":"TRAM","id":"9015014500900068","direction":"Saltholmen via Vasaplatsen","fgColor":"#b9e2f8","bgColor":"#00abe5","stroke":"Solid","accessibility":"wheelChair","Origin":{"name":"Kungsportsplatsen, Göteborg","type":"ST","id":"9022014004090002","routeIdx":"7","time":"12:32","date":"2015-07-16","track":"B","rtTime":"12:33","rtDate":"2015-07-16","$":"\n"},"Destination":{"name":"Chapmans Torg, Göteborg","type":"ST","id":"9022014001980002","routeIdx":"16","time":"12:47","date":"2015-07-16","track":"B","rtTime":"12:47","rtDate":"2015-07-16","$":"\n"},"JourneyDetailRef":{"ref":"http://api.vasttrafik.se/bin/rest.exe/v1/journeyDetail?ref=179970%2F91255%2…%3Ddep%26authKey%3Db6345eeb-8ce8-4ffd-a6d2-15978fd4fc6d%26format%3Djson%26"}},{"name":"Gå","type":"WALK","Origin":{"name":"Chapmans Torg, Göteborg","type":"ST","id":"9022014001980002","time":"12:47","date":"2015-07-16","track":"B","$":"\n"},"Destination":{"name":"Hem","type":"ADR","time":"12:57","date":"2015-07-16","$":"\n"}}]},
      serverDate: new Date("2015-07-16 12:28"),
      destinations: [],
      origin: null,
    };
  },

  componentDidMount: function() {
    this.refreshPosition();

    AsyncStorage.getItem(DESTINATIONS_STORAGE_KEY)
      .then((value) => {
        console.log()
        if (value !== null) {
          this.setState({destinations: JSON.parse(value)});
        }
      })
      .done();

      AppStateIOS.addEventListener("change", this.handleAppStateChange);
  },

  componentWillUnmount: function() {
    navigator.geolocation.clearWatch(this.watchID);
    AppStateIOS.removeEventListener("change", this.handleAppStateChange);
  },

  handleAppStateChange: function(currentAppState) {
    console.log("index: handleAppStateChange:", currentAppState);
    if (currentAppState === "active") {
      this.refreshPosition();
    }
  },

  refreshPosition: function() {
    return this.fetchLastPosition()
      .then((lastPosition) => {
        this.setState({origin: {
          name: "Nuvarande position",
          coord: {
            lat: lastPosition.coords.latitude,
            long: lastPosition.coords.longitude
          }
        }});
      })
      .done();
  },

  fetchLastPosition: function() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.clearWatch(this.watchID);
      this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
        navigator.geolocation.clearWatch(this.watchID);
        this.watchID = null;
        resolve(lastPosition);
      }, null, {enableHighAccuracy: true, timeout: 100, maximumAge: 1000});
    });
  },

  onDestinationAdd: function(destination) {
    console.log("onDestinationAdd", destination);
    var destinations = this.state.destinations;
    destinations.push(destination);
    this.setState({
      destinations: destinations
    });

    AsyncStorage.setItem(DESTINATIONS_STORAGE_KEY, JSON.stringify(destinations));
  },

  render: function() {

    if (!this.state.origin) {
      return (<View />);
    }

    var destinations = this.state.destinations
      .map((destination, index) => <TripView key={index} origin={this.state.origin} destination={destination}></TripView>);

    return (
      <ScrollView>
        {destinations}
        <AddView onAdd={this.onDestinationAdd} />
      </ScrollView>
      )
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  map: {
    height: 150,
  },
  leftContainer: {
    flex: 1,
  },
  rightContainer: {
    width: 100,
  },
  direction: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15
  },
  time: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
    
  },
  stop: {
    color: "white"
  },
  listView: {

  }
});


AppRegistry.registerComponent('Restid', () => Restid);

module.exports = Restid;