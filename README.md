## [SQLite](https://ionicframework.com/docs/native/sqlite/)

```bash
$ ionic cordova plugin add cordova-sqlite-storage
$ npm install --save @ionic-native/sqlite
```

## [Firebase && Angularfire2](https://github.com/angular/angularfire2/blob/master/docs/ionic/v3.md)

```bash
$ npm install angularfire2 firebase promise-polyfill --save
```

## [Cordova OAuth login](https://firebase.google.com/docs/auth/web/cordova)

```bash
# Plugin to pass application build info (app name, ID, etc) to the OAuth widget.
$ cordova plugin add cordova-plugin-buildinfo --save
# Plugin to handle Universal Links (Android app link redirects)
$ cordova plugin add cordova-universal-links-plugin --save
# Plugin to handle opening secure browser views on iOS/Android mobile devices
$ cordova plugin add cordova-plugin-browsertab --save
# Plugin to handle opening a browser view in older versions of iOS and Android
$ cordova plugin add cordova-plugin-inappbrowser --save
# Plugin to handle deep linking through Custom Scheme for iOS
# Substitute com.firebase.cordova with the iOS bundle ID of your app.
$ cordova plugin add cordova-plugin-customurlscheme --variable \
  URL_SCHEME=com.firebase.cordova --save
```