/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * file modified by Dhanush
 */

'use strict';

var express = require('express'),
  app       = express(),
  util      = require('util'),
  extend    = util._extend,
  watson    = require('watson-developer-cloud'),
  Q         = require('q'),
  isString  = function (x) { return typeof x === 'string'; };


// Bootstrap application settings
require('./config/express')(app);

var personalityInsights = watson.personality_insights({
  username: '8128fb5d-f708-4922-8c8c-4254da741721',
  password: 'AcD7dI6FwZRk',
  version: 'v2'
});

// Creates a promise-returning function from a Node.js-style function
var getProfile = Q.denodeify(personalityInsights.profile.bind(personalityInsights));

var pi = personalityInsights;

app.get('/', function(req, res) {
  res.render('index', { ct: req._csrfToken });
});

var gp;

app.post('/api/profile/text', function(req, res, next) {
  getProfile(req.body)
    .then(function(response){
        res.json(response[0]);
        gp = response[0];
    })
    .catch(next)
    .done();
});

app.get('/profileAnalysis', function (req, res) {
   res.json(JSON.stringify(gp));
});

// error-handler settings
require('./config/error-handler')(app);

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);

console.log(pi);
console.log(gp);
