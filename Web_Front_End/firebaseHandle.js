const { initializeApp } = require("firebase/app");
const { getDatabase, set, ref } = require ("firebase/database");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsl-_wFrCd_k8lOqYqhSv_dHYOizH2dLo",
  authDomain: "air-quality-monitoring-ad34e.firebaseapp.com",
  projectId: "air-quality-monitoring-ad34e",
  storageBucket: "air-quality-monitoring-ad34e.appspot.com",
  messagingSenderId: "706120329495",
  appId: "1:706120329495:web:e69047f006c727b318af52",
  databaseURL: "https://air-quality-monitoring-ad34e-default-rtdb.asia-southeast1.firebasedatabase.app"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//Real-time database
const database = getDatabase();
function writeData({temperature, humidity, dust, ppm}) {
  set(ref(database, 'data/'), {
    temperature: temperature,
    humidity: humidity,
    dust: dust,
    ppm: ppm,
  });
}

module.exports = {
  database: database,
  writeData: writeData
}