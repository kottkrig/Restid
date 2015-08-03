"use strict"

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
} = React;

var Leg = React.createClass({

  render: function() {
  	console.log("Leg: render: props: ", this.props);
    return (
    	<View style={styles.legContainer}>
    		<LegIcon leg={this.props.leg} />
      	<Text>{this.props.leg.name}</Text>
    	</View>
    );
  }
});

var LegIcon = React.createClass({
	render: function() {
		return (
			<View style={[{backgroundColor: this.props.leg.fgColor}, styles.iconContainer]}>
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
		padding: 4,
		width: 25
	},

	iconText: {
		textAlign: "center"
	}
})

module.exports = Leg;