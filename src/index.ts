// Reexport the native module. On web, it will be resolved to ExpoReactNativeIbeaconModule.web.ts
// and on native platforms to ExpoReactNativeIbeaconModule.ts
export { default } from './ExpoReactNativeIbeaconModule';
export { default as ExpoReactNativeIbeaconView } from './ExpoReactNativeIbeaconView';
export * from  './ExpoReactNativeIbeacon.types';
