// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// var cors = require('cors');
// require('dotenv').config();
//
// var loginRouter = require('./routes/login');
// var homeRouter = require('./routes/home');
// var friendRouter = require('./routes/friend');
//
// var app = express();
//
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// app.use('/api/', loginRouter);
// app.use('/api/home', homeRouter);
// app.use('/api/friend', friendRouter);
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : err;
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
//
// module.exports = app;

require('dotenv').config()
const morgan = require('morgan')
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
// const port = process.env.PORT || 5000;

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
  app.enable('trust proxy');
  app.use((req, res, next) => {
    if (!req.secure) {
      if (req.path === '/') {
        res.redirect(301, `https://${req.host}/`)
      } else {
        res.status(400).end('Please switch to HTTPS.')
      }
    } else {
      return next()
    }
  })
}

// const Postgrator = require('postgrator')


// const { connectionString } = require('./database')

// const postgrator = new Postgrator({
//   // validateChecksums: false,
//   // newline: 'CRLF', // Force using 'CRLF' (windows) or 'LF' (unix/mac)
//   // migrationDirectory: __dirname + '/postgrator',
//   driver: 'pg',
//   connectionString,
//   ssl:true
// });

// postgrator.migrate('max', (err, migrations) => {
//   console.log('migrujem');
//   if (err) {
//     console.error('Database migration failed!');
//     console.error(err);
//     process.exit(1)
//   }
//
//   postgrator.endConnection(() => {
//     console.log('Database migrated successfully.');
//
//     /*
//      * Database has been migrated, all is good to go!
//      */
//
//   })
// });
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening at ${port}`)
})

// app.listen(port, () => console.log(`Listening on port ${port}`));