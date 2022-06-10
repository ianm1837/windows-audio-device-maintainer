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

  const [inputValue, setInputValue] = useState('') 
  const [outputValue, setOutputValue] = useState('') 
  const [deviceData, setDeviceData] = useState() 
  const [filteredInputDeviceData, setFilteredInputDeviceData] = useState([])
  const [filteredOutputDeviceData, setFilteredOutputDeviceData] = useState([])
  // const [filteredDeviceData, setFilteredDeviceData] = useState({})

  useEffect(appStart, [])
  // eslint-disable-next-line
  useEffect(() => {if(deviceData)filterDeviceData()}, [deviceData])
  // eslint-disable-next-line
  useEffect(() => {if(inputValue || outputValue)saveSettings()}, [inputValue, outputValue])

  useEffect(() => {
    // check if inputValue or outputValue '' 
    if(inputValue && outputValue){
    // iterate over current devices and check if selected devices are present
    let doesCurrentInputExist
    let doesCurrentOutputExist
    // console.log('filteredInputDeviceData', filteredInputDeviceData)

      for (let i = 0;i < filteredInputDeviceData.length; i++){
        // console.log('filteredInputDeviceData[i].cmdInputDeviceName', filteredInputDeviceData[i].cmdInputDeviceName)
        // console.log('inputValue', inputValue)
        if (filteredInputDeviceData[i].cmdInputDeviceName === inputValue) {
          // console.log('filteredInputDeviceData', filteredInputDeviceData[i])
          doesCurrentInputExist = true
        }
      }
      for (let j = 0;j < filteredOutputDeviceData.length; j++){
        if (filteredOutputDeviceData[j].cmdOutputDeviceName === outputValue) {
          // console.log('filteredOutputDeviceData', filteredOutputDeviceData[j])
          doesCurrentOutputExist = true
        }
      }

    // if not change Select to inputValue or outputValue to ''
    // throw windows notification and open main window

    if (!doesCurrentInputExist) {
      setInputValue('')
      window.api.send("inputDeviceMissing")
    }
    if (!doesCurrentOutputExist) {
      setOutputValue('')
      window.api.send("outputDeviceMissing")
    }
    // add double click to open main window to system tray

    }//build it    
    // eslint-disable-next-line
  }, [filteredOutputDeviceData, filteredInputDeviceData])

  //listens to audio device changes and will run command to re-set to desired device
  MediaDevices.ondevicechange = () => {
    console.log("audio device changed")
    if (inputValue && outputValue) {
      saveSettings()
      // call for updated list of devices
      getDeviceData()
    } 
  }

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

    for (let i = 0; i < deviceData.length; i++) {
      if (deviceData[i]["Type"] === "Device"){
        if (deviceData[i]["Direction"] === "Capture") {
          tempInputDevData.push({
            inputDeviceName: deviceData[i]["Name"],
            cmdInputDeviceName: deviceData[i]["Command-Line Friendly ID"]
          })
        } 
        else if (deviceData[i]["Direction"] === "Render") {
          tempOutputDevData.push({
            outputDeviceName: deviceData[i]["Name"],
            cmdOutputDeviceName: deviceData[i]["Command-Line Friendly ID"]
          })
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