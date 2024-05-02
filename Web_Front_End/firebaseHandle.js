const { initializeApp } = require("firebase/app");
const { getDatabase, update, set,get, ref, query, equalTo } = require ("firebase/database");


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
const database = getDatabase(app);
function writeData(data, user_id) {//{temperature, humidity, dust, ppm}
  const db = getDatabase();
  const updates = {};
  const time = new Date(new Date().getTime());
  updates[`/data/${user_id}/`+time] = data;
  return update(ref(db), updates);
  // const refData = ref(database, 'data/');

  // set(ref(database, 'data/'), {
  //   temperature: temperature,
  //   humidity: humidity,
  //   dust: dust,
  //   ppm: ppm,
  // });
}

const checkUser = async(user_id)=>{
  const db = getDatabase();
  const userRef =  ref(db,`users/${user_id}`); 
  const snapshot = await get(userRef)
  
  if (snapshot.exists()) {
    console.log(snapshot.val());
    return snapshot.val();
  } else {
    console.log("No data available");
    return false;
  }
}
module.exports = {
  database: database,
  writeData: writeData,
  checkUser: checkUser
}