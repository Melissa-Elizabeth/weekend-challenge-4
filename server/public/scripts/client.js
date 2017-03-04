$(document).ready(function() {
  getTaskData();
  function getTaskData(){
  $.ajax({
    type: 'GET',
    url: '/task/table',
    success: function(response){
      console.log('response', response); //response is an array of task objects (defined by SQL on client side)
      $('#taskTableBody').empty(); // clears the tasks currently in the table
      for (var i = 0; i < response.length; i++) { //Loops through the task array (the response array)
        var currenttaskInfo = response[i]; //More legible for code below
        var $newtaskInfo = $('<tr>'); //create a new row for each ptask info
        $newtaskInfo.data('id', currenttaskInfo.id); //adds data ID to the task object so we can call it later
        $newtaskInfo.append('<td>' + currenttaskInfo.name + '</td>'); //show user the author
        $newtaskInfo.append('<td><button class="completeButton">Completed</button>');
        $newtaskInfo.append('<td><button class="deleteButton">Delete</button>');
        $('#taskTableBody').append($newtaskInfo);
        console.log($newtaskInfo);
    }
  }
}); //ends of GET ajax
} //end of getTaskData

  $('#addTaskButton').on('click', addTaskClicked);

    function addTaskClicked() {
        console.log('you rock as far as clicking goes!');
        var newTaskObject = {
            taskName: $('#addTaskInput').val(),
        }; // end newTaskObject

        $.ajax({
            type: 'POST',
            url: '/task/new',
            data: newTaskObject,
            success: function(data) {
                getTaskData();
            }, // end of success
            error: function(error) {
                console.log('error dude');
            } //end of error
        }); // end of ajax
    } // end of addTaskClicked function

    $('#taskTableBody').on('click', '.completeButton', function(){
  location.reload();
  var taskIDCompleted = $(this).parent().parent().data().id;
  var completedTaskObject = {
    id: taskIDCompleted
  }; // end completedTaskObject
  $.ajax({
    url: '/task/completed/' + taskIDCompleted,
    type: 'PUT',
    data: completedTaskObject,
    success: function ( data ){

    console.log(completedTaskObject);
      } // end success
  }); // end ajax call
}); // end click

    $('#taskTableBody').on('click', '.deleteButton', function(){
  var taskIDDelete = $(this).parent().parent().data().id;
  console.log('DeleteButton has ID: ', taskIDDelete);
$.ajax({
  type: 'DELETE',
  url: '/delete/' + taskIDDelete,
  success: function(response){
    console.log(response);
    getTaskData();
  }//end success
});//end ajax
});//end on click
});//end of Doc Ready
