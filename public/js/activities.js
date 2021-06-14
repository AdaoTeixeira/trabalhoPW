var selectActivity = null;

function clearActivityForm() {
  $('#activity-form')[0].reset();     
}

function newActivity() {
  selectActivity = null;
  clearActivityForm()
  $('#idactivity').prop("readOnly", true);  
  $('#activity-remove-btn').hide();
  $('#activity-dlg .modal-title').text("Nova atividade");
  $('#activity-dlg').modal();
}

function showActivity(activity) {
  selectActivity = activity;
  clearActivityForm()
  fetch('/api/v1/activities/' + activity)
  .then(function(resp) {
    return resp.json();
  })
  .then(function(data) {
    $("#idactivity").val(data.response.idactivity);
    $("#idactivity").prop("readOnly", true);
    $("#activityname").val(data.response.name);
    $('#activity-remove-btn').show();
    $('#activity-dlg .modal-title').text("Editar Atividade");
    $("#activity-dlg").modal();    
  })    
}

function listActivities() {
  fetch('/api/v1/activities/')
  .then(function(resp) {
      return resp.json();
  })
  .then(function(data) {
    var table = $('#activities-table').find('tbody')[0];
    table.innerHTML = "";
    $.each(data.response, function(index, value) {    
        var newRow = table.insertRow(table.rows.length);
        newRow.insertCell(0).appendChild(document.createTextNode(value.idactivity));     
        newRow.insertCell(1).appendChild(document.createTextNode(value.name)); 
    });
  })
};   

function saveActivity() {
  let url = '/api/v1/activities/';
  let method = 'post';
  let activityData = {
    name: $("#activityname").val(),
  }

  if (selectActivity) {
    url = url + selectActivity;
    method = 'put';
  }else{
    activityData['idactivity'] = $("#idactivity").val()
  }

  fetch(url, {
    method: method,
    body: JSON.stringify(activityData),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function(resp) {  
    if (resp.ok) {
      listActivities();
      $("#activity-dlg").modal('hide'); 
      return;
    }else{
      return resp.json();  
    }  
  }).then(function(data) {
    $.alert(data.error.msg);      
  })
}

function removeActivity() {
  $.confirm({
    title: 'Remover atividade',
    content: `Tem a certeza que quer remover a atividade '${selectActivity}' ?`,
    icon: 'fa fa-question',
    theme: 'bootstrap',
    closeIcon: true,
    animation: 'scale',
    type: 'red',
    buttons: {
      Confirm: function() {
        fetch(`api/v1/activities/${selectActivity}`, {
          method: 'delete'
        })
        .then(function() {
          listActivities();
          $('#activity-dlg').modal('hide');
        })        
      },
      Cancel: function() {}
    }
  });
}

$(document).ready(function() {

  listActivities();

  $( '#refresh-btn' ).click(function() {
    listActivities();
  });

  $( '#new-activity-btn' ).click(function() {
    newActivity();
  });
  
  $( '#activity-save-btn' ).click(function() {
    saveActivity();
  });

  $( '#activities-table' ).delegate('tr td:first-child', 'click', function() {
    var activityId = $(this).text();
    showActivity(activityId)
  });

  $('#activity-remove-btn').click(function() {
    removeActivity();
  });


});
