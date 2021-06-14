var selectRegistration = null;


function listEventsSelect() {
  fetch('/api/v1/events')
  .then(function(resp) {
      return resp.json();
  })
  .then(function(data) {
    var select = document.getElementById("registrationideventfk"); 
      $.each(data.response, function(index, value) {    
      var option = document.createElement("option");
      option.text = value.name;
      option.value = value.idevent;
      select.appendChild(option);    
    });
  })
}



function clearRegistrationForm() {
  $('#registration-form')[0].reset();     
}

function newRegistration() {
  selectRegistration = null;
  clearRegistrationForm()
  $('#idregistration').prop("readOnly", true);  
  $('#registration-remove-btn').hide();
  $('#registration-dlg .modal-title').text("Nova Inscrição");
  $('#registration-dlg').modal();
}

function showRegistration(registration) {
  selectRegistration = registration;
  clearRegistrationForm()
  fetch('/api/v1/registrations/' + registration)
  .then(function(resp) {
    return resp.json();
  })
  .then(function(data) {
    $("#idregistration").val(data.response.idregistration);
    $("#idregistration").prop("readOnly", true);
    $("#registrationemail").val(data.response.email);
    $("#registrationname").val(data.response.name);
    $("#registrationtelephone").val(data.response.telephone);
    $("#registrationideventfk").val(data.response.ideventfk);
    $('#registration-remove-btn').show();
    $('#registration-dlg .modal-title').text("Editar Inscrição");
    $("#registration-dlg").modal();    
  })    
}

function listRegistrations() {
  fetch('/api/v1/registrations/')
  .then(function(resp) {
      return resp.json();
  })
  .then(function(data) {
    var table = $('#registrations-table').find('tbody')[0];
    table.innerHTML = "";
    $.each(data.response, function(index, value) {    
        var newRow = table.insertRow(table.rows.length);
        newRow.insertCell(0).appendChild(document.createTextNode(value.idregistration));     
        newRow.insertCell(1).appendChild(document.createTextNode(value.email));
        newRow.insertCell(2).appendChild(document.createTextNode(value.name)); 
        newRow.insertCell(3).appendChild(document.createTextNode(value.telephone)); 
        newRow.insertCell(4).appendChild(document.createTextNode(value.ideventfk));   
    });
  })
};   

function saveRegistration() {
  let url = '/api/v1/registrations/';
  let method = 'post';
  let registrationData = {
    email: $("#registrationemail").val(),
    name: $("#registrationname").val(),
    telephone: $("#registrationtelephone").val(),
    ideventfk: $("#registrationideventfk").val(),
  }

  if (selectRegistration) {
    url = url + selectRegistration;
    method = 'put';
  }else{
    registrationData['idregistration'] = $("#idregistration").val()
  }

  fetch(url, {
    method: method,
    body: JSON.stringify(registrationData),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function(resp) {  
    if (resp.ok) {
      listRegistrations();
      $("#registration-dlg").modal('hide'); 
      return;
    }else{
      return resp.json();  
    }  
  }).then(function(data) {
    $.alert(data.error.msg);      
  })
}

function removeRegistration() {
  $.confirm({
    title: 'Remover Incrição',
    content: `Tem a certeza que quer remover esta inscrição? '${selectRegistration}' ?`,
    icon: 'fa fa-question',
    theme: 'bootstrap',
    closeIcon: true,
    animation: 'scale',
    type: 'red',
    buttons: {
      Confirm: function() {
        fetch(`api/v1/registrations/${selectRegistration}`, {
          method: 'delete'
        })
        .then(function() {
          listRegistrations();
          $('#registration-dlg').modal('hide');
        })        
      },
      Cancel: function() {}
    }
  });
}


function confirmRegistration() {
  $.confirm({
    title: 'Incrição Aceite',
    content: `Incrição efetuada com sucesso.`,
    icon: '',
    theme: 'bootstrap',
    closeIcon: true,
    animation: 'scale',
    type: 'red',
    buttons: {
      Confirm: function() { 
      },
      }
  });
}


$(document).ready(function() {

  listRegistrations();
  listEventsSelect();

  $( '#refresh-btn' ).click(function() {
    listRegistrations();
  });

  $( '#new-registration-btn' ).click(function() {
    newRegistration();
    
  });
  
  $( '#registration-save-btn' ).click(function() {
    saveRegistration();
    confirmRegistration();
  });

  $( '#registrations-table' ).delegate('tr td:first-child', 'click', function() {
    var registrationId = $(this).text();
    showRegistration(registrationId)
  });

  $('#registration-remove-btn').click(function() {
    removeRegistration();
  });


});
