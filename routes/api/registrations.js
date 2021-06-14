const express = require('express');
const router = express.Router();


const GET_REGISTRATION_SQL = 'SELECT * FROM registrations WHERE idregistration=?';
const GET_ALL_REGISTRATIONS_SQL = 'SELECT * FROM registrations';
const CREATE_REGISTRATION_SQL = 'INSERT INTO registrations (email, name, telephone, ideventfk) VALUES (?,?,?,?)';
const DELETE_REGISTRATION_SQL = 'DELETE from registrations WHERE idregistration=?';
const UPDATE_REGISTRATION_SQL = 'UPDATE registrations SET  email=?, name=?, telephone=?, ideventfk=? WHERE idregistration=?'; 
const NOT_FOUND_ERROR_MSG = 'Item not found.';
const INVALID_DATA_ERROR_MSG = 'The request has invalid data.';

router.get('/', function(req, res) {
  global.connection.query(GET_ALL_REGISTRATIONS_SQL, function(error, results, fields) {
    if (error) {
      res.status(500).json({ error: error, response: null }); 
    } else if (results.length == 0) {
      res.status(204).json({ error: null, response: results });
    } else {
      res.status(200).json({ error: null, response: results });
    }
  }); 
});

router.post('/', function(req, res) {
  
    req.checkBody('email', 'A valid email is required').isEmail();
    req.checkBody('name', 'Name is a required field').isLength({min: 1});
    req.checkBody('telephone', 'Dados inválidos').isLength({min: 4});

    let validationErrors = req.validationErrors();

    if (validationErrors) {
      res.status(400).json({ error: { msg: INVALID_DATA_ERROR_MSG, data: validationErrors }, response: null});    
    }else{
      global.connection.query(
        CREATE_REGISTRATION_SQL, 
        [
          req.body.email,  
          req.body.name, 
          req.body.telephone,
          req.body.ideventfk 
        ],
        function(error, results, fields) {
          if (error) {
            res.status(500).json({ error: {msg: INVALID_DATA_ERROR_MSG, data: error }, response: null}); 
          } else {
            res.status(201).json({ error: null, response: results }); 
          }
        }
      );
    }
});

router.get('/:idregistration', function(req, res) {
  global.connection.query(GET_REGISTRATION_SQL, [ req.params.idregistration ], function(error, results, fields) {
    if (error) {
      res.status(500).json({ error: error, response: null }); 
    } else if (results.length == 0) {
      res.status(404).json({ error: NOT_FOUND_ERROR_MSG, response: null });      
    } else {
      res.status(200).json({ error: null, response: results[0] });
    }
  }); 
});

router.delete('/:idregistration',  function(req, res) {
  global.connection.query(DELETE_REGISTRATION_SQL, [ req.params.idregistration ], function(error, results, fields) {
    if (error) {
      res.status(500).json({ error: error, response: null }); 
    } else if (results.affectedRows == 0) {
      res.status(404).json({ error: NOT_FOUND_ERROR_MSG, response: null });    
    } else{
      res.status(204).json({ error: null, response: null }); 
    }
  });
});

router.put('/:idregistration',  function(req, res) {
    req.checkBody('name', 'Name is a required field').isLength({min: 1});
    req.checkBody('email', 'A valid email is required').isEmail();
    req.checkBody('telephone', 'Dados inválidos').isLength({min: 4});


    let validationErrors = req.validationErrors();

    if (validationErrors) {
      res.status(400).json({ error: { msg: INVALID_DATA_ERROR_MSG, data: validationErrors }, response: null});    
    }else{ 
      global.connection.query(
        UPDATE_REGISTRATION_SQL, 
        [  
          req.body.email,  
          req.body.name, 
          req.body.telephone,
          req.body.ideventfk,
          req.params.idregistration
        ],
        function(error, results, fields) {
          if (error) {
            res.status(500).json({ error: { msg: INVALID_DATA_ERROR_MSG, data: error }, response: null});
          } else if (results.affectedRows == 0) {
            res.status(404).json({ error: NOT_FOUND_ERROR_MSG, response: null });    
          }else{
            res.status(204).json({ error: null, response: null }); 
          }
        }
      );
    }
});

module.exports = router;