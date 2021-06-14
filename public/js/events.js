var selectEvent = null;

function clearEventForm() {
  $('#event-form')[0].reset();     
}


function listActivitiesSelect() {
  fetch('/api/v1/activities/')
  .then(function(resp) {
      return resp.json();
  })
  .then(function(data) {
    var select = document.getElementById("fkactivities"); 
      $.each(data.response, function(index, value) {    
      var option = document.createElement("option");
      option.text = value.name;
      option.value = value.idactivity;
      select.appendChild(option);    
    });
  })
}


/*html = "";
  obj = {
    
      "1" : "recolha de lixo",
      "2" : "observação de Natureza",
      "3" : "Caminhada",
      "4" : "Ciclismo",
      "5" : "Recolha de Lixo",
      "6" :	"Palestra",
      "7" : "Informação"
    }
  for(var key in obj) {
      html += "<option value=" + key  + ">" +obj[key] + "</option>"
  }
  document.getElementById("fkactivities").innerHTML = html;
*/
function newEvent() {
  selectEvent = null;
  clearEventForm()
  $('#idevent').prop("readOnly", true); 
  $('#event-remove-btn').hide();
  $('#event-dlg .modal-title').text("Novo Evento");
  $('#event-dlg').modal();
}

function showEvent(event) {
  selectEvent = event;
  clearEventForm()
  fetch('/api/v1/events/' + event)
  .then(function(resp) {
    return resp.json();
  })
  .then(function(data) {
    $("#idevent").val(data.response.idevent);
    $("#idevent").prop("readOnly", true);
    $("#eventname").val(data.response.name);
    $("#venue").val(data.response.venue);
    $("#description").val(data.response.description);
    $("#fkactivities").val(data.response.idactivity);
    $("#eventfee").val(data.response.eventfee);
    $("#eventimage").val(data.response.eventimage);  
    
    
    $('#event-remove-btn').show();
    $('#event-dlg .modal-title').text("Edit Event");
    $("#event-dlg").modal();    
  })    
}

function listEvents() {
  fetch('/api/v1/events')
  .then(function(resp) {
      return resp.json();
  })
  .then(function(data) {
    var table = $('#events-table').find('tbody')[0];
    table.innerHTML = "";
    $.each(data.response, function(index, value) {    
        var newRow = table.insertRow(table.rows.length);
        newRow.insertCell(0).appendChild(document.createTextNode(value.idevent));     
        newRow.insertCell(1).appendChild(document.createTextNode(value.name)); 
        newRow.insertCell(2).appendChild(document.createTextNode(value.venue));
        newRow.insertCell(3).appendChild(document.createTextNode(value.description)); 
        newRow.insertCell(4).appendChild(document.createTextNode(value.idactivity));   
        newRow.insertCell(5).appendChild(document.createTextNode(value.eventfee));     
        newRow.insertCell(6).appendChild(document.createTextNode(value.eventimage));                
    });
  })
};   

function saveEvent() {
  let url = '/api/v1/events/';
  let method = 'post';
  let eventData = {
    name: $("#eventname").val(),
    venue: $("#venue").val(),
    description: $("#description").val(),
    idactivity: $("#fkactivities").val(),
    eventfee: $("#eventfee").val(),
    eventimage: $("#eventimage").val(),
  }

  if (selectEvent) {
    url = url + selectEvent;
    method = 'put';
  }else{
    eventData['idevent'] = $("#idevent").val()
  }

  fetch(url, {
    method: method,
    body: JSON.stringify(eventData),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function(resp) {  
    if (resp.ok) {
      listEvents();
      $("#event-dlg").modal('hide'); 
      return;
    }else{
      return resp.json();  
    }  
  }).then(function(data) {
    $.alert(data.error.msg);      
  })
}

function removeEvent() {
  $.confirm({
    title: 'Remove Event',
    content: `Do you really want to remove this event'${selectEvent}' ?`,
    icon: 'fa fa-question',
    theme: 'bootstrap',
    closeIcon: true,
    animation: 'scale',
    type: 'red',
    buttons: {
      Confirm: function() {
        fetch(`api/v1/events/${selectEvent}`, {
          method: 'delete'
        })
        .then(function() {
          listEvents();
          $('#event-dlg').modal('hide');
        })        
      },
      Cancel: function() {}
    }
  });
}

$(document).ready(function() {

  listEvents();
  
  loadactivities();

  $( '#refresh-btn' ).click(function() {
    listEvents();
  });
 

  $( '#new-event-btn' ).click(function() {
    newEvent();
  });
  
  $( '#event-save-btn' ).click(function() {
    saveEvent();
  });

  $( '#events-table' ).delegate('tr td:first-child', 'click', function() {
    var eventId = $(this).text();
    showEvent(eventId)
  });

  $('#event-remove-btn').click(function() {
    removeEvent();
  });
});
