const express = require('express');
const app = express();
const path = require('path');
const apiHandle = require('./api');
const firebase = require('./firebaseHandle');

// Sử dụng các middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Sử dụng endpoint "/api" để xử lý các yêu cầu API
apiHandle(app);

// Xử lý yêu cầu trang Dashboard
app.get("/Dashboard", async (req, res) => {
  try {
    // Đọc dữ liệu từ Firebase
    const snapshot = await firebase.readData();
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Gửi dữ liệu đến trang Dashboard (index.html)
      res.sendFile(path.join(__dirname, "public", "index.html"), { data });
    } else {
      console.log("No data available");
      res.status(404).send("No data available");
    }
  } catch (error) {
    console.error('Error getting data from Firebase:', error);
    res.status(500).send("Internal server error");
  }
});

app.get("/Profile", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "users-profile.html"));
});

app.get("/Login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages-login.html"));
});

// Route để phản hồi với tệp JavaScript trong thư mục public/js/main
app.get('/js/main/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'js', 'main', 'main.js'));
});


const port = process.env.PORT || 80;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
