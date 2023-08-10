import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  Button,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";


import { FontAwesome5 } from "@expo/vector-icons";
import getImage from "../utils/getImageAdorable";

import  firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import Fire from "../components/Fire/index2";
import { CommonActions, useNavigation,StackActions } from "@react-navigation/native";
import AsyncStorage,{useAsyncStorage} from "@react-native-async-storage/async-storage"; 
import Login from "./Login";

const data = Fire.shared.fakeData;

export default function Profile() {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState({});

  const navigation = useNavigation();


  async function test() {
    //await AdMobRewarded.setAdUnitID("ca-app-pub-5014682151271774/3906623363");
    //await AdMobRewarded.requestAdAsync();
    //await AdMobRewarded.showAdAsync();
  }

  const [userInfo, setUserInfo] = useState();

  function sinoutMe(){

   
      try {
       

        AsyncStorage.removeItem('@user');


       navigation.dispatch(StackActions.replace('Thankyou'));
       
         
      } catch(e) {
        alert("error");
      }
       console.log('Done')

  }
  

  useEffect(async () => {
    console.disableYellowBox = true;
    AsyncStorage.getItem("@user").then((response) => {
  
    let myData=JSON.parse(response);

 

    setUserName(myData.displayName);
 });
    
   

    //console.log("Profile:"+userJSON);

    //alert(userInfo.displayName);


    setUserName(userInfo.displayName);

   // setAvatarUrl(Fire.shared.userData.photoURL);
    Fire.shared.userInfos
      .get()
      .then(function (doc) {
        setInfos(doc.data());
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [avatarUrl]);

  async function refreshAvatar() {
    if (loading) {
      return setLoading(false);
    }
    setLoading(true);

    setAvatarUrl(getImage());
    Fire.shared.userData
      .updateProfile({
        photoURL: avatarUrl,
      })
      .then(() => console.log("atualizado"));
    test();
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}
      style={styles.container}
    >
      <View style={{ marginTop: 32, alignItems: "center" }}>
        <View style={styles.avatarContainer}>
         
          <TouchableOpacity
            style={styles.tradeIcon}
            onPress={() => refreshAvatar()}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <FontAwesome5 name="exchange-alt" size={22} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>Name: {userName}</Text>
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.status}>
         
        </View>
        <View style={styles.status}>
          <Text style={styles.statAmount}>
            {infos?.folloers ? infos?.folloers : 0}
          </Text>
          <Text style={styles.statTitle}>seguidores</Text>
        </View>
        <View style={styles.status}>
          <Text style={styles.statAmount}>
            {infos?.following ? infos?.folowing : 0}
          </Text>
          <Text style={styles.statTitle}>seguindo</Text>
        </View>
      </View>
    
      <Button title="Logout" onPress={() => sinoutMe()} />
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarContainer: {
    shadowColor: "#151734",
    shadowRadius: 15,
    shadowOpacity: 0.5,
    borderWidth: 4,
    borderRadius: 136 / 2,
    borderColor: "#37373799",
  },
  containerPosts: {
    width: "95%",
    height: "auto",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#C3c5cd",
    borderRadius: 2,
  },

  avatar: {
    width: 136,
    height: 136,
    borderRadius: 136 / 2,
  },
  tradeIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: "#4278ff",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: "bold",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 32,
  },
  status: {
    alignItems: "center",
    flex: 1,
  },
  statAmount: {
    color: "#4F566D",
    fontSize: 18,
    fontWeight: "300",
  },
  statTitle: {
    color: "#C3c5cd",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
  post: {
    height: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    borderColor: "#333",
  },
});
