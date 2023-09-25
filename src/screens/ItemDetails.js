import React, { useEffect,useState } from "react";
import { View,StyleSheet} from "react-native";
import { WebView } from 'react-native-webview';

export default function ItemDetails(item) {
  return (
    <WebView
        originWhitelist={['*']}
        source={{ html: '<h1>This is a static HTML source!</h1>' }}
      />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  feed: {
    marginHorizontal: 16,
    marginLeft:-5
  },
  feedItem: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    marginVertical: 8,
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
