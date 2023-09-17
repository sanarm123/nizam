import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,Alert,Platform,Linking} from 'react-native';
import Routes from './src/router'
import 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';
import registerNNPushToken from 'native-notify';

import { useEffect,useRef } from 'react';


export default function App() {

  registerNNPushToken(12183, 'Dl5jHPEE4JqTdgV3KjTMOh');
  
  return (
    <>
    <RootSiblingParent>
      <StatusBar barStyle="dark-content" />
        <Routes />
      </RootSiblingParent>
     
    </>
  );
}


