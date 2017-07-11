const router = require('./routes/router');
const login = require('./routes/login');
const activities = require('./routes/activities');

////////
app.use('/', router);
app.use('/api/login', login);
app.use('/api/activities', activities);

//post('/api/activities/:id/stats')
//This method fetch the id and select the activity (like swimming, walking etc.)
//Display all the activities entered by the user sorted by date DESC
//Still hold good only for logged User

router.post('/api/activities/:id/stats', (req, res) => {
    var query, activity;

    query = activities.findOne({_id:req.params.id, userId:session.id});
    query.select('activity');
    query.exec(function(err, result) {
    activity = result.activity;

    query = activities.find({activity:activity, userId:session.id})
    query.select('activity date measurement');
    query.sort({date: -1});
    query.exec(function(err, resultSet){
      res.status(200).json({
        responseType: resultSet
      });
    }).catch(function(err) {
      res.status(400).send("Bad request");
    });
    }).catch(function(err) {
      res.status(400).send("Bad request. Please try again");
    });
});

//delete('/api/stats/:id')
//This method fetches the id and get the date and activity
//Based on the date and activity, removes all activity for the day

router.delete('/api/stats/:id', (req, res) => {
  var query, date, activity;

  query = activities.findOne({_id:req.params.id, userId:session.id});
  query.select('date activity');
  query.exec(function(err, result) {
  date = result.date;
  activity = result.activity;

  activities.remove(
    {activity: activity, date:date, userId:session.id})
    .then(response => {
        res.status(200).json({
          responseType: 'activities deleted'
        });
      })
    .catch(err =>{
      res.status(200).json({
        responseType: 'activities not deleted'
      })
    });

  }).catch(function(err) {
    res.status(400).send("Bad request. Please try again");
  });
});

module.exports = router;
