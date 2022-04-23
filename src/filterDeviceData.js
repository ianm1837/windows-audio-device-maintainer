  function filterDeviceData() {
    console.log("Inside the filter function: ", deviceData)

    let tempDevData = []

    for (let i = 0; i < deviceData.length; i++) {
      if (deviceData[i]["Type"] == "Device"){
        tempDevData.push(deviceData[i]["Device Name"])
      }
    }

    setFilteredDeviceData(tempDevData)
    console.log("tempDevData", tempDevData)
    console.log("filteredDeviceData", filteredDeviceData)

  }