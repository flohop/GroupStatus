import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  ColorMode,
  extendTheme,
  NativeBaseProvider,
  StorageManager,
} from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { LogBox } from "react-native";
import Routes from "./src/Routes";

// get the saved value from storage
const colorModeManager: StorageManager = {
  get: async () => {
    try {
      let val = await AsyncStorage.getItem("@color-mode");
      return val === "dark" ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  },
  set: async (value: ColorMode) => {
    try {
      if (value) {
        await AsyncStorage.setItem("@color-mode", value);
      }
    } catch (e) {
      console.log(e);
    }
  },
};

export default function App() {
  const customTheme = extendTheme({
    useSystemColorMode: true,
    suppressColorAccessibilityWarning: true,
    //initialColorMode: "dark",
    colors: {
      // some dark value for dark theme background
      bg: {
        dark4: "#202225",
        dark3: "#2f3136",
        dark2: "#36393f",
        dark1: "#40444b",

        light1: "#ecfdf5",
        light2: "#d1fae5",
        light3: "#a7f3d0",
      },
    },
  });

  const setOrientation = async () => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT
    ).catch((err) => {
      console.log("Something went wrong locking the Orientation");
    });
  };

  useEffect(() => {
    setOrientation();
  }, []);

  LogBox.ignoreAllLogs(); // to ignore the annoying NativeBase warning
  LogBox.ignoreLogs([
    "Setting a timer",
    "Linking requires a build-time setting `scheme` in the project's Expo config (app.config.js or app.json) for production apps, if it's left blank, your app may crash. The scheme does not apply to development in the Expo client but you should add it as soon as you start working with Linking to avoid creating a broken build. Learn more: https://docs.expo.io/guides/linking/",
  ]); // firestore causes problems here, that i don't yet know how to fix
  return (
    <NativeBaseProvider theme={customTheme} colorModeManager={colorModeManager}>
      <Routes />
    </NativeBaseProvider>
  );
}
