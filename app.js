require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encryption = require("mongoose-encryption");
const app = express();
const secret = process.env.SECRET;
const bcrypt = require("bcrypt");
const saltRounds = 10;
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
  email: {
    type:String,
    required:[true, "No email"]
  } ,
  password: String
});

const User = new mongoose.model("User", userSchema);

app.get('/', (req,res) =>{
res.render("home");
});

app.get('/login', (req,res) =>{
res.render("login");
});

app.get('/secrets', (req,res) =>{
res.render("secrets");
});

app.get('/register', (req,res) =>{
res.render("register");
 });

app.post('/register', (req,res) =>{
  bcrypt.hash(req.body.password,saltRounds,(err,hash)=>{
    if (err) {
      console.log(err);
    }else{
      const newUser = User({
        email: req.body.username,
        password: hash
      });
      newUser.save((err)=>{
       if (err){
         console.log(err);
       } else{
         console.log('Done!');
         res.render("secrets");
       }
     });
    }
  })


});

app.get('/submit', (req,res) =>{
res.render("submit");
});


app.post("/login",(req,res)=>{
  const login = req.body.username;
  const password = req.body.password;
  console.log(login, password);
  User.findOne({email:login}, (err, user)=>{
    if (err) {
      console.log("Error ", err);
    } else {
      if (user) {
        bcrypt.compare(password, user.password, function(err, result) {
          if (result === true){
          res.render("secrets");
          }
        });
  }}
  });
  });




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
