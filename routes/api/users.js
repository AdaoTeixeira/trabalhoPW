const express = require('express');
const router = express.Router();
const {validationResults} = require('express-validator/check')


const GET_USER_SQL = 'SELECT username, name, email, type, estado FROM users WHERE username=?';
const GET_ALL_USERS_SQL = 'SELECT username, name, email, type, estado FROM users';
const CREATE_USER_SQL = 'INSERT INTO users (username, name, email, password, type, estado) VALUES (?,?,?,?,?,?)';
const DELETE_USER_SQL = 'DELETE from users WHERE username=?';
const UPDATE_USER_SQL = 'UPDATE users SET name=?, email=?, password=?, type=?, estado=?  WHERE username=?'; 
const NOT_FOUND_ERROR_MSG = 'Item not found.';
const INVALID_DATA_ERROR_MSG = 'The request has invalid data.';


router.get('/',  function(req, res) {
  global.connection.query(GET_ALL_USERS_SQL, function(error, results, fields) {
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

    req.checkBody('username', 'Nome de utilizador deve ter entre 5 e 10 carateres').isLength({min: 5, max: 10});
    req.checkBody('name', 'Nome é um campo obrigatório').isLength({min: 1});
    req.checkBody('email', 'Por favor coloque um email válido').isEmail();
    req.checkBody('password', 'Password deve ter entre 8 e 15 carateres').isLength({min: 8, max: 15});

  
 
    let validationErrors = req.validationErrors();

    if (validationErrors) {
      res.status(400).json({ error: { msg: INVALID_DATA_ERROR_MSG, data: validationErrors }, response: null});    
    }else{
      global.connection.query(
        CREATE_USER_SQL, 
        [ 
          req.body.username, 
          req.body.name, 
          req.body.email, 
          req.body.password,
          req.body.type,
          req.body.estado 
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

router.get('/:username',  function(req, res) {
  global.connection.query(GET_USER_SQL, [ req.params.username ], function(error, results, fields) {
    if (error) {
      res.status(500).json({ error: error, response: null }); 
    } else if (results.length == 0) {
      res.status(404).json({ error: NOT_FOUND_ERROR_MSG, response: null });      
    } else {
      res.status(200).json({ error: null, response: results[0] });
    }
  }); 
});

router.delete('/:username',  function(req, res) {
  global.connection.query(DELETE_USER_SQL, [ req.params.username ], function(error, results, fields) {
    if (error) {
      res.status(500).json({ error: error, response: null }); 
    } else if (results.affectedRows == 0) {
      res.status(404).json({ error: NOT_FOUND_ERROR_MSG, response: null });    
    } else{
      res.status(204).json({ error: null, response: null }); 
    }
  });
});

router.put('/:username',  function(req, res) {
    req.checkBody('name', 'Nome é um campo obrigatório').isLength({min: 1});
    req.checkBody('email', 'Por favor coloque um email válido').isEmail();
    req.checkBody('password', 'Password deve ter entre 8 e 15 carateres').isLength({min: 8, max: 15});

   
    
    let validationErrors = req.validationErrors();

    if (validationErrors) {
      res.status(400).json({ error: { msg: INVALID_DATA_ERROR_MSG, data: validationErrors }, response: null});    
    }else{ 
      global.connection.query(
        UPDATE_USER_SQL, 
        [  
          req.body.name, 
          req.body.email, 
          req.body.password,
          req.body.type,
          req.body.estado,
          req.params.username
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

