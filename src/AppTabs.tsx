import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useColorModeValue } from "native-base";
import React from "react";
import { Provider } from "react-redux";
import { CurrentUserProvider } from "./components/auth/CurrentUserProvider";
import Group from "./components/Group";
import Profile from "./components/Profile";
import ThemeToggle from "./components/ThemeToggle";
import { HomeParamList } from "./HomeParamList";
import { store } from "./store/store";

type RoutesProps = {};

const Tab = createBottomTabNavigator<HomeParamList>();

const Routes: React.FC<RoutesProps> = ({}) => {
  // colors
  const tabBackgroundActiveColor = useColorModeValue("white", "#2f3136");
  const tabBackgroundInactiveColor = useColorModeValue("white", "#36393f");

  const headerBackgroundColor = useColorModeValue("white", "#2f3136");
  const headerTextColor = useColorModeValue("black", "white");

  return (
    <CurrentUserProvider>
      <Provider store={store}>
        <Tab.Navigator
          initialRouteName="Groups"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Groups") {
                iconName = focused ? "group" : "group";
              } else if (route.name === "Profile") {
                iconName = focused ? "account-circle" : "account-circle";
              } else {
                iconName = "groupe";
              }

              return (
                <MaterialIcons
                  name={iconName as any}
                  size={size}
                  color={color}
                />
              );
            },
            tabBarActiveTintColor: "#34d399",
            tabBarInactiveTintColor: "gray",
            tabBarActiveBackgroundColor: tabBackgroundActiveColor,
            tabBarInactiveBackgroundColor: tabBackgroundInactiveColor,
          })}
        >
          <Tab.Screen
            name="Groups"
            options={{ title: "Groups", headerShown: false }}
            component={Group}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              headerRight: () => <ThemeToggle />,
              headerTitleStyle: {
                color: headerTextColor,
              },
              headerStyle: {
                backgroundColor: headerBackgroundColor,
              },
            }}
          />
        </Tab.Navigator>
      </Provider>
    </CurrentUserProvider>
  );
};
export default Routes;
