import React, { useState,useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage,{useAsyncStorage} from "@react-native-async-storage/async-storage"; 

import moment from "moment";

import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  ActivityIndicator,
} from "react-native";

import Fire from "../components/Fire/index2";
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { RefreshControl } from "react-native-gesture-handler";

// "add moment(item.timestamp).fromNow()" in code "item.node_id"
const data = Fire.shared.fakeData;

export default function Home() {
  const [posts, setPosts] = useState(data);
  const [likeIcon, setLikeIcon] = useState("ios-heart-empty");
  const [likeColor, setLikeColor] = useState("#73788B");
  const [isLoading, setIsLoading] = useState(false);

  async function fetchData() {

    setIsLoading(true);
    const list = [];

    let query = firebase.firestore().collection("posts").orderBy("created", "desc").limit(10);

    query.get()
      .then((docs) => {

        docs.forEach((doc) => {
          
          list.push(doc.data());

          console.log(doc.data());

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
    
  useEffect( async ()=>{
    
    fetchData();
  
   },[])

  const hidden = false;
  useEffect(() => {
    console.disableYellowBox = true;
  }, []);

  function like(item) {
    if (likeIcon === "ios-heart-empty") {
      setLikeIcon("ios-heart");
      setLikeColor("#ff3612");
    } else {
      setLikeIcon("ios-heart-empty");
      setLikeColor("#73788B");
    }
    item.site_admin = true;
  }

  function SplashScreen() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Please Wait while loading...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 35, height: 20 }} />
        <Text style={styles.textHeader}>Posts</Text>
        <TouchableOpacity
          style={{ height: 35, width: 35, borderRadius: 35 / 2 }}
        >
        
        </TouchableOpacity>
      </View>
      {hidden ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
         
          <Text style={{ fontSize: 20, fontWeight: "500", color: "#33333350" }}>
            Posts
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.feed}
          data={posts}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <>
              <View style={styles.feedItem}>
                <Image
                  source={{ uri: item.avatar_url }}
                  style={styles.avatar}
                />
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text style={styles.name}>{item.owner_name}</Text>
                      <Text style={styles.timestamp}>{item.createdAt}</Text>
                    </View>

                   
                  </View>

                  <Text style={styles.post}>{item.text}</Text>
                  <Image
                    source={{ uri: item.imageLink }}
                    resizeMode="cover"
                    style={styles.postImage}
                  />

                
                </View>
              </View>
              
            </>
          )}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchData}>

            </RefreshControl>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    width: "100%",
    paddingTop: 34,
    paddingBottom: 16,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EBECF4",
    shadowColor: "#454D65",
    shadowOffset: {
      height: 5,
    },
    shadowOpacity: 0.5,
    zIndex: 10,
  },
  textHeader: {
    fontSize: 22,
    fontWeight: "bold",
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
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    
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
    alignItems:'center',
    marginVertical: 16,
  },
});
