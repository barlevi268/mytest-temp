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
app.get("/pre-registration", (req, res) => {
  res.render('pages/pre-registration');
});

app.get("/profile", (req, res) => {
  res.render('pages/profile');
});
app.get("/submit-test/:testID", (req, res) => {
  res.render('pages/test-submission-form', req.params);
});
app.get("/submit-result/:testID", (req, res) => {
  res.render('pages/submit-results-form', req.params);
});

app.get("/newVisit", (req, res) => {
  res.render('pages/new-visit');
});

app.get("/agent", (req, res) => {
  res.render('pages/agent/agent');
});
app.get("/vouchers", (req, res) => {
  res.render('pages/agent/vouchers');
});

app.get("*", (req, res) => {
  res.redirect('/');
});

app.listen(3000, () => {
  console.info("Server is running on port 3000");
  });
