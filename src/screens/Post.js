import React, { useState, useEffect } from "react";
import { useNavigation,useIsFocused } from "@react-navigation/native";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { ToastProvider } from "react-native-toast-notifications";

import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import Fire from "../components/Fire/index2";

import {
  View,
  Text,
  Alert,
  Image,
  Button,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from "react-native";

import AsyncStorage,{useAsyncStorage} from "@react-native-async-storage/async-storage"; 
const firebaseConfig = require("../config/firebaseConfig");
// "add moment(item.timestamp).fromNow()" in code "item.node_id"
const data = Fire.shared.fakeData;

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
 }

 

export default function Post() {

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState();

 


  const [photoUrl, setPhotoUrl] = useState(
    "https://img.icons8.com/material-outlined/24/000000/user--v1.png"
  );

  const navigation = useNavigation();


 

   function SplashScreen() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Please Wait while loading...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
 

  useEffect( async ()=>{


    async function fetchData() {
      const list = [];
  
      let query = firebase.firestore().collection("posts").orderBy("created", "desc").limit(10);
  
      query.get()
        .then((docs) => {
  
          docs.forEach((doc) => {
            
            list.push(doc.data());
  
           // console.log(doc.data());
  
          })
  
         // alert(list);
          setPosts(list);
  
          if(posts!=null){
            posts.forEach((doc)=>{
              console.log("Reading from Posts:"+JSON.stringify(doc));
            });
          }
       
        
           setIsLoading(false);
  
        }).catch((err) => {
          setIsLoading(false);
          console.log(err)
        })
    }
      // ...
    
    fetchData();
  
  
    // return ()=>getPosts();
  
   },[])

  async function handlePost() {
    const data = {
      text: text.trim(),
      localUri: image,
      likes: 0,
      comments: [],
    };

    return Fire.shared
      .addPost(data)
      .then(() => {
        setText("");
        setImage(null);
        navigation.goBack();
      })
      .catch((err) => {
        Alert.alert("erro", JSON.stringify(err));
      });
  }

  async function pickImage() {
    const resul = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!resul.cancelled) {
      setImage(resul.uri);
    }
  }

  useEffect(async () => {
    //console.disableYellowBox = true;
    AsyncStorage.getItem("@user").then((response) => {

        //alert(response);
    
        let myData=JSON.parse(response);

        setUserInfo(myData);
    });
        
    

  }, []);

  function PostComment() {

    setIsLoading(true);

    firebase.firestore().collection("posts").add({
      text: text,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner:userInfo.uid,
      owner_name: userInfo.displayName
    }).then(async (doc) => {
        setIsLoading(false);

        Alert.alert("Info", "Successfully uploaded");

    }).catch((err) => {
        setIsLoading(false);
        Alert.alert("Error", "Failed to load");
    });

  }

  if (isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (
    <View style={styles.container}>
        <View style={{flex:1}}>
            <TextInput
            placeholder="What's on your mind?"
            multiline
            value={text}
            onChangeText={setText}
            numberOfLines={4}
            style={{margin:20}}
            
            />
           <Button
            onPress={PostComment}
            title="Submit"
           
            accessibilityLabel="Post "
            />
        </View>
          
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:20,
    justifyContent: "space-between",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB",
  },
  inputContainer: {
    margin: 20,
    flexDirection: "row",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  photo: {
    alignItems: "flex-end",
    marginHorizontal: 32,
  },
  feed: {
    marginHorizontal: 16,
  },
  feedItem: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    marginVertical: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#454D65",
  },
  timestamp: {
    fontSize: 11,
    color: "#C4C6CE",
    marginTop: 4,
  },
  post: {
    marginTop: 16,
    fontSize: 14,
    color: "#838899",
  },
  postImage: {
    width: "auto",
    height: 150,
    borderRadius: 5,
    marginVertical: 16,
  },
});
