import React, { useEffect } from "react";
import { View, Text,Dimensions, Image, StyleSheet,Button} from "react-native";
import ImageZoom from 'react-native-image-pan-zoom';

export default function Notifications() {

  return (
    <View style={styles.container}>
    
      <Text style={styles.title}>Notifications :)</Text>
      <Text style={styles.sub}>
        test
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sub: {
    fontWeight: "400",
    color: "#37373750",
  },
});
