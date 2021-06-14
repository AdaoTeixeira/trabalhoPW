const express = require('express');
const router = express.Router();

const GET_SPONSORS_SQL = 'SELECT * FROM sponsors WHERE idsponsor=?';
const GET_ALL_SPONSORS_SQL = 'SELECT * FROM sponsors';
const CREATE_SPONSOR_SQL = 'INSERT INTO sponsors (name, organizationtype, nif, email, telephone, urllogo ) VALUES (?,?,?,?,?,?)';
const DELETE_SPONSOR_SQL = 'DELETE from sponsors WHERE idsponsor=?';
const UPDATE_SPONSOR_SQL = 'UPDATE sponsors SET name=?, organizationtype=?, nif=?, email=?, telephone=?, urllogo=? WHERE idsponsor=?'; 
const NOT_FOUND_ERROR_MSG = 'Item not found.';
const INVALID_DATA_ERROR_MSG = 'The request has invalid data.';

router.get('/',  function(req, res) {
  global.connection.query(GET_ALL_SPONSORS_SQL, function(error, results, fields) {
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
  req.checkBody('name', 'Nome do patrocinador é um campo obrigatório').isLength({min: 1});
  req.checkBody('organizationtype', 'O tipo de organização é um campo obrigatório').isLength({min: 1});
  req.checkBody('nif', 'O NIF do patrocinador é um campo obrigatório').isLength({min: 1});
  req.checkBody('email', 'Por favor coloque um email válido').isEmail();
  req.checkBody('telephone', 'Formato de telefone inválido').isLength({min: 6});


    let validationErrors = req.validationErrors();

    if (validationErrors) {
      res.status(400).json({ error: { msg: INVALID_DATA_ERROR_MSG, data: validationErrors }, response: null});    
    }else{
      global.connection.query(
        CREATE_SPONSOR_SQL, 
        [ 
          req.body.name, 
          req.body.organizationtype,
          req.body.nif,
          req.body.email,
          req.body.telephone,
          req.body.urllogo  
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

router.get('/:idsponsor', function(req, res) {
  global.connection.query(GET_SPONSORS_SQL, [ req.params.idsponsor ], function(error, results, fields) {
    if (error) {
      res.status(500).json({ error: error, response: null }); 
    } else if (results.length == 0) {
      res.status(404).json({ error: NOT_FOUND_ERROR_MSG, response: null });      
    } else {
      res.status(200).json({ error: null, response: results[0] });
    }
  }); 
});

router.delete('/:idsponsor', global.forbidIfNotLogged(), function(req, res) {
  global.connection.query(DELETE_SPONSOR_SQL, [ req.params.idsponsor ], function(error, results, fields) {
    if (error) {
      res.status(500).json({ error: error, response: null }); 
    } else if (results.affectedRows == 0) {
      res.status(404).json({ error: NOT_FOUND_ERROR_MSG, response: null });    
    } else{
      res.status(204).json({ error: null, response: null }); 
    }
  });
});

router.put('/:username', function(req, res) {
  req.checkBody('name', 'Nome do patrocinador é um campo obrigatório').isLength({min: 1});
  req.checkBody('organizationtype', 'O tipo de organização é um campo obrigatório').isLength({min: 1});
  req.checkBody('nif', 'O NIF do patrocinador é um campo obrigatório').isLength({min: 1});
  req.checkBody('email', 'Por favor coloque um email válido').isEmail();
  req.checkBody('telephone', 'Formato de telefone inválido').isLength({min: 6});
  

    let validationErrors = req.validationErrors();

    if (validationErrors) {
      res.status(400).json({ error: { msg: INVALID_DATA_ERROR_MSG, data: validationErrors }, response: null});    
    }else{ 
      global.connection.query(
        UPDATE_SPONSOR_SQL, 
        [  
          req.body.name, 
          req.body.organizationtype,
          req.body.nif,
          req.body.email,
          req.body.telephone,
          req.body.urllogo,
          req.params.idsponsor 
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

