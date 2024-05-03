const { initializeApp } = require("firebase/app");

const { getDatabase, update, set,get, ref, query, equalTo, onValue } = require ("firebase/database");
const { formatDate, getRndInteger } = require("./helper/dateHelper");
Number.prototype.round = function(p) {
  p = p || 10;
  return parseFloat( this.toFixed(p) );
};

const nodemailer = require("nodemailer");


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

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'abcd@gmail.com', // Thay thế bằng email người gửi
    pass: 'abc'// thay bằng Mật khẩu email ứng dụng của bạn 
  }
});


// Function to send email notification
function sendEmailNotification(sensorType, sensorValue) {
  let emailContent = "";
  let subject = "";
  if (sensorType === "Dust") {
    emailContent = `The dust level is ${sensorValue}. Please take necessary actions.`;
    subject = "Dust Level Alert";
  } else if (sensorType === "Humidity") {
    emailContent = `The humidity level is ${sensorValue}. Please take necessary actions.`;
    subject = "Humidity Level Alert";
  } else if (sensorType === "Temperature") {
    emailContent = `The temperature is ${sensorValue}. Please take necessary actions.`;
    subject = "Temperature Alert";
  } else if (sensorType === "CO2") {
    emailContent = `The CO2 level is ${sensorValue}. Please take necessary actions.`;
    subject = "CO2 Level Alert";
  }

  const mailOptions = {
    from: mailnguoigui,  //ví dụ "abcd@gmail.com"
    to: mailnguoinhan,   //ví dụ "xyz@gmail.com"
    subject: subject,
    text: emailContent
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

//EMAIL
// Khởi tạo đối tượng để lưu trữ trạng thái cảnh báo cho mỗi giá trị cảm biến
const alertStatus = {
  dust: false,
  humidity: false,
  temperature: false,
  ppm: false
};

// Listen for changes in 'dust' value
const dustRef = ref(database, "currentdata/215226482152149021522077/dust");
onValue(dustRef, (snapshot) => {
  const dustValue = snapshot.val();
  console.log("Dust:", dustValue);
  if (dustValue > 50 && dustValue < 100 && !alertStatus.dust) {
    sendEmailNotification("Dust", dustValue);
    alertStatus.dust = true; // Đánh dấu đã gửi cảnh báo
  } else if (dustValue >= 100) {
    sendEmailNotification("Dust", dustValue);
    alertStatus.dust = false;
  }
});

// Listen for changes in 'humidity' value
const humidityRef = ref(database, "currentdata/215226482152149021522077/humidity");
onValue(humidityRef, (snapshot) => {
  const humidityValue = snapshot.val();
  console.log("Humidity value:", humidityValue);
  if (humidityValue >= 80 && humidityValue <= 90 && !alertStatus.humidity) {
    sendEmailNotification("Humidity", humidityValue);
    alertStatus.humidity = true;
  } else if (humidityValue > 90) {
    sendEmailNotification("Humidity", humidityValue);
    alertStatus.humidity = false;
  }
});

// Listen for changes in 'temperature' value
const temperatureRef = ref(database, "currentdata/215226482152149021522077/temperature");
onValue(temperatureRef, (snapshot) => {
  const temperatureValue = snapshot.val();
  console.log("Temperature value:", temperatureValue);
  if (temperatureValue > 38 && temperatureValue < 40 && !alertStatus.temperature) {
    sendEmailNotification("Temperature", temperatureValue);
    alertStatus.temperature = true;
  } else if (temperatureValue > 39) {
    sendEmailNotification("Temperature", temperatureValue);
    alertStatus.temperature = false;
  }
});

// Listen for changes in 'ppm' value
const ppmRef = ref(database, "currentdata/215226482152149021522077/ppm");
onValue(ppmRef, (snapshot) => {
  const ppmValue = snapshot.val();
  console.log("PPM value:", ppmValue);
  if (ppmValue > 200 && ppmValue < 300 && !alertStatus.ppm) {
    sendEmailNotification("CO2", ppmValue);
    alertStatus.ppm = true;
  } else if (ppmValue > 300) {
    sendEmailNotification("CO2", ppmValue);
    alertStatus.ppm = false;
  }
});

// Function to check user data
async function checkUser(user_id) {
  const db = getDatabase();
  const userRef = ref(db, `users/${user_id}`);
  const snapshot = await get(userRef);
  
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
};