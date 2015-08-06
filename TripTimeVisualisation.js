"use strict"

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
} = React;

var hourInPixels = 250;

var TripUtilities = require("./TripUtilities");

var TripTimeVisualisation = React.createClass({

  render: function() {

    var legs = this.props.legs.map((leg, index) => <Leg leg={leg} key={index} />);
    return (
      <View style={styles.legContainer}>
        {legs}
      </View>
    );
  }
});

var Leg = React.createClass({

  render: function() {
    console.log("Leg: ", this.props.leg);
    var durationInMs = TripUtilities.getLegDuration(this.props.leg);
    var durationInHours = durationInMs / 1000 / 60 / 60;
    console.log("Leg duration: ", durationInHours);

    if (this.props.leg.type === "WALK") {
      this.props.leg.fgColor = "#ccc";
      this.props.leg.bgColor = "#444";
      this.props.leg.sname = "";
    }

    return (
      <View style={[{backgroundColor: this.props.leg.fgColor, width: durationInHours * hourInPixels}, styles.iconContainer]}>
        <Text style={[{color: this.props.leg.bgColor}, styles.iconText]}>{this.props.leg.sname}</Text>
      </View>
    )
  }
});

var styles = StyleSheet.create({

  legContainer: {
    flexDirection: "row",
  },

  iconContainer: {
    padding: 4
  },

  iconText: {
    textAlign: "center"
  }
})

module.exports = TripTimeVisualisation;