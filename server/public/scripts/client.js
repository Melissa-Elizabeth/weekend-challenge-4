$(document).ready(function() {
  getTaskData();
  function getTaskData(){
    $.ajax({
      type: 'GET',
      url: '/task/table',
      success: function(response){
        console.log('response', response);
        $('#taskTableBody').empty(); // clears the tasks currently in the table
        for (var i = 0; i < response.length; i++) { //Loops through the task array (the response array)
          var currentTaskInfo = response[i];
          var $newTaskInfo = $('<tr>'); //create a new row for each task info
          $newTaskInfo.data('id', currentTaskInfo.id); //adds data ID to the task object so we can call it later
          $newTaskInfo.append('<td class="taskName">' + currentTaskInfo.name + '</td>'); //
          $newTaskInfo.append('<td><button class="completeButton">Completed</button>');
          $newTaskInfo.append('<td><button class="deleteButton">Delete</button>');
          if(currentTaskInfo.completed === true) {
            $newTaskInfo.css('background-color', 'pink');
          } else if(currentTaskInfo === false) {
            $newTaskInfo.css('background-color', 'white');
          }
          $('#taskTableBody').append($newTaskInfo);
          console.log($newTaskInfo);
        } // end of else
      }
    }); // end of GET ajax
  } // end of getTaskData

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
        console.log('error friend');
      } //end of error
    }); // end of ajax
  } // end of addTaskClicked function

  $('#taskTableBody').on('click', '.completeButton', function(){
    $(this).parent().parent().css('background-color', 'pink');
    var taskIDCompleted = $(this).parent().parent().data().id;
    var completedTaskObject = {
      id: taskIDCompleted
    }; // end completedTaskObject
    $.ajax({
      url: '/task/completed/' + taskIDCompleted,
      type: 'PUT',
      data: completedTaskObject,
      success: function (data){
        console.log(completedTaskObject);
        //
        // $('#CompletedTaskTableBody').empty(); // clears the tasks currently in the table
        // for (var i = 0; i < data.length; i++) { //Loops through the task array (the response array)
        //   var currentCompleteTaskInfo = data[i]; //More legible for code below
        //   var $newCompleteTaskInfo = $('<tr>'); //create a new row for each ptask info
        //   $newCompleteTaskInfo.data('id', currentCompleteTaskInfo.id); //adds data ID to the task object so we can call it later
        //   $newCompleteTaskInfo.append('<td>' + currentCompleteTaskInfo.complete_name + '</td>'); //
        //     $('#CompletedTaskTableBody').append($newCompleteTaskInfo);
        // } // Broken code.

      } // end of success
    }); // end of ajax call

  }); // end of on click

  $('#taskTableBody').on('click', '.deleteButton', function(){
    var taskIDDelete = $(this).parent().parent().data().id;
    console.log('DeleteButton has ID: ', taskIDDelete);
    $.ajax({
      type: 'DELETE',
      url: '/task/delete/' + taskIDDelete,
      success: function(response){
        console.log(response);
        getTaskData();
      }// end of success
    });// end of ajax
  });// end of on click
});// end of Doc Ready
