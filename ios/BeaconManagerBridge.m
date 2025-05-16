#import "React/RCTBridgeModule.h"
#import <React/RCTEventEmitter.h>  // Enables event-based communication between native code and React Native

@interface RCT_EXTERN_MODULE(BeaconManager, NSObject)

RCT_EXTERN_METHOD(startScanning:(NSString *)uuid config:(NSDictionary *)config)
RCT_EXTERN_METHOD(stopScanning:(NSString *)uuid)
RCT_EXTERN_METHOD(requestAlwaysAuthorization:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(requestWhenInUseAuthorization:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getAuthorizationStatus:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initializeBluetoothManager)

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end

// Interface declaration for the RNEventEmitter to expose it to React Native
@interface RCT_EXTERN_MODULE(RNEventEmitter, RCTEventEmitter)

RCT_EXTERN_METHOD(supportedEvents)

@end
