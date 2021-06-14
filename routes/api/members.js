const express = require('express');
const router = express.Router();
const {validationResults} = require('express-validator/check');



const GET_MEMBER_SQL = 'SELECT idmember, name, email, address, city, phonenr, subscriptiondate, boardposition, photourl  FROM members WHERE idmember=?';
const GET_ALL_MEMBERS_SQL = 'SELECT idmember, name, email, address, city, phonenr, subscriptiondate, boardposition, photourl FROM members';
const CREATE_MEMBER_SQL = 'INSERT INTO members (idmember, name, email, address, city, phonenr, subscriptiondate, boardposition, photourl ) VALUES (?,?,?,?,?,?,?,?,?)';
const NEW_IDMEMBER_SQL= 'SELECT MAX(idmember) FROM webitclo_B211.members';
const DELETE_MEMBER_SQL = 'DELETE from members WHERE idmember=?';
const UPDATE_MEMBER_SQL = 'UPDATE members SET name=?, email=?, address=?, city=?, phonenr=?, boardposition=?, photourl=?  WHERE idmember=?'; 
const NOT_FOUND_ERROR_MSG = 'Item not found.';
const INVALID_DATA_ERROR_MSG = 'The request has invalid data.';


router.get('/',  function(req, res) {
  global.connection.query(GET_ALL_MEMBERS_SQL, function(error, results, fields) {
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
  
    req.checkBody('idmember', 'Id de sócio é um número').isLength({min: 1});
    req.checkBody('name', 'Nome é um campo obrigatório').isLength({min: 1});
    req.checkBody('email', 'Por favor coloque um email válido').isEmail();
    req.checkBody('address', 'Morada é um campo obrigatório').isLength({min: 1});
    req.checkBody('city', 'Cidade é um campo obrigatório').isLength({min: 1});
    req.checkBody('phonenr', 'Formato de telefone inválido').isLength({min: 6});
    req.checkBody('photourl', '');
    
    
  /*  const image = req.file;
   
    if (!req.file) {
      const error = new Error ("Imagem em falta.");
      error.statusCode=422;
      throw error;
    }
    const imageUrl = req.file.path;*/
   /* if (!errors.isEmpty()) {
      let error = new Error ('Validação no servidor falhou.');
     error.statusCode= 422;
     throw error;
  };
*/
    let validationErrors = req.validationErrors();

    if (validationErrors) {
      res.status(400).json({ error: { msg: INVALID_DATA_ERROR_MSG, data: validationErrors }, response: null});    
    }else{
      global.connection.query(
        CREATE_MEMBER_SQL, 
        [
          req.body.idmember, 
          req.body.name, 
          req.body.email, 
          req.body.address,
          req.body.city,
          req.body.phonenr,
          req.body.subscriptiondate,
          req.body.boardposition,
          req.body.photourl
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

router.get('/:idmember',  function(req, res) {
  global.connection.query(GET_MEMBER_SQL, [ req.params.idmember ], function(error, results, fields) {
    if (error) {
      res.status(500).json({ error: error, response: null }); 
    } else if (results.length == 0) {
      res.status(404).json({ error: NOT_FOUND_ERROR_MSG, response: null });      
    } else {
      res.status(200).json({ error: null, response: results[0] });
    }
  }); 
});

router.delete('/:idmember', function(req, res) {
  global.connection.query(DELETE_MEMBER_SQL, [ req.params.idmember ], function(error, results, fields) {
    if (error) {
      res.status(500).json({ error: error, response: null }); 
    } else if (results.affectedRows == 0) {
      res.status(404).json({ error: NOT_FOUND_ERROR_MSG, response: null });    
    } else{
      res.status(204).json({ error: null, response: null }); 
    }
  });
});

router.put('/:idmember', function(req, res) {
  req.checkBody('name', 'Nome é um campo obrigatório').isLength({min: 1});
  req.checkBody('email', 'Por favor coloque um email válido').isEmail();
  req.checkBody('address', 'Morada é um campo obrigatório').isLength({min: 1});
  req.checkBody('city', 'Cidade é um campo obrigatório').isLength({min: 1});
  req.checkBody('phonenr', 'Formato de telefone inválido').isLength({min: 6});


  let validationErrors = req.validationErrors();

  if (validationErrors) {
    res.status(400).json({ error: { msg: INVALID_DATA_ERROR_MSG, data: validationErrors }, response: null});    
  }else{ 
    global.connection.query(
     UPDATE_MEMBER_SQL, 
     [  
        req.body.name,  
        req.body.email, 
        req.body.address,
        req.body.city,
        req.body.phonenr,
        req.body.boardposition,
        req.body.photourl,
        req.params.idmember
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
