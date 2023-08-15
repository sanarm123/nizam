import React from "react";
import { View, Text,Dimensions, Image, StyleSheet } from "react-native";
import ImageZoom from 'react-native-image-pan-zoom';

export default function Notifications() {
  return (
    <View style={styles.container}>
      <ImageZoom cropWidth={Dimensions.get('window').width}
                       cropHeight={Dimensions.get('window').height}
                       imageWidth={200}
                       imageHeight={200}>
                <Image style={{width:200, height:200}}
                       source={{uri:'http://v1.qzone.cc/avatar/201407/07/00/24/53b9782c444ca987.jpg!200x200.jpg'}}/>
            </ImageZoom>
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
