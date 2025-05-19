import { EventSubscription } from "expo-modules-core";
import ExpoReactNativeIbeaconModule from "./ExpoReactNativeIbeaconModule";
import { NativeModules, NativeEventEmitter } from "react-native";

export type BeaconsChangeEvent = {
  beacons: string[];
};

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

  function addBeaconsDetectedListener(
    listener: (event: BeaconsChangeEvent) => void
  ): EventSubscription {
    return eventEmittedFromIOS.addListener("onBeaconsDetected", listener);
  }

  function addBeaconsEnterRegionListener(
    listener: (event: BeaconsChangeEvent) => void
  ): EventSubscription {
    return eventEmittedFromIOS.addListener("onEnterRegion", listener);
  }

  function addBeaconsExitRegionListener(
    listener: (event: BeaconsChangeEvent) => void
  ): EventSubscription {
    return eventEmittedFromIOS.addListener("onExitRegion", listener);
  }

  function addBeaconsBluetoothStateChangedListener(
    listener: (event: { state: string }) => void
  ): EventSubscription {
    return eventEmittedFromIOS.addListener("onBluetoothStateChanged", listener);
  }

  function addBeaconsDetermineStateListener(
    listener: (event: { state: string }) => void
  ): EventSubscription {
    return eventEmittedFromIOS.addListener("onDetermineState", listener);
  }

  return {
    requestAlwaysAuthorization,
    startScanning,
    stopScanning,
    addBeaconsDetectedListener,
    addBeaconsEnterRegionListener,
    addBeaconsExitRegionListener,
    addBeaconsBluetoothStateChangedListener,
    addBeaconsDetermineStateListener,
  };
};
