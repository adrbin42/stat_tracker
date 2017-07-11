const router = require('./routes/router');

app.use('/', router);

// Login Route  - GET Method - Just a welcome message
router.get("/api/login", function(req, res){
  if(req.user){
    res.send("Log in successful!")
  }
  else {
    res.send("Please login to continue");
  }
});

// Enter credentials - username, password
// Passport authenticate the user - POST method
router.post("/api/login", function(req, res, next){
  passport.authenticate('loginStrategy', (err, user, info) => {
  if (err) {
    return res.send(err);
  }
  if (!user) {
    return res.send(info);
  }
  req.login(user, function(err) {
  if (err) {
    return res.send(err);
  }
  session.id = user._id;
  return res.json(user);
  });
  })(req, res, next);
});

module.exports = router;
