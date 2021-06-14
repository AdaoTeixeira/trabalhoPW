var selectUser = null;

function clearUserForm() {
  $('#user-form')[0].reset();
}

function newUser() {
  selectUser = null;
  clearUserForm()
  $('#username').prop("readOnly", false);
  $('#user-remove-btn').hide();
  $('#user-dlg .modal-title').text("Novo utilizador");
  $('#user-dlg').modal();
}

function showUser(user) {
  selectUser = user;
  clearUserForm()
  fetch('/api/v1/users/' + user)
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      $("#username").val(data.response.username);
      $("#username").prop("readOnly", true);
      $("#nameUser").val(data.response.name);
      $("#emailUser").val(data.response.email);
      $("#estado").val(data.response.estado);
      $("#type").val(data.response.type);
      $('#user-remove-btn').show();
      $('#user-dlg .modal-title').text("Edit User");
      $("#user-dlg").modal();
    })
}

function listUsers() {
  fetch('/api/v1/users/')
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      var table = $('#users-table').find('tbody')[0];
      table.innerHTML = "";
      $.each(data.response, function (index, value) {
        var newRow = table.insertRow(table.rows.length);
        newRow.insertCell(0).appendChild(document.createTextNode(value.username));
        newRow.insertCell(1).appendChild(document.createTextNode(value.name));
        newRow.insertCell(2).appendChild(document.createTextNode(value.email));
        newRow.insertCell(3).appendChild(document.createTextNode(value.type));
        newRow.insertCell(4).appendChild(document.createTextNode(value.estado));
      });
    })
};

function saveUser() {
  let url = '/api/v1/users/';
  let method = 'post';
  let userData = {
    name: $("#nameUser").val(),
    email: $("#emailUser").val(),
    password: $("#password").val(),
    type: $("#type").val(),
    estado: $("#estado").val()
  }

  if (selectUser) {
    url = url + selectUser;
    method = 'put';
  } else {
    userData['username'] = $("#username").val()
  }

  fetch(url, {
    method: method,
    body: JSON.stringify(userData),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (resp) {
    if (resp.ok) {
      listUsers();
      $("#user-dlg").modal('hide');
      return;
    } else {
      return resp.json();
    }
  }).then(function (data) {
    $.alert(data.error.msg);
  })
}

function removeUser() {
  $.confirm({
    title: 'Remove Utilizador',
    content: `Tem a certeza que quer remover o utilizador '${selectUser}' ?`,
    icon: 'fa fa-question',
    theme: 'bootstrap',
    closeIcon: true,
    animation: 'scale',
    type: 'red',
    buttons: {
      Confirm: function () {
        fetch(`api/v1/users/${selectUser}`, {
            method: 'delete'
          })
          .then(function () {
            listUsers();
            $('#user-dlg').modal('hide');
          })
      },
      Cancel: function () {}
    }
  });
}

$(document).ready(function () {

  listUsers();

  $('#refresh-btn').click(function () {
    listUsers();
  });

  $('#new-user-btn').click(function () {
    newUser();
  });

  $('#user-save-btn').click(function () {
    saveUser();
  });

  $('#users-table').delegate('tr td:first-child', 'click', function () {
    var userId = $(this).text();
    showUser(userId)
  });

  $('#user-remove-btn').click(function () {
    removeUser();
  });


});