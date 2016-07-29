const firebase = require('firebase')
const path = require('path')
const SerialPort = require('serialport')

const app = firebase.initializeApp({
  // Setup service account for this app.
  serviceAccount: path.join(__dirname, '..', 'auth', 'firebase.json'),
  databaseURL: 'https://thunderboard-raceops.firebaseio.com',
})

const db = app.database()
const NUMBER_OF_LANES = 4


var result = {} // This object is what is eventually sent to firebase. SerialPort will populate this object as it gets data.
var ref = null
var trackDataDB = db.ref().child('trackData')

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

  str.split(' ').forEach((data) => { // If multiple datapoints come in at once, it's separated by space.
    if (data.includes('=')) {
      let split = data.split('=')
      obj['Lane' + split[0]] = parseFloat(split[1].substring(0, 6))
    }
  })

  return obj
}

/**
 * Push the data to firebase
 * @param  obj [the result object to push to firebase]
 */
push = function(obj) {
  ref.child('data').update(obj)
}

/**
 * Pushes the results to firebase.
 * If it is ready, push to firebase.
 * @param  obj [object to be checked and to be pushed to firebase]
 * @return {[type]}     [description]
 */
pushResult = function(obj) {
  if (!ref) {
    // First car has finished the race!
    // Wait for 10 seconds if some cars don't arrive.
    // Push a timestamp
    // New firebase reference
    ref = trackDataDB.push()
    let time = {
      timestamp: Date.now(),
    }
    ref.update(time)
  }

  push(obj)

  if (Object.keys(obj).length === NUMBER_OF_LANES) {
    // all the cars finished
    // Reset state
    ref = null
    result = {}
  }
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
    pushResult(result)
  })
})

let obj = {
  'Lane1': Math.random(),
  'Lane2': Math.random(),
  'Lane3': Math.random(),
  'Lane4': Math.random(),
}

pushResult(obj)
