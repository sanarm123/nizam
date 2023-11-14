import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Header from "../components/Header";
import Tel from './Tel'
import { useVoiceRecognition } from "../hooks/useVoiceRecognition";

import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: false,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  playThroughEarpieceAndroid: false,
});


export default function Messages({ navigation }) {

  const { state, startRecognizing, stopRecognizing, destroyRecognizer } =useVoiceRecognition();
  const [urlPath, setUrlPath] = useState("");
  const [borderColor, setBorderColor] = useState("lightgray");


  useEffect(() => {
    listFiles();
  }, []);
 
  const listFiles = async () => {

    try {
      const result = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory
      );
      if (result.length > 0) {
        const filename = result[0];
        const path = FileSystem.documentDirectory + filename;
        console.log("Full path to the file:", path);
        setUrlPath(path);
      }
    } catch (error) {
      console.error("An error occurred while listing the files:", error);
    }

  };


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


  const fetchText = async (mytext) => {
    const response = await fetch(
      "https://us-central1-myworld-d76d2.cloudfunctions.net/ConvertTeluguToEnglish",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({'text': 'కడుపు నొప్పికి ఏమందులు వాడాలి' }),
      }
    );
    return await response.blob();
  };

  const handleSubmit = async () => {

    //if (!state.results[0]) return;

    const mytemptext='కడుపు నొప్పికి ఏమందులు';
   
  

    try {

      const audioBlob = await fetchText(mytemptext);

      alert(JSON.stringify(audioBlob));

       //reader.readAsDataURL(audioBlob);
     } catch (e) {
       console.error("An error occurred:", e);
     }
  }


  
return (
  <View style={styles.container}>
    <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 30 }}>
      Talk GPT 🤖
    </Text>
    <Text style={styles.instructions}>
      Press and hold this button to record your voice. Release the button to
      send the recording, and you'll hear a response
    </Text>
    <Text style={styles.welcome}>Your message:{state.results[0]} </Text>


    <Pressable
        onPressIn={() => {
           setBorderColor("lightgreen");
          startRecognizing();
        }}
        onPressOut={() => {
           setBorderColor("lightgray");
           stopRecognizing();
           handleSubmit();
        }}
        style={{
          width: "90%",
          padding: 30,
          gap: 10,
          borderWidth: 3,
          alignItems: "center",
          borderRadius: 10,
          borderColor: borderColor,
        }}
      >
       <Text style={styles.welcome}>
          {state.isRecording ? "Release to Send" : "Hold to Speak"}
        </Text>
        <Image style={styles.button} source={require("../appimages/button.png")} />
      </Pressable>
    
  </View>
);
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    padding: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  action: {
    textAlign: "center",
    color: "#0000FF",
    marginVertical: 5,
    fontWeight: "bold",
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
    fontSize: 12,
  },
  stat: {
    textAlign: "center",
    color: "#B0171F",
    marginBottom: 1,
  },
});
