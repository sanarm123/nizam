import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons,AntDesign } from "@expo/vector-icons";

import Home from "../../screens/Home";
import Profile from "../../screens/Profile";
import Messages from "../../screens/Messages";
import Post from "../../screens/Post";
import Notifications from "../../screens/Notifications";

import Load from "../Load";

const Tab = createBottomTabNavigator();

export default function AppTab() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: "#161F3D",
        inactiveTintColor: "#B8BBc4",
        showLabel: false,
        style: {
          height: 65,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        
        component={Home}
        options={{
          headerShown: false ,
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="People"
        component={Messages}
        options={{
          tabBarIcon: ({ color }) => (
           
            <Ionicons name="md-people-sharp" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={Post}
        listeners={({ navigation }) => ({
          headerShown:true,
          tabPress: (e) => {
          //  e.preventDefault();
           // navigation.navigate("Post");
          },
        })}
        options={{
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="ios-add-circle"
              color={"#E9446A"}
              size={48}
              
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-notifications" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-person" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
