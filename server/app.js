console.log('Starting up the server');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = 5000;

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({extended: true}));

var pg = require('pg');
var config = {
  database: 'phi', // the name of the database
  host: 'localhost', // where is your database
  port: 5432, // the port number for your database
  max: 10, // how many connections at one time
  idleTimeoutMillis: 30000 // 30 seconds to try to connect
};

var pool = new pg.Pool(config);

app.get('/task/table', function(req, res){
  pool.connect(function(err, client, done){
    if(err) {
      // There was an error connecting to the database
      console.log('Error connecting to database: ', err);
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now, we're gonna' git stuff!!!!!
      client.query('SELECT * FROM task', function(err, result){
        done();
        if(err) {
          console.log('Error making the database query: ', err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
          console.log(result.rows);
        }
      });
    }
  });
});

app.post('/task/new', function(req, res){
  // This will be replaced with an INSERT statement to SQL
  var newTask = req.body;

  pool.connect(function(err, client, done){
    if(err) {
      // There was an error connecting to the database
      console.log('Error connecting to database: ', err);
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now, we're gonna' git stuff!!!!!
      client.query('INSERT INTO task (name) VALUES ($1);',
      [newTask.taskName],
      function(err, result){
        done();
        if(err) {
          console.log('Error making the database query: ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }//end else
      });
    }
  });
});


app.delete('/task/delete/:id', function(req, res){
  var taskID = req.params.id;
  console.log('book id to delete: ', taskID);

  pool.connect(function(err, client, done){
    if(err) {
      // There was an error connecting to the database
      console.log('Err ', err);
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now, we're gonna' git stuff!!!!!
      client.query('DELETE FROM task WHERE id=$1;', //PARAM 1 $1 tells PG that we're looking for a variable
      [taskID], //PARAM 2 variable that we're adding to the PG query (Replaces $1 in the query)
      function(err, result){ //PARAM 3 the function that is run after the query takes place
        done();
        if(errorMakingQuery) {
          console.log('Err ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }//ends client.query function
      });//ends client.query
    } //ends pool connect function
  });//ends pool connect
});//ends delete router

app.put('/task/completed/:id', function(req, res){
  var taskID = req.params.id; //finds the optional parameter
  var taskCompletedObject = req.body;
  console.log('book id to save: ', taskID);

  pool.connect(function(err, client, done){
    if(err) {
      // There was an error connecting to the database
      console.log('Error connecting to database: ', err);
      res.sendStatus(500);

    } else {
      client.query('UPDATE task SET completed = TRUE WHERE id = $1', [taskCompletedObject.id]);
      done();
      res.send(200);
    }
  }); // end pg connect
}); // end app.put


app.listen(port, function() {
  console.log('We are running on port: ', port);
});
