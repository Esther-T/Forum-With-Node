const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
var unirest = require("unirest");
const mongoose = require("mongoose")

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
const port  = 6001;

mongoose.connect("mongodb://localhost:27017/forumDB", { useUnifiedTopology: true });
//schema
const passwordSchema = new mongoose.Schema({
  firstname = String,
  lastname = String
  username: String,
  pass: String,
});

const Password = mongoose.model("Password", passwordSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html"); 
})

app.post("/log-in", function (req, res){
  const username_login = req.body.username;
  const password_login = req.body.password;
  const isfound = false;
  console.log(username_login);
  console.log(password_login);
  Password.find(function(err, usernames){
	  if(err)
	  {
		console.log(err);
	  }
	  else
	  {
		usernames.forEach(function(username_db){
			console.log(username_db.username);
			if(username_login == username_db.username)
			{
				if(password_login == username_db.password)
				{
					console.log("Access approved");
					isfound = true;
				}
			}
		});
	  }
	  
	  if(!isfound)
	  {
		console.log("Access denied!");
	  }
	  
	});

	
});

app.post("/sign-up", function (req, res){
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmpassword;
  console.log(firstname_login);
  console.log(lastname_login);
  console.log(username_login);
  console.log(password_login);
  console.log(confirmPassword);
  const entry = new Password({
  firstName: firstname_login,
  lastName: lastname_login,
  username: username_login,
  password: password_login
});
entry.save(); 
  
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
  });
