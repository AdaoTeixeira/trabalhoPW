var selectSponsor = null;

function clearSponsorForm() {
  $('#sponsor-form')[0].reset();     
}

function newSponsor() {
  selectSponsor = null;
  clearSponsorForm()
  $('#idsponsor').prop("readOnly", true);  
  $('#sponsor-remove-btn').hide();
  $('#sponsor-dlg .modal-title').text("Novo patrocinador");
  $('#sponsor-dlg').modal();
}

function showSponsor(sponsor) {
  selectSponsor = sponsor;
  clearSponsorForm()
  fetch('/api/v1/sponsors/' + sponsor)
  .then(function(resp) {
    return resp.json();
  })
  .then(function(data) {
    $("#idsponsor").val(data.response.idsponsor);
    $("#idsponsor").prop("readOnly", true);
    $("#sponsorname").val(data.response.name); 
    $("#organizationtype").val(data.response.organizationtype);
    $("#sponsornif").val(data.response.nif);
    $("#emailsponsor").val(data.response.email);
    $("#phonesponsor").val(data.response.telephone);
    $("#urllogosponsor").val(data.response.urllogo);
    $('#sponsor-remove-btn').show();
    $('#sponsor-dlg .modal-title').text("Editar Patricinador");
    $("#sponsor-dlg").modal();

  })    
}



function listSponsors() {
  fetch('/api/v1/sponsors/')
  .then(function(resp) {
      return resp.json();
  })
  .then(function(data) {
    var table = $('#sponsors-table').find('tbody')[0];
    table.innerHTML = "";
    $.each(data.response, function(index, value) {    
        var newRow = table.insertRow(table.rows.length);
        newRow.insertCell(0).appendChild(document.createTextNode(value.idsponsor));     
        newRow.insertCell(1).appendChild(document.createTextNode(value.name)); 
        newRow.insertCell(2).appendChild(document.createTextNode(value.organizationtype));
        newRow.insertCell(3).appendChild(document.createTextNode(value.nif)); 
        newRow.insertCell(4).appendChild(document.createTextNode(value.email));   
        newRow.insertCell(5).appendChild(document.createTextNode(value.telephone));     
        newRow.insertCell(6).appendChild(document.createTextNode(value.urllogo));                
    });
  })
};   

function saveSponsor() {
  let url = '/api/v1/sponsors/';
  let method = 'post';
  let sponsorData = {
    name: $("#sponsorname").val(),
    organizationtype: $("#organizationtype").val(),
    nif: $("#sponsornif").val(),
    email: $("#emailsponsor").val(),
    telephone: $("#phonesponsor").val(),
    urllogo: $("#urllogosponsor").val(),
  }

  if (selectSponsor) {
    url = url + selectSponsor;
    method = 'put';
  }else{
    sponsorData
  }

  fetch(url, {
    method: method,
    body: JSON.stringify(sponsorData),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function(resp) {  
    if (resp.ok) {
      listSponsors();
      $("#sponsor-dlg").modal('hide'); 
      return;
    }else{
      return resp.json();  
    }  
  }).then(function(data) {
    $.alert(data.error.msg);      
  })
}

function removeSponsor() {
  $.confirm({
    title: 'Remove Sponsor',
    content: `Do you really want to remove this sponsor'${selectSponsor}' ?`,
    icon: 'fa fa-question',
    theme: 'bootstrap',
    closeIcon: true,
    animation: 'scale',
    type: 'red',
    buttons: {
      Confirm: function() {
        fetch(`api/v1/sponsors/${selectSponsor}`, {
          method: 'delete'
        })
        .then(function() {
          listSponsors();
          $('#sponsor-dlg').modal('hide');
        })        
      },
      Cancel: function() {}
    }
  });
}

$(document).ready(function() {

  listSponsors();

  $( '#refresh-btn' ).click(function() {
    listSponsors();
  });

  $( '#new-sponsor-btn' ).click(function() {
    newSponsor();
  });
  
  $( '#sponsor-save-btn' ).click(function() {
    saveSponsor();
  });

  $( '#sponsors-table' ).delegate('tr td:first-child', 'click', function () {
    var sponsorId = $(this).text();
    showSponsor(sponsorId)
  });

  $('#sponsor-remove-btn').click(function() {
    removeSponsor();
  });
});

