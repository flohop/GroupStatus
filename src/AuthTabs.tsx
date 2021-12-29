import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { AuthParamList } from "./AuthParamList";
import Login from "./Login";
import Register from "./Register";

type AuthProps = {};

const Tab = createBottomTabNavigator<AuthParamList>();

const Auth: React.FC<AuthProps> = ({}) => {
  return (
    <Tab.Navigator
      initialRouteName="Register"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // conditionally set the icon
          if (route.name === "Register") {
            iconName = focused ? "add-circle-outline" : "add-circle-outline";
          } else if (route.name === "Login") {
            iconName = focused ? "login" : "login";
          } else {
            iconName = "group"; // changed from "groupe"
          }

          // You can return any component that you like here!
          return (
            <MaterialIcons name={iconName as any} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "#34d399",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Register"
        options={{ title: "Register", header: () => undefined }}
        component={Register}
      />
      <Tab.Screen
        name="Login"
        component={Login}
        options={{ header: () => undefined }}
      />
    </Tab.Navigator>
  );
};

export default Auth;
