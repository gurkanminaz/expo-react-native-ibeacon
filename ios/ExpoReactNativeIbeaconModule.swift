import ExpoModulesCore

public class ExpoReactNativeIbeaconModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoReactNativeIbeacon")
      
    Events("onChangeTheme")

    Function("setTheme") { (theme: String) -> Void in
        UserDefaults.standard.set(theme, forKey: "theme")
        sendEvent("onChangeTheme", [
            "theme": theme
        ])
    }
      
    Function("getTheme") { () -> String in
        UserDefaults.standard.string(forKey: "theme") ?? "system"
    }
      
  }
  
  enum Theme: String, Enumerable {
     case light
     case dark
     case system
  }
}
