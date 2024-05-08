const nodemailer = require("nodemailer");
const { getUser, addEmail } = require('../firebaseHandle');
// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'eqmonitoring.14@gmail.com', // Thay thế bằng email người gửi
    pass: 'rjlq hdgj ydht cikn'// thay bằng Mật khẩu email ứng dụng của bạn 
  }
});

// Function to send email notification
async function sendEmailNotification(user_id, sensorType, sensorValue) {
  const user = await getUser(user_id);
  const email = user.email;
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
    from: "eqmonitoring.14@gmail.com",  //ví dụ "abcd@gmail.com"
    to: email,   //ví dụ "xyz@gmail.com"
    subject: subject,
    text: emailContent
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      addEmail(user_id, "", false)
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
  const user = await getUser(user_id);
  if(!user.sendMail)
    return;
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
