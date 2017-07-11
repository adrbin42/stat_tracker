const express         = require('express');
const router          = express.Router();
const mongoose        = require('mongoose');
const Schema          = mongoose.Schema;
const passport        = require('passport'); // Authentication using passport
const LocalStrategy   = require('passport-local').Strategy; //Require this to define Strategy to use with passport

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

mongoose.connect('mongodb://127.0.0.1:27017/stat_tracker'); //Database : stattracker
mongoose.Promise = require('bluebird'); // Validation : To capture validation

//Prepare mongoose Schema - For Users
  const userSchema = new Schema({
      username : String,
      password : String
  });
  const User = mongoose.model('user', userSchema);

//Prepare mongoose Schema - For activities
  const activitySchema = new Schema({
    activity     : {type:String, required:true },
    measurement  : {type:Number, required: true },
    date         : {type: Date, default: Date.now},
    userId       : {type: mongoose.Schema.Types.ObjectId, ref:'user'}
  });

  const activities = mongoose.model("activities", activitySchema);

  //set passport middleware
  router.use(passport.initialize());
  router.use(passport.session());
  //serialize user
  passport.serializeUser(function(user,done){
    return done(null, user._id);
  });
  //Deserialize user
  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    });
  });

  //Defining Signup Strategy for passport  - Signup for users to add activity
  //This Strategy is used later during Signup
  passport.use('registerUser', new LocalStrategy(
    {passReqToCallback:true},
    function(req, username, password, done){
      let errors = "";
      req.checkBody("username", "Please enter a valid username").notEmpty().isLength({max: 25});
      req.checkBody("password", "Please enter a Password").notEmpty();

      errors = req.validationErrors();
      if(!errors) {
        var newUser = new User({
          username: req.body.username,
          password: req.body.password
        });
      }
      else{
        return done(errors);
      }
      newUser.save(function(err){
      if(err){
        return done(err);
      }
        return done(null, newUser);
      });
    }
  ));
  // Defining Login strategy for passport - Users to login to add activity
  passport.use('loginStrategy', new LocalStrategy(
    function (username, password, done) {
      User.findOne({username: username}, function (err, doc) {
        if (err) {
          return done(err);
        }
        if (!doc) {
          return done(null, false, 'Incorrect username');
        }
        if(password!== doc.password){
          return done(null, false, 'Incorrect password');
        }
        if(password === doc.password){
          return done(null, doc, 'Successful login');
        }
        else{
          return done('Login failed');
        }
      });
    }
  ));

module.exports = router;
