var path = require('path');

module.exports = function(app, callback) {
  app.get('assetManager').compile(app.get('rootDirectory'), function(error) {
    callback(error, app);
  });
};
