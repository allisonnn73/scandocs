const scan = require('./scan2');

module.exports = app => {
  app.use('/scan2', scan);
};
