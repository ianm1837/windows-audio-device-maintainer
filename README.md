# Windows Audio Device Maintainer

## Description
A tool written in react and electron to stop windows from changing your audio device

This need for this tool arose when using VoiceMeeter to route audio in Windows. There is no way to turn of automatic switchin in Windows making it very inconvenient to plug devices in while playing audio or while on a conference call. 

The tool works by using the audio device web api and when it detects a change it immediately changes the device back to the specified device.

This isn't ideal due to the brief change of device, but this is the best workaround that I was able to come up with at the time.

## Installation
This tool is in development and has not been compiled. If you want to use this tool you will have to clone the repository and run with the included npm scripts.

