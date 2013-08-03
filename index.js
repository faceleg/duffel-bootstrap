var async = require('async'),
  express = require('express'),
  fs = require('fs');

module.exports = {
  run: function(rootDirectory, applicationCallback) {
    if (typeof rootDirectory !== 'string') {
      throw new Error('Root directory is required - ' + rootDirectory + ' is not a string');
    }

    var app = express();

    var database = require('./lib/initialisers/database'),
      local = require('./lib/initialisers/local'),
      nunjucks = require('./lib/initialisers/nunjucks'),
      application = require('./lib/initialisers/application'),
      initialisers = require('./lib/initialisers/initialisers'),
      intermediateMiddleware = require('./lib/initialisers/intermediate-middleware'),
      applicationControllers = require('./lib/initialisers/application-controllers'),
      finalSetup = require('./lib/initialisers/final-setup');

    async.waterfall([
      function checkRootDirectory(callback) {
        fs.exists(rootDirectory, function(exists) {
          if (!exists) {
            return callback(new Error('Root directory is required - ' + rootDirectory + ' does not exists'));
          }
          return callback(null, app, rootDirectory);
        });
      },
      database,
      local,
      nunjucks,
      application,
      initialisers,
      intermediateMiddleware,
      applicationControllers,
      finalSetup,
    ], function(error) {
      applicationCallback(error, app);
    });
  }
};
