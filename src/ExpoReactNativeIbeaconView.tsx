import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoReactNativeIbeaconViewProps } from './ExpoReactNativeIbeacon.types';

const NativeView: React.ComponentType<ExpoReactNativeIbeaconViewProps> =
  requireNativeView('ExpoReactNativeIbeacon');

export default function ExpoReactNativeIbeaconView(props: ExpoReactNativeIbeaconViewProps) {
  return <NativeView {...props} />;
}
