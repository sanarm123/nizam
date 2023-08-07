import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Routes from './src/router'
import 'react-native-gesture-handler';


export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <Routes />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
