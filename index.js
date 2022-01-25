/*
cocopods dependencies error
https://stackoverflow.com/questions/65403551/pod-install-failed-on-macos-big-sur/65404796#65404796

sudo arch -x86_64 gem install ffi
arch -x86_64 pod install
*/

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
