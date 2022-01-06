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

app.get("/findPatient", (request, response) => {
  response.sendFile(__dirname + "/views/findPatient.html");
});

app.get("/newVisit", (request, response) => {
  response.sendFile(__dirname + "/views/newVisit.html");
});

app.get("/moh", (request, response) => {
  response.sendFile(__dirname + "/views/sendToMoh.html");
});

app.get("/selfService", (request, response) => {
  response.sendFile(__dirname + "/views/registerSelfService.html");
});

app.get("/bp", (request, response) => {
  response.sendFile(__dirname + "/views/bpcard.html");
});

app.get("/desk", (request, response) => {
  response.sendFile(__dirname + "/views/desk.html");
});

app.post("/test", (request, response) => {
  console.log(request)
});

app.get("/test", (request, response) => {
  response.sendFile(__dirname + "/views/test.html");
});
