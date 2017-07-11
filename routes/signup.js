const router = require('./routes/router');

app.use('/', router);

// Sign Up - GET  Method - Just a welcome message
 router.get("/api/signup", function(req, res){
   res.send("Welcome to activity tracker");
 });

// Sign Up - POST Method
// Input Username and Password and sign up
router.post("/api/signup",function(req,res, next){
   passport.authenticate('registerUser', (err,user,info)=>{
     if(err){
       return res.send({err:err, info:info});
     }
     else{
       res.setHeader('Content-Type', 'application/json');
       res.status(200).json(user);
     }
   })(req, res, next);
 });

module.exports = router;
