const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
var unirest = require("unirest");
const mongoose = require("mongoose");
let crypto = require('crypto');

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

const commentSchema = new mongoose.Schema({
  username: String,
  message: String,
  date: String
});

const Password = mongoose.model("Password", passwordSchema);
const Comment = mongoose.model("Comment", commentSchema);


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
})

app.get("/comment", function(req, res)
{
	const username = req.query.username_login;
	var messages = [];
	var dates = [];
	var usernames = [];
	console.log(username);
	Comment.find(function(err, message){
	  if(err)
	  {
		console.log("You have an error here")
		console.log(err);
	  }
	  else
	  {
		message.forEach(function(message_db){
			console.log(message_db.date);
			messages.push(message_db.message);
			dates.push(message_db.date);
			usernames.push(message_db.username);
		});
		
		res.render('comment_page', {username: btoa(username), messages: messages, dates: dates, usernames: usernames});
	  }
	  	  
	});
    
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
			if(username_login === username_db.username)
			{
				password_login = hash(password_login, 'aoaoao');
				if(password_login === username_db.password)
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
		console.log("Access denied");
	  }
	  
	});

	
});

app.post("/check-pass", function (req, res){
  res.render('signup', {same_pass : "yes"});
});

app.post("/gotologin", function(req, res){
	res.redirect('/');
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
  console.log(confirmPassword);
  
  if(password_login !== confirmPassword)
  {
	  	res.render('signup', {same_pass : "no"});
		return;
  }
  
  const entry = new Password({
	  firstName: firstname_login,
	  lastName: lastname_login, 
	  username: username_login,
	  password: hash(password_login, 'aoaoao')
	});

  Password.insertMany(entry, function(err){
          if(err)
          {
            console.log(err);
          }
          else
          {
            console.log("suceessfully added item to dB");
			res.render('successful_signup');
          }
        });
});

app.post("/post-comment", function(req, res){
	const new_comment = new Comment({
	  username: req.body.username,
	  message: req.body.comment,
	  date: req.body.date
	});

  Comment.insertMany(new_comment, function(err){
          if(err)
          {
            console.log(err);
          }
          else
          {
            console.log("suceessfully added comment to dB");
          }
		  
		  res.redirect("/comment?username_login=" + req.body.username);
        });
		
});

//combines hashing and the salt
let hasher = (password, salt) => {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    let value = hash.digest('hex');
    return value;
};

let hash = (password, salt) => {
    if (password == null || salt == null) {
        throw new Error('Must Provide Password and salt values');
    }
    if (typeof password !== 'string' || typeof salt !== 'string') {
        throw new Error('password must be a string and salt must either be a salt string or a number of rounds');
    }
    return hasher(password, salt);
};

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
  });
