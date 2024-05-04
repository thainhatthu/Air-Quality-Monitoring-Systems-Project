const nodemailer = require("nodemailer");
const {getEmail} = require('../firebaseHandle');
// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'hieu030103@gmail.com', // Thay thế bằng email người gửi
    pass: 'jxla zanq ajsq zzds'// thay bằng Mật khẩu email ứng dụng của bạn 
  }
});


// Function to send email notification
async function sendEmailNotification(user_id, sensorType, sensorValue) {
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
  const email = await getEmail(user_id);
  const mailOptions = {
    from: "hieu030103@gmail.com",  //ví dụ "abcd@gmail.com"
    to: email,   //ví dụ "xyz@gmail.com"
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

//Check value
async function checkToSendMail(user_id, data){
  const {dust,humidity, temperature, ppm} = data;
  console.log(data);
  if (dust > 50 && dust < 100 && !alertStatus.dust) {
    await sendEmailNotification(user_id, "Dust", dust);
    alertStatus.dust = true; // Đánh dấu đã gửi cảnh báo
  } else if (dust >= 100) {
    await sendEmailNotification(user_id, "Dust", dust);
    alertStatus.dust = false;
  }
  if (humidity >= 80 && humidity <= 90 && !alertStatus.humidity) {
    await sendEmailNotification(user_id, "Humidity", humidity);
    alertStatus.humidity = true;
  } else if (humidity > 90) {
    await sendEmailNotification(user_id, "Humidity", humidity);
    alertStatus.humidity = false;
  }
  if (temperature > 38 && temperature < 40 && !alertStatus.temperature) {
    await sendEmailNotification(user_id, "Temperature", temperature);
    alertStatus.temperature = true;
  } else if (temperature > 39) {
    await sendEmailNotification(user_id, "Temperature", temperature);
    alertStatus.temperature = false;
  }
  if (ppm > 200 && ppm < 300 && !alertStatus.ppm) {
    await sendEmailNotification(user_id, "CO2", ppm);
    alertStatus.ppm = true;
  } else if (ppm > 300) {
    await sendEmailNotification(user_id, "CO2", ppm);
    alertStatus.ppm = false;
  }
}

module.exports = {
  checkToSendMail: checkToSendMail,
}
// // Listen for changes in 'dust' value
// const dustRef = ref(database, "currentdata/215226482152149021522077/dust");
// onValue(dustRef, (snapshot) => {
//   const dustValue = snapshot.val();
//   console.log("Dust:", dustValue);
//   if (dustValue > 50 && dustValue < 100 && !alertStatus.dust) {
//     sendEmailNotification("Dust", dustValue);
//     alertStatus.dust = true; // Đánh dấu đã gửi cảnh báo
//   } else if (dustValue >= 100) {
//     sendEmailNotification("Dust", dustValue);
//     alertStatus.dust = false;
//   }
// });

// // Listen for changes in 'humidity' value
// const humidityRef = ref(database, "currentdata/215226482152149021522077/humidity");
// onValue(humidityRef, (snapshot) => {
//   const humidityValue = snapshot.val();
//   console.log("Humidity value:", humidityValue);
//   if (humidityValue >= 80 && humidityValue <= 90 && !alertStatus.humidity) {
//     sendEmailNotification("Humidity", humidityValue);
//     alertStatus.humidity = true;
//   } else if (humidityValue > 90) {
//     sendEmailNotification("Humidity", humidityValue);
//     alertStatus.humidity = false;
//   }
// });

// // Listen for changes in 'temperature' value
// const temperatureRef = ref(database, "currentdata/215226482152149021522077/temperature");
// onValue(temperatureRef, (snapshot) => {
//   const temperatureValue = snapshot.val();
//   console.log("Temperature value:", temperatureValue);
//   if (temperatureValue > 38 && temperatureValue < 40 && !alertStatus.temperature) {
//     sendEmailNotification("Temperature", temperatureValue);
//     alertStatus.temperature = true;
//   } else if (temperatureValue > 39) {
//     sendEmailNotification("Temperature", temperatureValue);
//     alertStatus.temperature = false;
//   }
// });

// // Listen for changes in 'ppm' value
// const ppmRef = ref(database, "currentdata/215226482152149021522077/ppm");
// onValue(ppmRef, (snapshot) => {
//   const ppmValue = snapshot.val();
//   console.log("PPM value:", ppmValue);
//   if (ppmValue > 200 && ppmValue < 300 && !alertStatus.ppm) {
//     sendEmailNotification("CO2", ppmValue);
//     alertStatus.ppm = true;
//   } else if (ppmValue > 300) {
//     sendEmailNotification("CO2", ppmValue);
//     alertStatus.ppm = false;
//   }
// });