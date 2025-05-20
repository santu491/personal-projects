//
//  AppDelegate.swift
//  Carelon
//
//  Created by Thukkani, Naveen kumar on 2/10/25.
//
import Foundation
import UIKit

import React
import UIKit
import React_RCTAppDelegate
import AEPCore
import ReactAppDependencyProvider

@main
class AppDelegate: RCTAppDelegate {
  var reactRoot: RCTRootView?
  var reactLoaded = false
  
  private var appCoverWindow: UIWindow?
  private var appCoverVC: UIViewController?
  
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    moduleName = "Carelon"
    self.dependencyProvider = RCTAppDependencyProvider();
    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]
    // Setup React
    // callback when React loads
    NotificationCenter.default.addObserver(self, selector: #selector(onReactNativeLoaded), name: NSNotification.Name("RCTJavaScriptDidLoadNotification"), object: nil);
    // Setup Notification Center delegate
    UNUserNotificationCenter.current().delegate = self;

    CarelonAnalytics.shared.setConfig(application.applicationState)

    let success = super.application(application, didFinishLaunchingWithOptions: launchOptions)
    
    if let bgVC = UIStoryboard(name: "LaunchScreen", bundle: nil).instantiateInitialViewController() {
      self.backgroundView = bgVC.view
      bgVC.view.frame = UIScreen.main.bounds
      if let reactRoot = self.reactRoot {
        reactRoot.insertSubview(bgVC.view, at: 0)
      }
    }
    return success;
  }
  
  private var backgroundView: UIView?
  
  // Customize the rootview and controller
  override func setRootView(_ rootView: UIView!, toRootViewController rootViewController: UIViewController!) {
    if let reactRootView = rootView as? RCTRootView {
      reactRoot = reactRootView
      // make react view transparent
      reactRootView.backgroundColor = UIColor.clear
      reactRootView.contentView.backgroundColor = UIColor.clear
      
      super.setRootView(rootView, toRootViewController: rootViewController)
      
      reactRootView.loadingViewFadeDelay = 0
      reactRootView.loadingViewFadeDuration = 0
    } else {
      super.setRootView(rootView, toRootViewController: rootViewController)
    }
  }
  
  // Callback for when react is loaded
  @objc func onReactNativeLoaded() {
    guard !reactLoaded else {
      self.backgroundView?.removeFromSuperview();
      return
    }
    reactLoaded = true
  }
  
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }
  
  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
  
}

// MARK: - Lifecycle Handling

extension AppDelegate {

  override func applicationWillEnterForeground(_ application: UIApplication) {
    MobileCore.lifecycleStart(additionalContextData: nil)
  }
  
  override func applicationWillResignActive(_: UIApplication) {
    // add Cover for security
    addCover()
  }

  override func applicationDidEnterBackground(_: UIApplication) {
    MobileCore.lifecyclePause()
  }
  
  override func applicationDidBecomeActive(_: UIApplication) {
    hideCover()
  }
  
  func addCover() {
    hideCover();
    appCoverVC = UIStoryboard(name: "LaunchScreen", bundle: nil).instantiateInitialViewController();
    appCoverWindow = UIWindow(frame: UIScreen.main.bounds);
    guard let existingTopWindow = UIApplication.shared.windows.last,
          let coverWindow = appCoverWindow, let coverVC = appCoverVC else {
      return
    }
    coverWindow.windowLevel = existingTopWindow.windowLevel + 1;
    coverVC.view.frame = coverWindow.bounds;
    coverWindow.rootViewController = coverVC;
    coverWindow.makeKeyAndVisible();
  }
  
  func hideCover() {
    if let coverWindow = appCoverWindow {
      coverWindow.isHidden = true;
      coverWindow.resignKey();
      coverWindow.rootViewController = nil;
      appCoverWindow = nil;
      appCoverVC = nil;
      self.window.makeKeyAndVisible();
    }
  }
}

// MARK: - Link Handling

extension AppDelegate {
  
  override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
    
    // send link to react (might not be initialized but that's ok)
    let handled = RCTLinkingManager.application(app, open: url, options: options)
    return handled
  }
  
  override func application(_ app: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    guard userActivity.activityType == NSUserActivityTypeBrowsingWeb else {
      return true
    }
    // send link to react (might not be initialized but that's ok)
    let handled = RCTLinkingManager.application(app, continue: userActivity, restorationHandler: restorationHandler)
    return handled
  }
}

// MARK: - Push Notifications

extension AppDelegate: UNUserNotificationCenterDelegate {
  
  // MARK: Push Notification Handling
  
  // Required for the notification event. You must call the completion handler (in RN) after handling the remote notification.
  override func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
    RNCPushNotificationIOS.didReceiveRemoteNotification(userInfo, fetchCompletionHandler: completionHandler)
  }
  
  // Notification Pressed
  // Required for localNotification event
  func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
    RNCPushNotificationIOS.didReceive(response)
    completionHandler()
  }
  
  // Called when a notification is delivered to a foreground app.
  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    completionHandler([.sound, .alert, .badge])
  }
  
  // MARK: Push Notification Registration
  
  override func application(_: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    RNCPushNotificationIOS.didRegisterForRemoteNotifications(withDeviceToken: deviceToken)
  }
  
  override func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
    RNCPushNotificationIOS.didFailToRegisterForRemoteNotificationsWithError(error)
  }
}
