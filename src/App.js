import React, {useState, useEffect} from 'react';
import {FormControl, Select, MenuItem, Button, AppBar, Toolbar, Typography, Container, CssBaseline, Grid, Paper} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles'
import MediaDevices from 'media-devices'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {

  //listens to audio device changes and will run command to re-set to desired device
  MediaDevices.ondevicechange = () => {
    console.log("audio device changed")
  }

  const [inputValue, setInputValue] = useState('') 
  const [outputValue, setOutputValue] = useState('') 
  const [deviceData, setDeviceData] = useState() 
  const [filteredInputDeviceData, setFilteredInputDeviceData] = useState([])
  const [filteredOutputDeviceData, setFilteredOutputDeviceData] = useState([])
  const [filteredDeviceData, setFilteredDeviceData] = useState({})

  useEffect(appStart, [])
  useEffect(() => {if(deviceData)filterDeviceData()}, [deviceData])
  useEffect(() => {if(inputValue)saveSettings()}, [inputValue])
  useEffect(() => {if(outputValue)saveSettings()}, [outputValue])

  function saveSettings() {
    const settingsObj = {}
    settingsObj.inputValue = inputValue
    settingsObj.outputValue = outputValue
    window.api.send("saveSettings", settingsObj)
    setAudioDevices()
  }

  function getSettings() {
        window.api.send("readSettings")
        window.api.receive("settings", (data) => {  
            setInputValue(data.inputValue)
            setOutputValue(data.outputValue)
        })
  }

  function getDeviceData() {
    window.api.send("readDeviceData")
    window.api.receive("deviceData", (data) => {
      setDeviceData(data)
    })
  }

  function filterDeviceData() {
    let tempInputDevData = []
    let tempOutputDevData = []
    let tempDeviceDataObj = {}

    for (let i = 0; i < deviceData.length; i++) {
      if (deviceData[i]["Type"] === "Device"){
        if (deviceData[i]["Direction"] === "Capture") {
          tempDeviceDataObj.inputDeviceName = deviceData[i]["Name"]
          tempDeviceDataObj.cmdInputDeviceName = deviceData[i]["Command-Line Friendly ID"]
          tempInputDevData.push(tempDeviceDataObj)
          tempDeviceDataObj = {}
        } 
        else if (deviceData[i]["Direction"] === "Render") {
          tempDeviceDataObj.outputDeviceName = deviceData[i]["Name"]
          tempDeviceDataObj.cmdOutputDeviceName = deviceData[i]["Command-Line Friendly ID"]
          tempOutputDevData.push(tempDeviceDataObj)
          tempDeviceDataObj = {}
        } 
      } 
    }
    setFilteredInputDeviceData(tempInputDevData)
    setFilteredOutputDeviceData(tempOutputDevData)
  }

  function closeWindow() {
    window.api.send("closeWindow")
  }

  function setAudioDevices() {
    window.api.send("setInputDevice", inputValue)
    window.api.send("setOutputDevice", outputValue)
  }

  function handleInputValue(e) {
    setInputValue(e.target.value)
  }

  function handleOutputValue(e) {
    setOutputValue(e.target.value)
  }

  function appStart() {
    getDeviceData()
    getSettings()
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <AppBar sx={"-webkit-user-select: none; -webkit-app-region: drag;"} position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
              Audio Device Maintainer  
            </Typography>
            
            <Button sx={ "-webkit-app-region: no-drag;"} onClick={setAudioDevices}>Set Devices</Button>
            <Button sx={"margin-right: -20; -webkit-app-region: no-drag;"} onClick={closeWindow}>&#10006;</Button>
          </Toolbar>
        </AppBar>
        <CssBaseline />

        <Container darkTheme>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Paper sx={ "padding: 20px; margin: 20px" }>
                Input Device
                <FormControl fullWidth>
                  <Select id="input-device-selection" value={inputValue} onChange={handleInputValue}>
                  
                    {filteredInputDeviceData.map(device => (
                      <MenuItem value={device.cmdInputDeviceName}>{device.inputDeviceName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Paper sx={ "padding: 20px; margin: 20px" }>
                Output Device
                <FormControl fullWidth>
                  <Select  id="output-device-selection" value={outputValue} onChange={handleOutputValue}>
                  
                    {filteredOutputDeviceData.map(device => (
                        <MenuItem value={device.cmdOutputDeviceName}>{device.outputDeviceName}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;