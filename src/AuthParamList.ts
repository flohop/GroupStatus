import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/core";

export type AuthParamList = {
  Register: undefined;
  Login: undefined;
};

export type HomeNavProps<T extends keyof AuthParamList> = {
  navigation: BottomTabNavigationProp<AuthParamList, T>;
  route: RouteProp<AuthParamList, T>;
};
