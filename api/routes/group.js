var express = require('express');
var router = express.Router();
const db = require('../queries');

router.get('/:id', db.getGroupById);
router.get('/items/:userId/:groupId', db.getItemsInGroup);
router.get('/members/:id', db.getGroupMembers);


module.exports = router;