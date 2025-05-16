import CoreBluetooth
import CoreLocation
import React
import UserNotifications

// Declare the BeaconManager class, which implements interfaces for working with React Native and delegates for monitoring beacons and Bluetooth'
@objc(BeaconManager)
class BeaconManager: NSObject, RCTBridgeModule, CLLocationManagerDelegate, CBCentralManagerDelegate
{

// Module name for React Native
   static func moduleName() -> String {
     return "BeaconManager"
  }

  private var locationManager: CLLocationManager!
  private var beaconRegion: CLBeaconRegion!
  public var bridge: RCTBridge!
  private var centralManager: CBCentralManager!

// Method for sending local notifications
   func sendLocalNotification(with message: String) {
     let content = UNMutableNotificationContent()
     content.title = message // Notification title
     content.body = "This is a region event" // Notification text
     content.sound = .default // Notification sound

let request = UNNotificationRequest(
       identifier: UUID().uuidString, content: content, trigger: nil) // Create a notification request
     UNUserNotificationCenter.current().add(request, withCompletionHandler: nil) // Adding a request to the notification center
  }

// Start scanning beacons with the given UUID
   @objc func startScanning(_ uuid: String, config: NSDictionary) {
     // Request permission to send notifications
     UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) {
       granted, error in

      if granted {
        print("Notifications allowed")
      } else {
        print("Notifications not allowed")
      }
    }
     DispatchQueue.main.async {
       self.locationManager = CLLocationManager() // Initialize CLLocationManager
       self.locationManager.delegate = self // Setting the delegate
       self.locationManager.requestAlwaysAuthorization() // Request for permanent access to geolocation
       
       // Check and set settings for background scanning
       self.locationManager.allowsBackgroundLocationUpdates = true
       self.locationManager.pausesLocationUpdatesAutomatically = false
       
       let uuid = UUID(uuidString: uuid)! // Convert UUID string to UUID
       let beaconConstraint = CLBeaconIdentityConstraint(uuid: uuid) // Create a constraint for the beacon
       self.beaconRegion = CLBeaconRegion(
        beaconIdentityConstraint: beaconConstraint, identifier: "BeaconManagerRegion") // Initialize the beacon region
       self.beaconRegion.notifyOnEntry = true // Notification when entering a region
       self.beaconRegion.notifyOnExit = true // Notification when exiting a region
       
       self.locationManager.startMonitoring(for: self.beaconRegion) // Start monitoring the region
       self.locationManager.startRangingBeacons(satisfying: CLBeaconIdentityConstraint(uuid: uuid)) // Start determining the distance to beacons in the region
     }
   }

    // Stop scanning beacons
   @objc func stopScanning(_ uuid: String) {
     if let beaconRegion = self.beaconRegion {
       let uuid = UUID(uuidString: uuid)!
       self.locationManager.stopMonitoring(for: beaconRegion) // Stop monitoring the region
       self.locationManager.stopRangingBeacons(satisfying: CLBeaconIdentityConstraint(uuid: uuid)) // Stop determining the distance to beacons
       self.beaconRegion = nil // Reset the beacon region
       self.locationManager = nil // Reset CLLocationManager
     }
   }

   // Initialize the Bluetooth manager
   @objc func initializeBluetoothManager() {
     centralManager = CBCentralManager(
       delegate: self, queue: nil, options: [CBCentralManagerOptionShowPowerAlertKey: false])
   }

   // Handle Bluetooth state changes
   func centralManagerDidUpdateState(_ central: CBCentralManager) {
     var msg = ""
     switch central.state {
     case .unknown: msg = "unknown"
     case .resetting: msg = "resetting"
     case .unsupported: msg = "unsupported"
     case .unauthorized: msg = "unauthorized"
     case .poweredOff: msg = "poweredOff"
     case .poweredOn: msg = "poweredOn"
     @unknown default: msg = "unknown"
     }
     RNEventEmitter.emitter.sendEvent(withName: "onBluetoothStateChanged", body: ["state": msg]) // Send Bluetooth state change event to React Native
   }

// Request for permanent access to geolocation
   @objc func requestAlwaysAuthorization(
     _ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock
   ) {
     let locationManager = CLLocationManager()
     locationManager.delegate = self
     locationManager.requestAlwaysAuthorization()
     let status = locationManager.authorizationStatus;
     let statusString = statusToString(status)
     resolve(["status": statusString])
   }

   // Request for access to geolocation when using the application
   @objc func requestWhenInUseAuthorization(
     _ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock
   ) {
     let locationManager = CLLocationManager()
     locationManager.delegate = self
     locationManager.requestWhenInUseAuthorization()
     let status = locationManager.authorizationStatus
     let statusString = statusToString(status)
     resolve(["status": statusString])
   }

   // Get the current geolocation permission status
   @objc func getAuthorizationStatus(
     _ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock
   ) {
     let status = locationManager.authorizationStatus
     resolve(statusToString(status))
   }

// Handling region entry and region exit events
   func locationManager(_ manager: CLLocationManager, didEnterRegion region: CLRegion) {
     if let beaconRegion = region as? CLBeaconRegion {
       //sendLocalNotification(with: "Entered region: \(region.identifier)") // Send a notification about entering a region
       
       RNEventEmitter.emitter.sendEvent(withName: "onEnterRegion", body: ["region": beaconRegion.identifier])
     }
   }

   func locationManager(_ manager: CLLocationManager, didExitRegion region: CLRegion) {
     if let beaconRegion = region as? CLBeaconRegion {
       //sendLocalNotification(with: "Exit region: \(region.identifier)") // Send a notification about leaving the region
       RNEventEmitter.emitter.sendEvent(withName: "onExitRegion", body: ["region": beaconRegion.identifier])
     }
   }

   // Handle detection of beacons in the region
   func locationManager(
     _ manager: CLLocationManager, didRangeBeacons beacons: [CLBeacon], in region: CLBeaconRegion
   ) {
     let beaconArray = beacons.map { beacon -> [String: Any] in
       return [
         "uuid": beacon.uuid.uuidString, // UUID of the beacon
         "major": beacon.major.intValue, // Major beacon value
         "minor": beacon.minor.intValue, // Minor beacon value
         "distance": beacon.accuracy, // Accuracy of the distance to the beacon
         "rssi": beacon.rssi, // Beacon signal strength
       ]
     }
     if beacons.count > 0 {
       let accuracyL = calc(rssi: Double(beacons[0].rssi))
       print("Beacons detected: \(accuracyL)  -  \(beacons[0].accuracy)  - \(proximityToString(beacons[0].proximity))")
     }
     
     RNEventEmitter.emitter.sendEvent(withName: "onBeaconsDetected", body: beaconArray)
   }
  
  func calc(rssi: Double) -> Double {
    if (rssi == 0) {
        return -1.0; // if we cannot determine accuracy, return -1.
      }
    let txPower = -59.0;
    let ratio = rssi*1.0/txPower;
    if (ratio < 1.0) {
        return pow(Double(ratio),10);
    }
    else {
      let accuracy =  (0.89976)*pow(Double(ratio),7.7095) + 0.111;
      return accuracy;
    }
  }

   // Handle geolocation permission changes
   func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
     if #available(iOS 14.0, *) {
       if manager.authorizationStatus == .authorizedAlways
         || manager.authorizationStatus == .authorizedWhenInUse
       {
         locationManager.startMonitoring(for: beaconRegion) // Start monitoring the region
         locationManager.startRangingBeacons(satisfying: CLBeaconIdentityConstraint(uuid: beaconRegion.uuid))
       }
     } else {
       if CLLocationManager.authorizationStatus() == .authorizedAlways
         || CLLocationManager.authorizationStatus() == .authorizedWhenInUse
       {
         locationManager.startMonitoring(for: beaconRegion)
         locationManager.startRangingBeacons(in: beaconRegion)
       }
     }
   }

   //Helper method to convert geolocation permission status to a string
   private func statusToString(_ status: CLAuthorizationStatus) -> String {
     switch status {
     case .notDetermined: return "notDetermined"
     case .restricted: return "restricted"
     case .denied: return "denied"
     case .authorizedAlways: return "authorizedAlways"
     case .authorizedWhenInUse: return "authorizedWhenInUse"
     @unknown default: return "unknown"
     }
   }
  
  private func proximityToString(_ status: CLProximity) -> String {
    switch status {
    case .immediate: return "immediate"
    case .near: return "near"
    case .far: return "far"
    case .unknown: return "unknown"
    @unknown default: return "unknown"
    }
  }
}
