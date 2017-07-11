const express = require('express');
const session = require('express-session');
const validator = require('express-validator');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const mustache = require('mustache');
const route = require("./routes/router.js");
const mustacheExp = require('mustache-express');

const app = express();

app.set('port', (process.env.PORT || 3500));


app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(validator());
app.use(route);
app.use(morgan("dev"));

app.engine("mustache", mustacheExp());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

app.use(session({
  secret: 'winnerswin',
  resave: true,
  saveUninitialized:true
}));

app.get('/', function(req,res){
    res.render('index');
})


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
