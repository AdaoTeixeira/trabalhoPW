var selectMember = null;


function clearMemberForm() {
  $('#member-form')[0].reset();     
}

function newMember() {
  selectMember = null;
  clearMemberForm()
  $('#idmember').prop("readOnly", true); 
  $('#member-remove-btn').hide();
  $('#member-dlg .modal-title').text("Novo Sócio");
  $('#member-dlg').modal();
}


 
       
function showMember(member) {
  selectMember = member;
  clearMemberForm()
  fetch('/api/v1/members/' + member)
  .then(function(resp) {
    return resp.json();
  })
  .then(function(data) {
    $("#idmember").val(data.response.idmember);
    $("#idmember").prop("readOnly", true);
    $("#name").val(data.response.name);
    $("#email").val(data.response.email);
    $("#address").val(data.response.address);
    $("#city").val(data.response.city);
    $("#phonenr").val(data.response.phonenr);
    $("#subscriptiondate").val(data.response.subscriptiondate);
    $("#boardposition").val(data.response.boardposition);
    $("#photourl").val(data.response.file); 
    $('#member-remove-btn').show();
    $('#member-dlg .modal-title').text("Editar Sócio");
    $("#member-dlg").modal();    
  })    
}

function listMembers() {
  fetch('/api/v1/members/')
  .then(function(resp) {
      return resp.json();
  })
  .then(function(data) {
    var table = $('#members-table').find('tbody')[0];
    table.innerHTML = "";
    $.each(data.response, function(index, value) {    
        var newRow = table.insertRow(table.rows.length);
        newRow.insertCell(0).appendChild(document.createTextNode(value.idmember));     
        newRow.insertCell(1).appendChild(document.createTextNode(value.name)); 
        newRow.insertCell(2).appendChild(document.createTextNode(value.email));
        newRow.insertCell(3).appendChild(document.createTextNode(value.address)); 
        newRow.insertCell(4).appendChild(document.createTextNode(value.city));   
        newRow.insertCell(5).appendChild(document.createTextNode(value.phonenr));        
        newRow.insertCell(6).appendChild(document.createTextNode(value.subscriptiondate));        
        newRow.insertCell(7).appendChild(document.createTextNode(value.boardposition));        
        newRow.insertCell(8).appendChild(document.createTextNode(value.photourl));                    
    });
  })
};   

function saveMember() {
  let url = '/api/v1/members/';
  let method = 'post';
  let memberData = {
    name: $("#name").val(),
    email: $("#email").val(),
    address: $("#address").val(),
    city: $("#city").val(),
    phonenr: $("#phonenr").val(),
    boardposition: $("#boardposition").val(),
    photourl: $("#photourl").val(),
  }

  if (selectMember) {
    url = url + selectMember;
    method = 'put';
  }else{
    memberData['idmember'] = $("#idmember").val()
  }

  fetch(url, {
    method: method,
    body: JSON.stringify(memberData),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function(resp) {  
    if (resp.ok) {
      listMembers();
      $("#member-dlg").modal('hide'); 
      return;
    }else{
      return resp.json();  
    }  
  }).then(function(data) {
    $.alert(data.error.msg);      
  })
}

function removeMember() {
  $.confirm({
    title: 'Remove member',
    content: `Do you really want to remove the member '${selectMember}' ?`,
    icon: 'fa fa-question',
    theme: 'bootstrap',
    closeIcon: true,
    animation: 'scale',
    type: 'red',
    buttons: {
      Confirm: function() {
        fetch(`api/v1/members/${selectMember}`, {
          method: 'delete'
        })
        .then(function() {
          listMembers();
          $('#member-dlg').modal('hide');
        })        
      },
      Cancel: function() {}
    }
  });
};


$(document).ready(function() {

  listMembers();

  $( '#refresh-btn' ).click(function() {
    listMembers();
  });

  $( '#new-member-btn' ).click(function() {
    newMember();
  });
  
  $( '#member-save-btn' ).click(function() {
    saveMember();
  });

  $( '#members-table' ).delegate('tr td:first-child', 'click', function() {
    var memberId = $(this).text();
    showMember(memberId)
  });

  $('#member-remove-btn').click(function() {
    removeMember();
  });


});
