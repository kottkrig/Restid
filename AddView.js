"use strict"

var AutoComplete = require("react-native-autocomplete");
var APICommunicator = require("./APICommunicator");
var Button = require("./Button");
var constants = require("./constants");
var Overlay = require("react-native-overlay");
var BlurView = require("react-native-blur").BlurView

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  AlertIOS,
  TouchableHighlight
} = React;

var AddView = React.createClass({

  getInitialState: function() {
    return {
      autocompleteDataNames: [],
      autocompleteDataFull: [],
      selectedStop: undefined,
      addViewVisible: true
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
      <Button onPress={this.onPressConfirm} /> :
      <Text>Välj en hållplats</Text>

    return (
      <Overlay isVisible={this.props.isVisible} style={{flex: 1}}>
        <BlurView style={styles.background} blurType="light">
          <View style={styles.container}>
            <AutoComplete 
              onTyping={this.onSearchFieldTyping}
              onSelect={this.onSelect}
              suggestions={this.state.autocompleteDataNames}
              placeholder="Sök efter hållplats"
              style={{borderWidth: 1, borderColor: constants.tintColor, height: 50, color: constants.tintColor}} />

              <Button onPress={this.onPressConfirm} text="Lägg till hållplats" style={styles.buttonConfirm} isDisabled={this.state.selectedStop === undefined} /> 
          </View>
        </BlurView>
      </Overlay>
    );
  }
});

var styles = StyleSheet.create({

  background: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },

  buttonConfirm: {
    marginTop: 10
  },

  container: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    alignSelf: "center",
    height: 200,
    flex: 1,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 2}
  }
})

module.exports = AddView;