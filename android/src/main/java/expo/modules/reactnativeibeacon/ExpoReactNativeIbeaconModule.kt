package expo.modules.reactnativeibeacon

import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

data class Beacon(val distance: Float)

class ExpoReactNativeIbeaconModule : Module() {
  override fun definition() = ModuleDefinition {
    
    Name("ExpoReactNativeIbeacon")

    Events("onBeaconsDetected")
    Events("onEnterRegion")
    Events("onExitRegion")
    Events("onBluetoothStateChanged")
    Events("onDetermineState")

    Function("requestAlwaysAuthorization") {
      val beacons: Array<Beacon> = arrayOf(
        Beacon(1.2F)
      )
      //this@ExpoReactNativeIbeaconModule.sendEvent("onBeaconsDetected", bundleOf("beacons" to null))
      return@Function "system"
    }

    Function("startScanning") { 
      return@Function "startScanning"
    }
  }

}
