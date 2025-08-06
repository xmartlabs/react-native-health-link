# Installation Guide

First, you need to add the necessary dependencies using `yarn` or `npm`:

yarn:

```sh
yarn add react-native-health
yarn add react-native-health-connect
yarn add react-native-health-link
```

npm:

```sh
npm install react-native-health
npm install react-native-health-connect
npm install react-native-health-link
```

### ios

Set up react-native-health following this instructions:

1. Install pods:

```
cd ios && pod install
```

2. Update the ios/\<Project Name\>/info.plist file in your project:

```
<key>NSHealthShareUsageDescription</key>
<string>Read and understand health data.</string>
<key>NSHealthUpdateUsageDescription</key>
<string>Share workout data with other apps.</string>
<!-- Below is only required if requesting clinical health data -->
<key>NSHealthClinicalHealthRecordsShareUsageDescription</key>
<string>Read and understand clinical health data.</string>
```

3. To add Healthkit support to your application's Capabilities:

- Open the ios/ folder of your project in Xcode
- Select the project name in the left sidebar
- In the main view select '+ Capability' and double click 'HealthKit'
- To enable access to clinical data types, check the Clinical Health Records box.

#### Expo installation

> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.dev/workflow/customizing/).

First install the package with yarn, npm, or [`npx expo install`](https://docs.expo.dev/more/expo-cli/#installation).

```sh
expo install react-native-health
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": ["react-native-health"]
  }
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.dev/workflow/customizing/) guide.

##### API

The plugin provides props for extra customization. Every time you change the props or plugins, you'll need to rebuild (and `prebuild`) the native app. If no extra properties are added, defaults will be used.

- `healthSharePermission` (_string_): Sets the iOS `NSHealthShareUsageDescription` permission message to the `Info.plist`. Defaults to `Allow $(PRODUCT_NAME) to check health info`.
- `healthUpdatePermission` (_string_): Sets the iOS `NSHealthUpdateUsageDescription` permission message to the `Info.plist`. Defaults to `Allow $(PRODUCT_NAME) to update health info`.
- `isClinicalDataEnabled` (_boolean_): Adds `health-records` to the `com.apple.developer.healthkit.access` entitlement in the iOS project. Defaults to false.
- `healthClinicalDescription` (_string_): Sets the iOS `NSHealthClinicalHealthRecordsShareUsageDescription` permission message to the `Info.plist`. Defaults to `Allow $(PRODUCT_NAME) to check health info`.

`app.config.js`

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-health",
        {
          "isClinicalDataEnabled": true,
          "healthSharePermission": "Custom health share permission",
          "healthUpdatePermission": "Custom health update permission",
          "healthClinicalDescription": "Custom health share permission for clinical data"
        }
      ]
    ]
  }
}
```

##### Background Processing

Background processing is not currently supported by this plugin.

##### Capabilities

This plugin will enable the iOS `com.apple.developer.healthkit` entitlement, but in order to sync this with the bundle identifier' production capabilities you'll need to do one of two things:

- Automatic: Build the app with [EAS build](https://docs.expo.io/build/introduction/)
- Manual: Visit [Apple developer portal](https://developer.apple.com/account/resources/identifiers/list) and enable the HealthKit capability for your bundle identifier before building for production. This can also be done via Xcode.

More information on react-native-health's [official GitHub page](https://github.com/agencyenterprise/react-native-health).

### Android

#### Requeriments for react-native-health-connect

Make sure you have React Native version 0.71 or higher with the latest patch installed to use v2 of React Native Health Connect.

- [Health Connect](https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata&hl=en&gl=US) needs to be installed on the user's device. Starting from Android 14 (Upside Down Cake), Health Connect is part of the Android Framework. Read more [here](https://developer.android.com/health-and-fitness/guides/health-connect/develop/get-started#step-1).
- Health Connect API requires minSdkVersion=26 (Android Oreo / 8.0).
- If you are planning to release your app on Google Play, you will need to submit a [declaration form](https://docs.google.com/forms/d/1LFjbq1MOCZySpP5eIVkoyzXTanpcGTYQH26lKcrQUJo/viewform?edit_requested=true). Approval can take up to 7 days.
  Approval does not grant you immediate access to Health Connect. A whitelist must propagate to the Health Connect servers, which take an additional 5-7 business days. The whitelist is updated every Monday according to Google Fit AHP support.

#### Setup

```diff
package com.healthconnectexample

+ import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
+ import dev.matinzd.healthconnect.permissions.HealthConnectPermissionDelegate

class MainActivity : ReactActivity() {
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "HealthConnectExample"

+ override fun onCreate(savedInstanceState: Bundle?) {
+   super.onCreate(savedInstanceState)
+   // In order to handle permission contract results, we need to set the permission delegate.
+   HealthConnectPermissionDelegate.setPermissionDelegate(this)
+ }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}

```

You also need to setup permissions in your `AndroidManifest.xml` file. For more information, check [here](https://matinzd.github.io/react-native-health-connect/docs/permissions).


#### Expo installation

This package cannot be used in the [Expo Go](https://expo.io/client) app, but it can be used with custom managed apps.
Just add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

First install the package with yarn, npm, or [`expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
npm install expo-health-connect
npm install expo-build-properties --save-dev
```

Then add the prebuild [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": ["expo-health-connect"]
  }
}
```

- Edit your app.json again and add this

```json
{
  "expo": {
    ...
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "compileSdkVersion": 34,
            "targetSdkVersion": 34,
            "minSdkVersion": 26
          },
        }
      ]
    ]
   ...
  }
}
```

Then rebuild the native app:

- Run `expo prebuild`
  - This will apply the config plugin using [prebuilding](https://expo.fyi/prebuilding).
- Rebuild the app
  - `yarn android` -- Build on Android.

> If the project doesn't build correctly with `yarn android`, please file an issue and try setting the project up manually.

Finally create a new EAS development build

`eas build --profile development --platform android`


More information on react-native-health-connects's [official GitHub page](https://github.com/matinzd/react-native-health-connect).
