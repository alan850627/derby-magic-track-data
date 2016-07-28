const firebase = require('firebase')
const path = require('path')
const SerialPort = require('serialport')

const app = firebase.initializeApp({
  // TODO: Setup service account for this app.
  // serviceAccount: path.join(__dirname, '..', 'auth', 'firebase.json'),
  databaseURL: 'https://thunderboard-raceops.firebaseio.com',
})

var parseStrData = function(str) {
  if (!str.includes('=')) {
    return
  }
  console.log(str)
}

const db = app.database()

// list and store serial ports
// SerialPort.list((err, ports) => {
//   var myPorts = []
//   ports.forEach((port) => {
//     console.log('Port Name: ' + port.comName)
//     myPorts.push(port)
//   })
//
//   var myPort = new SerialPort(myPorts[0].comName, { // Only supports Windows for now.
//     // parser: SerialPort.parsers.byteLength(1),
//     baudRate: 19200,
//   })
//
//   myPort.on('open', () => {
//     console.log('port open. Baudrate: ' + myPort.options.baudRate)
//   })
//
//   myPort.on('data', (data) => {
//     let str = data.toString()
//     console.log(str)
//     parseStrData(str)
//   })
// })
//

var data1 = new Buffer([0x32, 0x3d, 0x35, 0x2e, 0x30, 0x39, 0x32, 0x30, 0x21, 0x20])
var data2 = new Buffer([0x31, 0x3d, 0x35, 0x2e, 0x33, 0x36, 0x37, 0x36, 0x22, 0x20])
var data3 = new Buffer([0x33, 0x3d, 0x35, 0x2e, 0x37, 0x31, 0x38, 0x38, 0x23, 0x20])
var data4 = new Buffer([0x34, 0x3d, 0x35, 0x2e, 0x39, 0x36, 0x33, 0x33, 0x24, 0x20, 0x0d, 0x0a])

parseStrData(data1.toString())
