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

mongoose.connect("mongodb://localhost:27017/forumDB", {useNewUrlParser: true, useUnifiedTopology: true});
//schema
const passwordSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String
});

const Password = mongoose.model("Password", passwordSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html"); 
})

app.get("/comment", function(req, res)
{
	const username = req.query.username_login;
	console.log(username);
    res.render('comment_page', {username: username});
});

app.post("/log-in", function (req, res){
  var username_login = req.body.username;
  var password_login = req.body.password;
  var isfound = false;
  console.log(username_login);
  console.log(password_login);
  Password.find(function(err, usernames){
	  if(err)
	  {
		console.log("You have an error here")
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
					res.redirect("/comment?username_login=" + username_login);
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
  const firstname_login = req.body.firstname;
  const lastname_login = req.body.lastname;
  const username_login = req.body.username;
  const password_login = req.body.password;
  const confirmPassword = req.body.confirmpassword;
  console.log(firstname_login);
  console.log(lastname_login);
  console.log(username_login);
  console.log(password_login);
  //console.log(confirmPassword);
  
  const entry = new Password({
	  firstName: firstname_login,
	  lastName: lastname_login, 
	  username: username_login,
	  password: confirmPassword
	});

  Password.insertMany(entry, function(err){
          if(err)
          {
            console.log(err);
          }
          else
          {
            console.log("suceessfully added item to DB");
          }
        });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
  });
