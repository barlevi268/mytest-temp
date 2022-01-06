const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();


app.use(express.static("public"));
app.use(express.json())
app.use(cookieParser());
app.set('view engine', 'ejs');


app.get("/", (req, res) => {
  res.render('index');
});

app.get("/menu", (request, response) => {
  response.sendFile(__dirname + "/views/menu.html");
});

app.get("/newVisit", (request, response) => {
  response.sendFile(__dirname + "/views/newVisit.html");
});

