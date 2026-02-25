const mongoose = require('mongoose');
const config = require('./config');

mongoose.set('transactionAsyncLocalStorage', true);

if (config.env === 'development') {
  mongoose.set('debug', true);
}

module.exports = mongoose;
