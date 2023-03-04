import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Instructions from "./src/screens/Instructions";
import Feed from "./src/screens/Feed";
import Pantry from "./src/screens/Pantry";
import Blacklist from "./src/screens/Blacklist";
import Impact from "./src/screens/Impact";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Foundation from "react-native-vector-icons/Foundation";
import FeedScreen from "./src/screens/Feed";

const FeedStack = createNativeStackNavigator();

function FeedStackScreen() {
  return (
    <FeedStack.Navigator options={{headerShown: false}} >
      <FeedStack.Screen name="Feed" component={FeedScreen} options={{headerShown: false}} />
      <FeedStack.Screen name="Instructions" component={Instructions} options={{headerShown: false}} />
    </FeedStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Feed">
        <Tab.Screen
          name="Feed"
          component={Feed}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ios-list" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Pantry"
          component={Pantry}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="cupboard-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Impact"
          component={Impact}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Foundation name="foot" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Blacklist"
          component={Blacklist}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="food-off"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  ); //feed, pantry, impact, blacklist
}
