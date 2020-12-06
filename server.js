const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
var unirest = require("unirest");
const mongoose = require("mongoose")

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public")); // this is to use the static local files that we have like css
const port  = 6001;

mongoose.connect("mongodb://localhost:27017/forumDB", { useUnifiedTopology: true });
//schema
const passwordSchema = new mongoose.Schema({
  username: String,
  password: String
});


const Password = mongoose.model("Password", passwordSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html"); //send html file
})

app.post("/log-in", function (req, res){
  const username = req.body.username;
  const password = req.body.password;
  console.log(username);
  console.log(password);

});
app.post("/sign-up", function (req, res){
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmpassword;
  console.log(firstname);
  console.log(lastname);
  console.log(username);
  console.log(password);
  console.log(confirmPassword);
});
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
  });
