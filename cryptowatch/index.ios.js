/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  NavigatorIOS
} from 'react-native';
import CryptoList from './src/CryptoList'

export default class App extends Component {
  render() {
    return (
      <NavigatorIOS
        style={{flex: 1}}
        initialRoute={{
          title: 'Crypto Watch',
          component: CryptoList
      }} />
    );
  }
}


AppRegistry.registerComponent('cryptowatch', () => App);
