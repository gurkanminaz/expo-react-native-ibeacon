# expo-react-native-ibeacon

iBeacon support for React Native. The API is very similar to the CoreLocation Objective-C one with the only major difference that regions are plain JavaScript objects. Beacons don't work in the iOS simulator.

Looking for an Android version? Try out

@mmazzarolo AltBeacon
@octavioturra's AltBeacon

# Support
This module supports all iBeacon-compatible devices. 



# Installation in bare React Native projects

Install using npm with npm i expo-react-native-ibeacon. React Native >=0.79.0 is needed.


### Usagee

```javascript
import * as IBeacon from "expo-react-native-ibeacon";
import { useEffect, useState } from "react";

const [distance, setDistance] = useState(0.0);
const beaconManager = IBeacon.BeaconScanner();
beaconManager.requestAlwaysAuthorization();
beaconManager.startScanning("XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX");

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
        }
      }
    );
    return () => subscription.remove();
  }, []);
```


# Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide]( https://github.com/expo/expo#contributing).
