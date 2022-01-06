const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();


app.use(express.static("public"));
app.use(express.json())
app.use(cookieParser());
app.set('view engine', 'ejs');


app.get("/", (req, res) => {
  res.render('pages/welcome');
});

app.get("/login", (req, res) => {
  res.render('pages/login');
});
app.get("/register", (req, res) => {
  res.render('pages/register');
});

app.get("/profile", (req, res) => {
  res.render('pages/profile');
});

app.get("/newVisit", (req, res) => {
  res.render('pages/new-visit');
});
app.get("*", (req, res) => {
  res.redirect('/');
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  });
