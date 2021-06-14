const express = require('express');
const router = express.Router();


router.post('/contacts/emails', controllerMail.send);



module.exports = router;
