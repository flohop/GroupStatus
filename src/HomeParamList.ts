import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/core";

export type HomeParamList = {
  Groups: undefined;
  Profile: undefined;
};

export type HomeNavProps<T extends keyof HomeParamList> = {
  navigation: BottomTabNavigationProp<HomeParamList, T>;
  route: RouteProp<HomeParamList, T>;
};
