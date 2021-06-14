const express = require('express');
const router = express.Router();
const {validationResults} = require('express-validator/check');



const GET_EVENT_SQL = 'SELECT idevent, name, venue, description, idactivity, eventfee, eventimage FROM events WHERE idevent=?';
const GET_ALL_EVENTS_SQL = 'SELECT idevent, name, venue, description, idactivity, eventfee, eventimage FROM events';
const CREATE_EVENT_SQL = 'INSERT INTO events (name, venue, description, idactivity, eventfee, eventimage) VALUES (?,?,?,?,?,?)';
const DELETE_EVENT_SQL = 'DELETE from events WHERE idevent=?';
const UPDATE_EVENT_SQL = 'UPDATE events SET name=?, venue=?, description=?, idactivity=?, eventfee=?, eventimage=?  WHERE idevent=?'; 
const NOT_FOUND_ERROR_MSG = 'Item not found.';
const INVALID_DATA_ERROR_MSG = 'The request has invalid data.';


router.get('/', function(req, res) {
  global.connection.query(GET_ALL_EVENTS_SQL, function(error, results, fields) {
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
 

    req.checkBody('name', 'Nome do evento é um campo obrigatório').isLength({min: 1});
    req.checkBody('venue', 'Local do evento é um campo obrigatório').isLength({min: 1});
    req.checkBody('description', 'A descrição do evento é um campo obrigatório').isLength({min: 1});
    req.checkBody('idactivity', 'Id da atividade é um número').isLength({min: 1});
    req.checkBody('eventfee', 'O valor de inscrição é em euros').isLength({min: 1});

    
      
    let validationErrors = req.validationErrors();

    if (validationErrors) {
      res.status(400).json({ error: { msg: INVALID_DATA_ERROR_MSG, data: validationErrors }, response: null});    
    }else{
      global.connection.query(
        CREATE_EVENT_SQL, 
        [
          req.body.name, 
          req.body.venue, 
          req.body.description, 
          req.body.idactivity,
          req.body.eventfee,
          req.body.eventimage
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

router.get('/:idevent', function(req, res) {
  global.connection.query(GET_EVENT_SQL, [ req.params.idevent ], function(error, results, fields) {
    if (error) {
      res.status(500).json({ error: error, response: null }); 
    } else if (results.length == 0) {
      res.status(404).json({ error: NOT_FOUND_ERROR_MSG, response: null });      
    } else {
      res.status(200).json({ error: null, response: results[0] });
    }
  }); 
});

router.delete('/:idevent',  function(req, res) {
  global.connection.query(DELETE_EVENT_SQL, [ req.params.idevent ], function(error, results, fields) {
    if (error) {
      res.status(500).json({ error: error, response: null }); 
    } else if (results.affectedRows == 0) {
      res.status(404).json({ error: NOT_FOUND_ERROR_MSG, response: null });    
    } else{
      res.status(204).json({ error: null, response: null }); 
    }
  });
});

router.put('/:idevent',  function(req, res) {
  req.checkBody('name', 'Nome do evento é um campo obrigatório').isLength({min: 1});
  req.checkBody('venue', 'Local do evento é um campo obrigatório').isLength({min: 1});
  req.checkBody('description', 'A descrição do evento é um campo obrigatório').isLength({min: 1});
  req.checkBody('idactivity', 'Id da atividade é um número').isLength({min: 1});
  req.checkBody('eventfee', 'O valor de inscrição é em euros').isLength({min: 1});


 
    let validationErrors = req.validationErrors();

    if (validationErrors) {
      res.status(400).json({ error: { msg: INVALID_DATA_ERROR_MSG, data: validationErrors }, response: null});    
    }else{ 
      global.connection.query(
        UPDATE_EVENT_SQL, 
        [  
          req.body.name, 
          req.body.venue, 
          req.body.description, 
          req.body.idactivity,
          req.body.eventfee,
          req.body.eventimage,
          req.params.idevent
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

