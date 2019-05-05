var express = require('express');
var router = express.Router();
const db = require('../queries');

router.get('/:id', db.getUserById);
router.get('/users/:id', db.getAllUsersExceptMeAndFriends);
router.get('/add-friend/:id/:friendId', db.addFriend);
router.get('/total/:id', db.getTotal);
router.get('/friends/:id', db.getFriends);
router.get('/groups/:id', db.getGroups);
router.get('/find-request/:requester/:responder/:type', db.findRequest);
router.get('/notifications/:id', db.getNotifications);
router.get('/set-seen/:userId/:typeId', db.setSeen);

router.post('/add-item', db.addItem);
router.post('/add-group', db.addGroup);
router.post('/add-action-notification', db.addActionNotification);
router.post('/new-request-and-notification', db.addRequestAndNotification);
router.post('/update-and-add-notification', db.updateAndAddNotification);


module.exports = router;