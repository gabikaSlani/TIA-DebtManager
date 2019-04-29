var bcrypt = require('bcrypt');

const Pool = require('pg').Pool;
const pool = new Pool({
  // user: process.env.USER,
  //   // host: process.env.HOST,
  //   // database: process.env.DATABASE,
  //   // password: process.env.PASSWORD,
  //   // port: 5432,
  //   // ssl: true
  user: 'veclcaxeuailen',
  host: 'ec2-54-225-129-101.compute-1.amazonaws.com',
  database: 'd4hd5aukslmbh',
  password: 'a8195d0943a470d7cd1f28efcf820eb70bf16f72f267803d89b739e02d944aa5',
  port: 5432,
  ssl: true
});

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);
  if (isNaN(id)) {
    console.log('id is NaN');
    throw error;
  } else {
    console.log(id);
    pool.query('SELECT * FROM users WHERE id=$1', [id], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
  }
};

const createUser = (request, response) => {
  const {login, password} = request.body;
  pool.query('INSERT INTO users (login, password) VALUES ($1, $2) RETURNING *',
    [login, encryptPassword(password)],
    (error, results) => {
      if (error) {
        if (error.constraint === 'unique_login') {
          response.status(201).send(false);
          return;
        } else {
          throw error;
        }
      }
      response.status(201).send(true);
    });
};

const checkUser = (request, response) => {
  console.log('som v check user');
  const {login, password} = request.body;
  console.log(login, password);
  pool.query('SELECT * FROM users WHERE login=$1', [login], (error, results) => {
    if (error) {
      response.status(500).send(error);
      console.log(error);
    }
    else {
      if (results.rowCount === 1 && bcrypt.compareSync(password, results.rows[0].password)) {
        console.log('dobre meno a heslo');
        response.status(201).send({valid: true, id: results.rows[0].id});
      } else {
        response.status(201).send({valid: false});
        console.log('zle meno alebo heslo');
      }
    }
  });
};

const getAllUsersExceptMeAndFriends = (request, response) => {
  const id = parseInt(request.params.id);
  if (isNaN(id)) {
    console.log('id is NaN');
    throw error;
  } else {
    console.log(id);
    pool.query('SELECT * from users where users.id != $1 and users.id not in ' +
      '(SELECT user2_id FROM friends WHERE user1_id = $1);', [id], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
  }
};

const addFriend = (request, response) => {
  const userId = parseInt(request.params.id);
  const friendId = parseInt(request.params.friendId);
  if (isNaN(userId) || isNaN(friendId)) {
    console.log('id is NaN');
    throw error;
  } else {
    console.log(userId, friendId);
    pool.query('INSERT INTO friends (user1_id, user2_id) VALUES ($1, $2), ($2, $1) RETURNING *',
      [userId, friendId], (error, results) => {
        if (error) {
          throw error;
        } else {
          console.log("returning from insert friends:" + results.rows);
          response.status(200).send(true);
        }
      });

  }
};

const getTotal = (request, response) => {
  const id = parseInt(request.params.id);
  if (isNaN(id)) {
    console.log('id is NaN');
    throw error;
  } else {
    console.log(id);
    pool.query('SELECT ' +
      '((SELECT coalesce(sum(amount), 0) FROM debts WHERE settled = false AND receiver_id = $1) ' +
      '- ' +
      '(SELECT coalesce(sum(amount),0) FROM debts WHERE settled = false AND payer_id = $1)) as total', [id], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(results.rows[0].total);
    });
  }
};

const getFriends = (request, response) => {
  const id = parseInt(request.params.id);
  if (isNaN(id)) {
    console.log('id is NaN');
    throw error;
  } else {
    pool.query('SELECT a.id, a.debt, users.login FROM users JOIN ' +
      '(SELECT ' +
      'user2_id as id, ' +
      '((Select coalesce(sum(amount), 0) from debts WHERE receiver_id = $1 AND payer_id = user2_id AND settled=false) ' +
      '- ' +
      '(Select coalesce(sum(amount), 0) from debts WHERE payer_id = $1 And receiver_id = user2_id AND settled=false)) as debt ' +
      'from friends WHERE user1_id = $1) as a ON a.id = users.id ORDER BY abs(debt) DESC',
      [id], (error, results) => {
        if (error) {
          throw error;
        }
        console.log(results.rows);
        response.status(200).json(results.rows);
      });
  }
};

const getItems = (request, response) => {
  const userId = parseInt(request.params.id);
  const friendId = parseInt(request.params.friendId);
  if (isNaN(userId) || isNaN(friendId)) {
    console.log('id is NaN');
    throw error;
  } else {
    console.log(userId, friendId);
    pool.query('SELECT items.id, items.name, items.amount, u.login as chipper, u.id as chipperId, ' +
      'u1.login as creator, u1.id as creatorId, d.amount as debt, d.settled ' +
      'FROM items ' +
      'JOIN chip_in_item as ch ON ch.item_id = items.id AND ((creator_id = $1 AND user_id = $2) OR (creator_id = $2 AND user_id = $1)) ' +
      'JOIN users as u on ch.user_id = u.id ' +
      'JOIN users as u1 on items.creator_id = u1.id ' +
      'JOIN debts as d on items.id = d.item_id AND ((d.receiver_id = $1 AND d.payer_id = $2) OR (d.receiver_id = $2 AND d.payer_id = $1)) ' +
      'ORDER BY date DESC;',
      [userId, friendId], (error, results) => {
        if (error) {
          throw error;
        }
        console.log(results.rows);
        response.status(200).json(results.rows);
      });
  }
};

const addItem = (request, response) => {
  const {id, itemInfo} = request.body;
  const amount = parseFloat(itemInfo.amount).toFixed(2);
  const name = itemInfo.description;
  const debt = (amount / (itemInfo.chosenFriends.length + 1)).toFixed(2);
  tx(async client => {
    const {rows} = await client.query('INSERT INTO items (name, amount, date, creator_id) VALUES ($1,$2,NOW(),$3) RETURNING *', [name, amount, id]);
    const itemId = rows[0].id;
    itemInfo.chosenFriends.forEach(async friend => {
      await client.query('INSERT INTO chip_in_item (item_id, user_id) VALUES ($1,$2)', [itemId, friend.value]);
      await client.query('INSERT INTO debts (settled, receiver_id, payer_id, item_id, amount) VALUES (false,$1,$2,$3,$4)',
        [id, friend.value, itemId, debt])
    });
    await client.query('INSERT INTO chip_in_item (item_id, user_id) VALUES ($1,$2)', [itemId, id]);
    console.log('hotovo');
  })
    .then(() => response.status(200).json({debt: debt}))
    .catch((error) => {
      console.log(error);
      throw error;
    })
};

const settleUp = (request, response) => {
  const userId = parseInt(request.params.id);
  const friendId = parseInt(request.params.friendId);
  if (isNaN(userId) || isNaN(friendId)) {
    console.log('id is NaN');
    throw error;
  } else {
    console.log('settling up:' + userId, friendId);
    pool.query('UPDATE debts SET settled = true WHERE settled=false AND ' +
      '((receiver_id = $1 AND payer_id = $2) OR (receiver_id = $2 AND payer_id = $1))',
      [userId, friendId], (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json('ok');
      });
  }
};

const addRequestAndNotification = (request, response) => {
  const {user, friend, type} = request.body;
  tx(async client => {
    const result = await client.query('SELECT id FROM types WHERE name=$1', [type]);
    const typeId = result.rows[0].id;
    console.log('typeId:' + typeId);
    const {rows} = await client.query('INSERT INTO requests (creation_date, responder_id, requester_id, state_id, type_id) ' +
      'VALUES (NOW(),$1,$2,1,$3) RETURNING *', [friend.id, user.info.id, typeId]);
    const requestId = rows[0].id;
    const message = getMessage(typeId, user.info.login);
    console.log('requestId: ' + requestId);
    console.log('message: ' + message);
    await client.query('INSERT INTO notifications (message, seen, receiver_id, type_id, request_id) VALUES ($1,false, $2,$3,$4)',
      [message, friend.id, typeId, requestId]);
    console.log('hotovo');
  })
    .then(() => response.status(201).json('ok'))
    .catch((error) => {
      console.log(error);
      throw error;
    })
};

const findRequest = (request, response) => {
  const responderId = parseInt(request.params.responder);
  const requesterId = parseInt(request.params.requester);
  const typeId = parseInt(request.params.type);
  if (isNaN(responderId) || isNaN(requesterId) || isNaN(typeId)) {
    console.log('id is NaN');
    throw error;
  } else {
    console.log(requesterId, responderId);
    pool.query('SELECT * FROM requests WHERE responder_id=$1 AND requester_id=$2 AND type_id=$3 AND state_id=1',
      [responderId, requesterId, typeId], (error, results) => {
        if (error) {
          throw error;
        }
        console.log(results.rowCount > 0);
        response.status(200).json(results.rowCount > 0);
      });
  }
};

const getNotifications = (request, response) => {
  const id = request.params.id;
  if (isNaN(id)) {
    console.log('id is NaN');
    throw error;
  } else {
    pool.query('SELECT n.id, n.message, n.type_id, t.name, n.seen, n.receiver_id, r.requester_id, u.login as requester_name ' +
      'FROM ((notifications as n LEFT JOIN requests as r ON n.request_id=r.id) LEFT JOIN users as u ON r.requester_id=u.id )' +
      'JOIN types as t on t.id=n.type_id WHERE n.receiver_id=$1 ORDER by n.id DESC ',
      [id], (error, results) => {
        if (error) {
          throw error;
        }
        const result = notificationsDataStruct(results.rows);
        response.status(200).json(result);
      });
  }
};

const notificationsDataStruct = (data) => {
  let result = {};
  result['pair_off'] = {count: 0, messages: []};
  result['settle_up'] = {count: 0, messages: []};
  result['action'] = {count: 0, messages: []};
  for (let index in data) {
    let obj = data[index];
    if (obj.name === 'pair_off') {
      if(!obj.seen) result['pair_off']['count']++;
      result['pair_off']['messages'].push(obj);
    } else if (obj.name === 'settle_up') {
      if(!obj.seen) result['settle_up']['count']++;
      result['settle_up']['messages'].push(obj);
    } else {
      if(!obj.seen) result['action']['count']++;
      result['action']['messages'].push(obj);
    }
  }
  return result;
};

const setSeen = (request, response) => {
  const userId = parseInt(request.params.userId);
  const typeId = parseInt(request.params.typeId);
  if (isNaN(userId) || isNaN(typeId)) {
    console.log('id is NaN');
    throw error;
  } else {
    console.log(userId, typeId);
    pool.query('UPDATE notifications SET seen=true WHERE receiver_id=$1 AND type_id=$2 ',
      [userId, typeId], (error, results) => {
        if (error) {
          console.log(error);
          throw error;
        }
        response.status(200).json('ok');
      });
  }
};

const updateAndAddNotification = (request, response) =>{
  const {accept,notificationId,typeId,newMessage,updateMessage,receiverId} = request.body;
  console.log(accept, notificationId, typeId, receiverId, newMessage, updateMessage);
  tx(async client => {
    const result = await client.query('SELECT request_id as id FROM notifications WHERE id=$1', [notificationId]);
    const requestId = result.rows[0].id;
    console.log('requestId=' + requestId);
    accept
      ? await client.query('UPDATE requests SET state_id=2 WHERE id=$1 ', [requestId])
      : await client.query('UPDATE requests SET state_id=3 WHERE id=$1 ', [requestId]);

    await client.query('UPDATE notifications SET message=$1, request_id=NULL WHERE id=$2 ', [updateMessage, notificationId]);
    await client.query('INSERT INTO notifications (message, seen, receiver_id, type_id) VALUES ($1,false,$2,$3)',
      [newMessage, receiverId, typeId]);
    console.log('hotovo');
  })
    .then(() => response.status(201).json('ok'))
    .catch((error) => {
      console.log(error);
      throw error;
    })
};

const encryptPassword = (password) => {
  let hash = bcrypt.hashSync(password, 10);
  return hash;
};

const tx = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    try {
      await callback(client);
      client.query('COMMIT')
    } catch (e) {
      client.query('ROLLBACK')
    }
  } finally {
    client.release()
  }
};

const getMessage = (typeId, userName) => {
  if (typeId === 1) {
    return userName + ' wants to be paired off with you.';
  } else if (typeId === 2) {
    return userName + ' wants you to confirm that all your debts are settled up.';
  } else {
    return 'something wrong happened.';
  }
};

const addActionNotification  = (request, response) => {
  const {message, receivers} = request.body;
  console.log(receivers, message);
  tx(async client => {
    receivers.forEach(async receiver => {
      await client.query('INSERT INTO notifications (message, seen, receiver_id, type_id) VALUES ($1,false,$2,3) ',
        [message, receiver.value]);
    });
  })
    .then(() => response.status(200).json('ok'))
    .catch((error) => {
      console.log(error);
      throw error;
    })
};

module.exports = {
  getUserById,
  createUser,
  checkUser,
  getAllUsersExceptMeAndFriends,
  addFriend,
  getTotal,
  getFriends,
  getItems,
  addItem,
  settleUp,
  addRequestAndNotification,
  findRequest,
  getNotifications,
  setSeen,
  updateAndAddNotification,
  addActionNotification,

};

