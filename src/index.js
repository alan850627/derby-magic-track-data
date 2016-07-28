const firebase = require('firebase')
const path = require('path')
const SerialPort = require('serialport')

const app = firebase.initializeApp({
  // TODO: Setup service account for this app.
  // serviceAccount: path.join(__dirname, '..', 'auth', 'firebase.json'),
  databaseURL: 'https://thunderboard-raceops.firebaseio.com',
})

const db = app.database()
const NUMBER_OF_LANES = 4

// This object is what is eventually sent to firebase. SerialPort will populate this object as it gets data.
var result = {}

/**
 * Parses the raw data and puts it in the object
 *	2=5.0920! => {..., 2: 5.0920, ... }
 * @param   str [Raw usb data converted into string]
 * @param   obj [Object to be sent to firebase]
 * @return  obj
 */
parseStrData = function(str, obj = {}) {
  if (!str.includes('=')) {
    return obj
  }
  let split = str.split('=')
  obj[split[0]] = parseFloat(split[1].substring(0, 6))
  return obj
}

/**
 * Lists the available ports and waits for data
 */
SerialPort.list((err, ports) => {
  var myPorts = []
  ports.forEach((port) => {
    console.log('Port Name: ' + port.comName)
    myPorts.push(port)
  })

  var myPort = new SerialPort(myPorts[0].comName, { // Only supports Windows for now.
    baudRate: 19200,
  })

  myPort.on('open', () => {
    console.log('port open. Baudrate: ' + myPort.options.baudRate)
  })

  myPort.on('data', (data) => {
    let str = data.toString()
    console.log(str)
    parseStrData(str, result)
  })
})
