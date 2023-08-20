import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation,StackActions } from "@react-navigation/native";
import { useEffect } from "react";
export default function Thankyoupost() {

    const navigation = useNavigation();

    useEffect( ()=>{

        navigation.dispatch()
    })

    function sinoutMe(){
   
        try {
            navigation.dispatch(StackActions.replace('Home'));
        } catch (error) {
            alert(error);
        } 
  
    }
  return (
    <View style={styles.container}>
     
      <Text style={styles.title}>You have successfully logged out!"</Text>
      <Text style={styles.sub}>
       Thank You
      </Text>

      <Button title="Please click here to relogin" onPress={() => sinoutMe()} />
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
