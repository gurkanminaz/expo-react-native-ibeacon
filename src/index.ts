import { EventSubscription } from "expo-modules-core";
import ExpoReactNativeIbeaconModule from "./ExpoReactNativeIbeaconModule";
import { NativeModules, NativeEventEmitter } from "react-native";

export type Theme = "light" | "dark" | "system";

export type ThemeChangeEvent = {
  theme: string;
};

export function addThemeListener(
  listener: (event: ThemeChangeEvent) => void
): EventSubscription {
  return ExpoReactNativeIbeaconModule.addListener("onChangeTheme", listener);
}

export function getTheme(): string {
  return ExpoReactNativeIbeaconModule.getTheme();
}

export function setTheme(theme: string): void {
  return ExpoReactNativeIbeaconModule.setTheme(theme);
}

export type BeaconsChangeEvent = {
  beacons: string[];
};

// export function requestAlwaysAuthorization(): void {
//   return ExpoReactNativeIbeaconModule.requestAlwaysAuthorization();
// }
export function startScanning(beacon: string): void {
  return ExpoReactNativeIbeaconModule.startScanning(beacon, null);
}

export const BeaconScanner = () => {
  const { BeaconManager } = NativeModules;
  const eventEmittedFromIOS = new NativeEventEmitter(
    NativeModules.RNEventEmitter
  );
  const requestAlwaysAuthorization = () => {
    BeaconManager.requestAlwaysAuthorization();
  };

  const startScanning = (uuid: string) => {
    BeaconManager.startScanning(uuid, null);
  };

  const stopScanning = (uuid: string) => {
    BeaconManager.stopScanning(uuid);
  };

  // const addBeaconsDetectedListener = (listener: (event: BeaconsChangeEvent) => void)=> {
  //   eventEmittedFromIOS.addListener("onBeaconsDetected", listener)
  // }
  function addBeaconsDetectedListener(
    listener: (event: BeaconsChangeEvent) => void
  ): EventSubscription {
    return eventEmittedFromIOS.addListener("onBeaconsDetected", listener);
  }

  return {
    requestAlwaysAuthorization,
    startScanning,
    stopScanning,
    addBeaconsDetectedListener,
  };
};
