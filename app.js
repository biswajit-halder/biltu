const path = require('path');
const express = require('express');
require('dotenv').config();
const morgan = require('morgan');

// controllers
const shortUrlController = require('./controllers/shorturl');

// routers
const shortUrlRouter = require('./routes/shorturl');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/",express.static("./node_modules/bootstrap/dist/"));
app.use("/",express.static("./node_modules/@fortawesome/"));
app.use(morgan('dev'));
app.set('view engine','ejs');

app.use('/', shortUrlRouter);

app.use((req, res, next) => {
  if (req.path !== '/') {
    shortUrlController.fetchUrlData(req, res, next);
  } else {
    next();
  }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ ${process.env.PROTOCOL}//${process.env.DB_HOST}:${PORT}/`));
