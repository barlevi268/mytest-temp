const express = require("express");
const app = express();

app.use(express.static("public"));


app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
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


const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
