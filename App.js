import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,Alert,Platform,Linking} from 'react-native';
import Routes from './src/router'
import 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';

import { useEffect,useRef } from 'react';


export default function App() {

 
  return (
    <>
    <RootSiblingParent>
      <StatusBar barStyle="dark-content" />
        <Routes />
      </RootSiblingParent>
     
    </>
  );
}


