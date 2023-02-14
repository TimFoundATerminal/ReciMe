import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feed from "./src/screens/Feed";
import Pantry from "./src/screens/Pantry";
import Blacklist from "./src/screens/Blacklist";
import Impact from "./src/screens/Impact";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Feed") {
              iconName = focused
                ? "ios-information-circle"
                : "ios-information-circle-outline";
            } else if (route.name === "Pantry") {
              iconName = focused ? "ios-list" : "ios-list-outline";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Feed" component={Feed} tabBarIcon />
        <Tab.Screen name="Pantry" component={Pantry} />
        <Tab.Screen name="Impact" component={Impact} />
        <Tab.Screen name="Blacklist" component={Blacklist} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  ); //feed, pantry, impact, blacklist
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
