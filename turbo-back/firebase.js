const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
// const {getAuth} = require('firebase-admin/auth');

const serviceAccount = require("./creds.json");

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
});

const db = getFirestore();

module.exports = { db };
