const express = require('express');
const router = express.Router();

const GET_ACTIVITY_SQL = 'SELECT * FROM activities WHERE idactivity=?';
const GET_ALL_ACTIVITIES_SQL = 'SELECT * FROM activities';
const CREATE_ACTIVITY_SQL = 'INSERT INTO activities (name) VALUES (?)';
const DELETE_ACTIVITY_SQL = 'DELETE from activities WHERE idactivity=?';
const UPDATE_ACTIVITY_SQL = 'UPDATE activities SET name=? WHERE idactivity=?'; 
const NOT_FOUND_ERROR_MSG = 'Item not found.';
const INVALID_DATA_ERROR_MSG = 'The request has invalid data.';

router.get('/',  function(req, res) {
  global.connection.query(GET_ALL_ACTIVITIES_SQL, function(error, results, fields) {
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
    req.checkBody('name', 'Nome é um campo obrigatório').isLength({min: 1});
  
    let validationErrors = req.validationErrors();

    if (validationErrors) {
      res.status(400).json({ error: { msg: INVALID_DATA_ERROR_MSG, data: validationErrors }, response: null});    
    }else{
      global.connection.query(
        CREATE_ACTIVITY_SQL, 
        [ 
          req.body.name, 
     
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

router.get('/:idactivity',  function(req, res) {
  global.connection.query(GET_ACTIVITY_SQL, [ req.params.idactivity ], function(error, results, fields) {
    if (error) {
      res.status(500).json({ error: error, response: null }); 
    } else if (results.length == 0) {
      res.status(404).json({ error: NOT_FOUND_ERROR_MSG, response: null });      
    } else {
      res.status(200).json({ error: null, response: results[0] });
    }
  }); 
});

router.delete('/:idactivity', function(req, res) {
  global.connection.query(DELETE_ACTIVITY_SQL, [ req.params.idactivity ], function(error, results, fields) {
    if (error) {
      res.status(500).json({ error: error, response: null }); 
    } else if (results.affectedRows == 0) {
      res.status(404).json({ error: NOT_FOUND_ERROR_MSG, response: null });    
    } else{
      res.status(204).json({ error: null, response: null }); 
    }
  });
});

router.put('/:idactivity',  function(req, res) {
    req.checkBody('name', 'Name is a required field').isLength({min: 1});
 

    let validationErrors = req.validationErrors();

    if (validationErrors) {
      res.status(400).json({ error: { msg: INVALID_DATA_ERROR_MSG, data: validationErrors }, response: null});    
    }else{ 
      global.connection.query(
        UPDATE_ACTIVITY_SQL, 
        [  
          req.body.name,
          req.params.idactivity 
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