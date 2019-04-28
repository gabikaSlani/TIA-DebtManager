require('dotenv').config()
const morgan = require('morgan')
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const loginRouter = require('./routes/login');
const homeRouter = require('./routes/home');
const friendRouter = require('./routes/friend');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// API calls
app.use('/api/', loginRouter);
app.use('/api/home', homeRouter);
app.use('/api/friend', friendRouter);

/*
* Log failed requests to stderr
*/
app.use(
  morgan('tiny', {
    skip: (req, res) => res.statusCode < 400,
    stream: process.stderr
  })
)

/*
* Log successful requests to stderr
*/
app.use(
  morgan('tiny', {
    skip: (req, res) => res.statusCode >= 400,
    stream: process.stdout
  })
);

/*
 * Ignore HTTP'ed requests if running in Heroku. Use HTTPS only.
 */
if (process.env.DYNO) {
  // app.enable('trust proxy');
  app.use((req, res, next) => {
    if (!req.secure) {
      if (req.path === '/api') {
        res.redirect(301, `https://${req.host}/api`)
      } else {
        res.status(400).end('Please switch to HTTPS.')
      }
    } else {
      return next()
    }
  })
}
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening at ${port}`)
});