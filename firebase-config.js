var admin = require("firebase-admin");

var serviceAccount = require("./digidonor-notification-firebase.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://sample-project-e1a84.firebaseio.com"
})

module.exports = admin