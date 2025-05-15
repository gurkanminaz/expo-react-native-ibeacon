import { registerWebModule, NativeModule } from 'expo';

import { ExpoReactNativeIbeaconModuleEvents } from './ExpoReactNativeIbeacon.types';

class ExpoReactNativeIbeaconModule extends NativeModule<ExpoReactNativeIbeaconModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoReactNativeIbeaconModule, 'ExpoReactNativeIbeaconModule');
