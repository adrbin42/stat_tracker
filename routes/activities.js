const router = require('./routes/router');


// get('/api/activities')
// Get ALL the activities entered by the user logged in
router.get('/api/activities', function(req, res) {
  activities.find({userId:session.id})
    .then(function(activity) {
      if (activity) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(activity);
      } else {
        res.send("No activity found")
      }
    }).catch(function(err) {
      res.status(400).send("Bad request. Please try again");
    });
});

//post('/api/activities')
// Add a new activity document by logged user;  Parameters :  activity, measurement
router.post('/api/activities', function(req, res) {
  let activityInstance = new activities({
    activity: req.body.activity,
    measurement: req.body.measurement,
    userId: session.id
  });

  activityInstance.save(function(err){
    if(!err){
      res.setHeader('Content-Type', 'application/json');
      res.status(201).json(activityInstance);
    }
    else{
      res.send("Error adding activity");
    }
  });
});

//get('/api/activities/:id')
// This fetches the  activity based on a ID from the activity collection
router.get('/api/activities/:id', function(req, res) {
    activities.find({_id:req.params.id, userId:session.id})
    .then(function(activity) {
      if (activity) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(activity);
      } else {
        res.send("No activity found")
      }
    }).catch(function(err) {
      res.status(400).send("Bad request. Please try again");
    });
});

//put('/api/activities/:id')
//Edit activity or measurement for a particular document
router.put('/api/activities/:id', (req, res, next) => {
  activities.update(
    {_id:req.params.id, userId:session.id},
    {activity: req.body.activity, measurement:req.body.measurement})
    .then(response => {
        res.status(200).json({
          responseType: 'activity updated'
        });
      })
    .catch(err =>{
      res.status(200).json({
        responseType: 'activity not updated'
      })
    });
});

//delete('/api/activities/:id
//This deletes a document based on the id
router.delete('/api/activities/:id', (req, res, next) => {
  activities.findOneAndRemove(
    {_id:req.params.id, userId:session.id})
    .then(response => {
        res.status(200).json({
          responseType: 'activity deleted'
        });
      })
    .catch(err =>{
      res.status(200).json({
        responseType: 'activity not deleted'
      })
    });
});

module.exports = router;
