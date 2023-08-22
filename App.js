import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Routes from './src/router'
import 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';

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


