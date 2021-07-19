const fireAdmin = require('firebase-admin');
const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/storage');
const config = require('./config');

const db = firebase.initializeApp(config.firebaseConfig);

const admin = fireAdmin.initializeApp({
    credential: fireAdmin.credential.cert(config.SERVICE_ACCOUNT_KEY),
    databaseURL:config.DATABASE_URL,
    storageBucket:config.STORAGE_BUCKET
});

module.exports = db, admin;