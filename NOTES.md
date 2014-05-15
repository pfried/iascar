# Possible Problems during installation

## Missing Path to Dependencies:

Java, Ant, Android

### Solution

Add locations of the dependencies to PATH Variable on Windows

http://stackoverflow.com/questions/22275026/cordova-for-android-an-error-occurred-while-listening-android-targets

## Trying to add a cordova plugin results in error:

`cordova plugin add https://github.com/don/BluetoothSerial.git`
`Fetching plugin "https://github.com/don/BluetoothSerial.git" via git clone`
`Error: Command failed: fatal: could not create work tree dir 'C:\Users\FRIED_~1\AppData\Local\Temp\plugman\git\1400133675629'.: No such file or directory`

### Solution

Create folders (plugman/git but not the number) in the displayed location, then restart the command