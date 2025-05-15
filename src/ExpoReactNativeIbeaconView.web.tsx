import * as React from 'react';

import { ExpoReactNativeIbeaconViewProps } from './ExpoReactNativeIbeacon.types';

export default function ExpoReactNativeIbeaconView(props: ExpoReactNativeIbeaconViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
