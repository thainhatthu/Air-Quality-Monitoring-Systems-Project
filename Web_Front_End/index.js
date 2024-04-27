const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));


app.get("/Dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
