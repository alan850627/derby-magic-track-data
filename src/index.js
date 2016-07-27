const firebase = require('firebase')
const path = require('path')

const app = firebase.initializeApp({
  // TODO: Setup service account for this app.
  // serviceAccount: path.join(__dirname, '..', 'auth', 'firebase.json'),
  databaseURL: 'https://thunderboard-raceops.firebaseio.com',
})

const db = app.database()
