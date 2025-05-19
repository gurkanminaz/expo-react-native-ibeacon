import * as IBeacon from "expo-react-native-ibeacon";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function App() {
  const [inRegion, setInRegion] = useState(false);
  const [distance, setDistance] = useState(0.0);

  const beaconManager = IBeacon.BeaconScanner();
  beaconManager.requestAlwaysAuthorization();
  beaconManager.startScanning("1B6295D5-4F74-4C58-A2D8-CD83CA26BDF4");

  useEffect(() => {
    const subscription = beaconManager.addBeaconsDetectedListener(
      (beacons: any) => {
        if (
          beacons.length > 0 &&
          beacons[0].distance &&
          beacons[0].distance > 0 &&
          beacons[0].distance.toFixed(1) !== distance
        ) {
          let distance = beacons[0].distance.toFixed(1);
          setDistance(distance);
          console.log("onBeaconsDetected", beacons[0].distance);
        }
      }
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    beaconManager.addBeaconsEnterRegionListener((beacons: any) => {
      if (beacons.length > 0 && beacons[0].distance) {
        console.log("onEnterRegion", beacons[0].distance);
      }
      setInRegion(true);
    });
  }, []);

  useEffect(() => {
    beaconManager.addBeaconsExitRegionListener((beacons: any) => {
      if (beacons.length > 0 && beacons[0].distance) {
        console.log("onExitRegion", beacons[0].distance);
      }
      setInRegion(false);
    });
  }, []);

  // useEffect(() => {
  //   const subscription = beaconManager.addBeaconsBluetoothStateChangedListener(
  //     (event) => {
  //       console.log("onBluetoothStateChanged", event);
  //     }
  //   );

  //   return () => subscription.remove();
  // }, []);

  // useEffect(() => {
  //   const subscription = beaconManager.addBeaconsDetermineStateListener(
  //     (event) => {
  //       console.log("onDetermineState", event);
  //     }
  //   );

  //   return () => subscription.remove();
  // }, []);
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 32,
          height: 50,
          backgroundColor: inRegion ? "#62BB46" : "#472F92",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>
          {inRegion && distance
            ? "In Area: " + distance.toString() + " m"
            : "Out of Area: " + distance.toString() + " m"}
        </Text>
      </View>
    </View>
  );
}
