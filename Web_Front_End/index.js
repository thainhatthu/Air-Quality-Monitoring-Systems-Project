const express = require('express');
const app = express();
const path = require('path');
const apiHandle = require('./api');
const { requireAuth } = require('./auth');
var cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const firebaseHandler = require('./firebaseHandle');
// Sử dụng các middleware
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({}))
app.use(bodyParser.json());;
// Sử dụng endpoint "/api" để xử lý các yêu cầu API
apiHandle(app);

// Xử lý yêu cầu trang Dashboard
app.get("/", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});
app.get("/Dashboard", requireAuth, async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/Profile", requireAuth,(req, res) => {
  res.sendFile(path.join(__dirname, "public", "users-profile.html"));
});

app.get("/Login", (req, res) => {
  if(req.cookies.user_id){
    firebaseHandler.checkUser(req.cookies.user_id).then((user) => {
      if (user) {
        res.redirect('/Dashboard');
      } else {
        res.sendFile(path.join(__dirname, "public", "pages-login.html"));
      }
    });
  }else
    res.sendFile(path.join(__dirname, "public", "pages-login.html"));
});
app.post("/Login", (req, res) => {
  const user_id = req.body.user_id;
  res.cookie('user_id', user_id);
  firebaseHandler.checkUser(user_id).then((user) => {
    if (user) {
      res.redirect('/Dashboard');
    } else {
      res.redirect('/Login');
    }
  });
});
// Route để phản hồi với tệp JavaScript trong thư mục public/js/main
app.get('/js/main/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'js', 'main', 'main.js'));
});

app.get('/fakedata', (req, res)=>{
  res.sendFile(path.join(__dirname, 'public', 'fake-data.html'));
});
app.get('/logout', (req, res)=>{
  res.clearCookie('user_id');
  res.redirect('/Login');
});
const port = process.env.PORT || 80;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
