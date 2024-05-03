const { initializeApp } = require("firebase/app");
const { getDatabase, update, set,get, ref, query, equalTo } = require ("firebase/database");
const { formatDate, getRndInteger } = require("./helper/dateHelper");
Number.prototype.round = function(p) {
  p = p || 10;
  return parseFloat( this.toFixed(p) );
};

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
async function writeData(data, user_id, random = false) {//{temperature, humidity, dust, ppm}
  let now;
  if(!random)
    now = new Date();
  else{
    //for fake date
    now = new Date()
    now.setDate(now.getDate() - getRndInteger(0, 30));
  }
    
  const randomHour = getRndInteger(0,24);
  const db = getDatabase();
  // const refAnalysis = ref(db,`/analysis/${user_id}/${formatDate(now)}/${now.getHours()}`);
  const refAnalysis = ref(db,`/analysis/${user_id}/${formatDate(now)}/${randomHour}`);
  let formatData = {};
  const snapshot = await get(refAnalysis);
  if(snapshot.exists()){
    const savedData = snapshot.val();
    Object.keys(data).forEach(key => {
      formatData[key] = parseFloat((savedData[key]*savedData["sample"] + data[key])/ (savedData["sample"] + 1)).round(2);;
    });
    formatData["sample"] = savedData["sample"] + 1;
  }else{
    formatData = data;
    formatData["sample"] = 1;
  }
  
  const updates = {};
  updates[`/currentdata/${user_id}/`] = data;
  // updates[`/analysis/${user_id}/${formatDate(now)}/${now.getHours()}`] = formatData;
  updates[`/analysis/${user_id}/${formatDate(now)}/${randomHour}`] = formatData;
  return update(ref(db), updates);
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