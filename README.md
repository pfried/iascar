iasCar
======

[![Build Status](https://magnum.travis-ci.com/pfried/iascar.svg?token=MViZPXDXmnKqVqrN56zX&branch=chrome)](https://magnum.travis-ci.com/pfried/iascar)

IAS Studienarbeit Bluetooth Car Control
---------------------------------------

#Installation

Install npm
Install npm from npmjs.org

Go to the folder and run the npm install command

Install bower, cordova and grunt for convenience in global space
sudo npm install -g bower cordova grunt

## Installation Cordova

Cordova should gets installed by the

Note: All Cordova commands must be executed in the bluetoothcar cwd, since this is the bluetooth folder. Run `grunt buildCordovaClient` befor issung any cordova commands.

### Installation Platforms

Add platforms needed:

   * platform add android
   * platform add windows8

#### IOS

Please make sure to have XCode Version 5.1.1 on you machine. You will also need a developer account from Apple to run iOS applications on a real device.

For console.log debugging install the right plugin, otherwise XCode doesnt log out debug messages:
`cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-console.git`

   * platform add ios

### Installation of Cordova Bluetooth Plugin

cordova plugin add https://github.com/randdusing/BluetoothLE