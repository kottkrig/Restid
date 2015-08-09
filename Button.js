"use strict"

var constants = require("./constants");

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
} = React;

var Button = React.createClass({

  getInitialState: function() {
    return {
      
    };
  },

  render: function() {
    return (
      <Text onPress={this.props.isDisabled ? undefined : this.props.onPress} style={[this.props.style, styles.button]}>{this.props.text}</Text>
    );
  }
});

var styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: constants.tintColor,
    textAlign: "center",
    padding: 10,
    color: constants.tintColor,
  }
});

module.exports = Button;