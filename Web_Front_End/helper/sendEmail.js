const nodemailer = require("nodemailer");
const { getUser, addEmail } = require('../firebaseHandle');

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'eqmonitoring.14@gmail.com', // Thay thế bằng email người gửi
    pass: 'sypd pler luvi pbdm' // thay bằng Mật khẩu email ứng dụng của bạn 
  }
});

// Function to send email notification
async function sendEmailNotification(user_id, sensorType, sensorValue) {
  const user = await getUser(user_id);
  const email = user.email;
  let emailContent = "";
  let subject = "";
  let backgroundColor = "#DFF5FF"; 
  //Dust
  if (sensorType === "Dust") {
      subject = "Dust Level Alert";
      backgroundColor = "#F0F0F0";
      if (sensorValue > 150.5 && sensorValue <= 250.5) {
          emailContent = `<p style="font-size: 16px; color: #3D3B40;"><b>The dust level is ${sensorValue}. Please take necessary actions:</b></p>
                        <ul>
                          <li>Avoid outdoor exercise</li>
                          <li>Close your windows to avoid dirty outdoor air</li>
                          <li>Wear a mask outdoors</li>
                          <li>Run an air purifier</li>
                        </ul>`;
     
  } else if (sensorValue > 250.5) {         
          emailContent = `<p style="font-size: 16px; color: #3D3B40;"><b>The dust level is ${sensorValue}. Please take necessary actions:</b></p>
                          <p>Extremely high dust levels can be harmful to your health. Consider staying indoors and using air purifiers to improve indoor air quality.</p>`;  }
  }
  //Humidity 
  else if (sensorType === "Humidity") {
     backgroundColor = "#DFF5FF";
     subject = "Humidity Level Alert";
      if (sensorValue > 80 && sensorValue <= 90) {
        emailContent = `<p style="font-size: 16px; color: #3D3B40;"><b>The humidity level is ${sensorValue}. Please take necessary actions:</b></p>
                        <ul>
                          <li>Use a dehumidifier to reduce indoor humidity</li>
                          <li>Ensure good ventilation in your home</li>
                          <li>Use exhaust fans in bathrooms and kitchens</li>
                          <li>Keep indoor plants to absorb moisture</li>
                        </ul>`;
      } else if (sensorValue > 90) {
        emailContent = `<p style="font-size: 16px; color: #3D3B40;"><b>The humidity level is ${sensorValue}. Please take necessary actions:</b></p>
                        <p>High humidity levels can promote mold and mildew growth, leading to health problems. Please ensure proper ventilation and use dehumidifiers if necessary.</p>`;
      }
  } 
  //Temperature 
  else if (sensorType === "Temperature") {
        subject = "Temperature Alert";
        backgroundColor = "#fff3cd";
    if (sensorValue > 37 && sensorValue <= 40) {
        emailContent = `<p style="font-size: 16px; color: #3D3B40; "><b>The temperature is ${sensorValue}. Please take necessary actions:</b></p>
                        <ul>
                          <li>Stay hydrated by drinking plenty of water</li>
                          <li>Avoid prolonged exposure to the sun</li>
                          <li>Use fans or air conditioning to cool down</li>
                          <li>Wear lightweight, breathable clothing</li>
                        </ul>`;
    } else if (sensorValue > 40) {
        emailContent = `<p style="font-size: 16px; color: #3D3B40;"><b>The temperature is ${sensorValue}. Please take necessary actions:</b></p>
                        <p>Extreme heat can be dangerous, leading to heat-related illnesses. Stay indoors in air-conditioned spaces if possible</p>`;
    }
  } 

  //MQ135
  else if (sensorType === "CO2") {
    subject = "Air quality Level Alert";  
    backgroundColor = "#CDFCF6";
    if (sensorValue > 200 && sensorValue < 300) {
      emailContent = `<p style="font-size: 16px; color: #3D3B40;"><b>The gas level is ${sensorValue}. Please take necessary actions:</b></p>
                      <ul>
                        <li>Make sure there's enough fresh air circulation indoors</li>
                        <li>Take breaks outside regularly for a breath of fresh air</li>
                        <li>Consider using indoor plants to help clean the air</li>
                        <li>Use air purifiers with HEPA filters if possible</li>
                      </ul>`;        
    } else if (sensorValue >= 300) {
      emailContent = `<p style="font-size: 16px; color: #3D3B40;"><b>The gas level is ${sensorValue}. Please take necessary actions:</b></p>
                      <p>High gas levels can cause drowsiness, headaches, can make you feel tired.Try to bring in more fresh air by opening windows or using fans, and think about using air purifiers to clean the air.</p>`;
    }
  }
  
  const mailOptions = {
    from: "eqmonitoring.14@gmail.com", 
    to: email,   
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 650px; margin: 0 auto; background-color: ${backgroundColor};">
        <h1 style="color: #007bff;">Environmental Monitoring System Alert</h1>
        <hr style="border: 1px solid #007bff;" />
        ${emailContent}
        <p style="color: #888; font-size: 14px;">This is an automated message, please do not reply.</p>
      </div>
    `
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
  if (dust > 150.5 && dust <= 250.5 && !alertStatus.dust) {
    await sendEmailNotification(user_id, "Dust", dust);
    alertStatus.dust = true; // Đánh dấu đã gửi cảnh báo
  } else if (dust > 250.5) {
    await sendEmailNotification(user_id, "Dust", dust);
    alertStatus.dust = false;
  }
  if (humidity > 80 && humidity <= 90 && !alertStatus.humidity) {
    await sendEmailNotification(user_id, "Humidity", humidity);
    alertStatus.humidity = true;
  } else if (humidity > 90) {
    await sendEmailNotification(user_id, "Humidity", humidity);
    alertStatus.humidity = false;
  }
  if (temperature > 37 && temperature <= 40 && !alertStatus.temperature) {
    await sendEmailNotification(user_id, "Temperature", temperature);
    alertStatus.temperature = true;
  } else if (temperature > 40) {
    await sendEmailNotification(user_id, "Temperature", temperature);
    alertStatus.temperature = false;
  }
  if (ppm >= 200 && ppm <= 300 && !alertStatus.ppm) {
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
