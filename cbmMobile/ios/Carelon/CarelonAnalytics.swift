//
//  CarelonAnalytics.swift
//  Carelon
//
//  Created by Thukkani, Naveen kumar on 4/16/25.
//

import AEPAssurance
import AEPCore
import AEPEdge
import AEPEdgeBridge
import AEPEdgeIdentity
import AEPLifecycle
import AEPSignal
import AEPUserProfile
import Foundation


class CarelonAnalytics {
  // MARK: Singleton instance
  
  public static let shared = CarelonAnalytics()
  
  private init() {}
  
  // MARK: should be called from application didfinishLaunchingWithOptions
  
  // in App delegate before any other Experience Cloud SDK call.
  // It is meant to define the config file to be used based on the app running mode.
  func setConfig(_ appState: UIApplication.State) {
    guard let appId = Bundle.main.object(forInfoDictionaryKey: "AEPAppId") as? String else {
      fatalError("AEPAppId not set, check info.plist")
    }

    if (appId.hasSuffix("dev")) {
      MobileCore.setLogLevel(.debug)
    }
    MobileCore.configureWith(appId: appId)

    MobileCore.registerExtensions([
      Assurance.self,
      Edge.self,
      AEPEdgeIdentity.Identity.self,
      EdgeBridge.self,
      Lifecycle.self,
      Signal.self,
      UserProfile.self,
    ] ) {
      if (appState != UIApplication.State.background) {
        MobileCore.lifecycleStart(additionalContextData: nil)
      }
    }
  }
}
