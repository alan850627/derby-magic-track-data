const firebase = require('firebase')
const path = require('path')
const SerialPort = require('serialport')

const app = firebase.initializeApp({
  // TODO: Setup service account for this app.
  // serviceAccount: path.join(__dirname, '..', 'auth', 'firebase.json'),
  databaseURL: 'https://thunderboard-raceops.firebaseio.com',
})

const db = app.database()

// list and store serial ports
SerialPort.list((err, ports) => {
  var myPorts = []
  ports.forEach((port) => {
    console.log('Port Name: ' + port.comName)
    myPorts.push(port)
  })

  var myPort = new SerialPort(myPorts[0].comName, { // Only supports Windows for now.
    // parser: SerialPort.parsers.byteLength(1),
    baudRate: 19200,
  })

  myPort.on('open', () => {
    console.log('port open. Baudrate: ' + myPort.options.baudRate)
  })

  myPort.on('data', (data) => {
    console.log(data)
  })
})
