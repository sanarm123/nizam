import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Header from "../components/Header";
import Tel from './Tel'



export default function Messages({ navigation }) {
 function onPressTel(number) {
    Linking.openURL(`tel://${number}`).catch(err => console.log('Error:', err))
  }

  onPressSms = () => {
    console.log('sms')
  }

  onPressEmail = email => {
    Linking.openURL(`mailto://${email}?subject=subject&body=body`).catch(err =>
      console.log('Error:', err)
    )
  }

  return (
    <View style={{marginLeft:20,marginTop:5}}>
      <Text style={{fontSize:25}}>Emergency Contacts</Text>


      <TouchableOpacity  onPress={() => onPressTel(100)}>
        <Text style={{fontSize:18,margin:10}}  >
          Police: 100
          </Text>
      </TouchableOpacity>

      <TouchableOpacity  onPress={() => onPressTel(108)}>
        <Text style={{fontSize:18,margin:10}}  >
        Ambulance: 108
          </Text>
      </TouchableOpacity>

      <TouchableOpacity  onPress={() => onPressTel('040-24745243')}>
        <Text style={{fontSize:18,margin:10}}  >
        Blood Bank: 040-24745243
          </Text>
      </TouchableOpacity>
      

       

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'flex-start',
    alignItems:'flex-start',
  },
  contentChat: {
    flex: 1,
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  contentChatUser: {
    width: "100%",
    height: 75,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  header: {
    width: "100%",
    paddingTop: 34,
    paddingBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  textHeader: {
    fontSize: 22,
    fontWeight: "bold",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  chatButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    height: 70,
    width: 70,
    borderRadius: 70 / 2,
    backgroundColor: "#123178",
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
