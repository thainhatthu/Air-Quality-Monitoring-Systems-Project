// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { get, ref, onValue, getDatabase } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
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
export const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

// export const refdb = ref(db, 'data/215226482152149021522077/');
const refanalysis = (date)=>{
  const formatdate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
  return ref(db, `analysis/215226482152149021522077/${formatdate}`);
}

export const refdb = ref(db, 'currentdata/215226482152149021522077/');

export const onValueData = (callback)=>{
  onValue(refdb, (snapshot) => {
    callback(snapshot.val());
  });
} 
export const getAnalysis = async(date)=>{
  const snapshot = await get(refanalysis(date));
  return snapshot.val();
}