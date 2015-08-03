"use strict"

var AutoComplete = require("react-native-autocomplete");
var APICommunicator = require("./APICommunicator");

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  AlertIOS
} = React;

var AddView = React.createClass({

	getInitialState: function() {
    return {
      autocompleteDataNames: [],
      autocompleteDataFull: [],
      selectedStop: undefined
    };
  },

  onSearchFieldTyping: function(text) {
    APICommunicator.fetchLocationsForSearchString(text)
      .then((response) => {
        console.log("onTyping: response: ", response);
        var stopNames = response.LocationList.StopLocation.map((location) => location.name);
        var stops = response.LocationList.StopLocation;
        this.setState({
        	autocompleteDataNames: stopNames,
        	autocompleteDataFull: stops
        });
      });
    console.log(text);
  },

  onSelect: function(selectedStopName) {
  	var selectedStopIndex = this.state.autocompleteDataNames.indexOf(selectedStopName);
  	var selectedStop = this.state.autocompleteDataFull[selectedStopIndex];
  	this.setState({selectedStop: selectedStop});
  },

  onPressConfirm: function() {
  	console.log("PRESS!!", this.state.selectedStop);
  	var selectedStop = {
  		name: this.state.selectedStop.name,
  		id: this.state.selectedStop.id,
  		coord: {
  			lat: this.state.selectedStop.lat,
  			long: this.state.selectedStop.lon
  		}
  	};

  	this.props.onAdd(selectedStop);
  },

  render: function() {
  	console.log("Leg: render: props: ", this.props);

  	var button = this.state.selectedStop ? 
  		<Text onPress={this.onPressConfirm}>Lägg till</Text> :
  		<Text>Välj en hållplats</Text>

    return (
    	<View>
    		<AutoComplete 
          onTyping={this.onSearchFieldTyping}
          onSelect={this.onSelect}
          suggestions={this.state.autocompleteDataNames}
          style={{borderWidth: 1, borderColor: "lightblue", height: 50}} />

          {button}
         
         
    	</View>
    );
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

module.exports = AddView;