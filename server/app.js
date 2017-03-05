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

  var newTask = req.body;

  pool.connect(function(err, client, done){
    if(err) {
      // There was an error connecting to the database
      console.log('Error connecting to database: ', err);
      res.sendStatus(500);
    } else {
      client.query('INSERT INTO task (name) VALUES ($1);',
      [newTask.taskName],
      function(err, result){
        done();
        if(err) {
          console.log('Error making the database query: ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        } // end else
      }); // end query
    } // end else
  }); // end pool function
}); // end app.post


app.delete('/task/delete/:id', function(req, res){
  var taskID = req.params.id;
  console.log(taskID);

  pool.connect(function(err, client, done){
    if(err) {
      // There was an error connecting to the database
      console.log('Err ', err);
      res.sendStatus(500);
    } else {

      client.query('DELETE FROM task WHERE id=$1;',
      [taskID],
      function(err, result){
        done();
        if(err) {
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
  var taskID = req.params.id;
  var taskCompletedObject = req.body;
  console.log(taskID);
  pool.connect(function(err, client, done){
    if(err) {
      // There was an error connecting to the database
      res.sendStatus(500);

    } else {
      client.query('UPDATE task SET completed = TRUE WHERE id = $1',  [taskCompletedObject.id]);
      //    client.query ('INSERT INTO completed_tasks SELECT * FROM task WHERE completed = TRUE AND id = $1',
      // [taskCompletedObject.id]); // Broken code. What am I doing wrong?!?!
      done();
      res.send(200);
    }
  }); // end pg connect
}); // end app.put


app.listen(port, function() {
  console.log('We are running on port: ', port);
});
