import * as IBeacon from "expo-react-native-ibeacon";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

export default function App() {
  const [theme, setTheme] = useState<string>(IBeacon.getTheme());

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
          console.log("onBeaconsDetected3", beacons[0].distance);
        }
      }
    );
    return () => subscription.remove();
  }, []);

  // useEffect(() => {
  //       eventEmittedFromIOS.addListener("onEnterRegion", beacons => {
  //           if (beacons.length > 0 && beacons[0].distance) {
  //               console.log("onEnterRegion", beacons[0].distance);
  //           }
  //           setInRegion(true);
  //       });
  //   }, []);

  useEffect(() => {
    const subscription = IBeacon.addThemeListener(({ theme: newTheme }) => {
      setTheme(newTheme);
    });

    return () => subscription.remove();
  }, [setTheme]);

  const nextTheme = theme === "dark" ? "light" : "dark";
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme === "dark" ? "#000" : "#fff",
      }}
    >
      <Text style={{ color: theme === "dark" ? "#fff" : "#000" }}>
        Theme: {IBeacon.getTheme()}
      </Text>

      <Button
        title={`Set theme to ${nextTheme}`}
        onPress={() => IBeacon.setTheme(nextTheme)}
      />
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
          {inRegion
            ? "In Area: " + distance + " m"
            : "Out of Area: " + distance + " m"}
        </Text>
      </View>
    </View>
  );
}
