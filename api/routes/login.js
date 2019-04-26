var express = require('express');
var router = express.Router();
const db = require('../queries');

router.post('/', db.createUser);
router.post('/login', db.checkUser);

module.exports = router;