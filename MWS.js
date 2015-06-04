var express = require("express"),
    exphbs  = require('express-handlebars'),
    logger = require('express-logger'),
    fs = require('fs'),
    http = require('http'),
    bodyParser = require('body-parser'),
    util = require('util'),
    theWorldif = require('./routes/theworldif');

app = express();
hbs =  exphbs.create();

conf = {
  "app": {
    port: 3100
  }
};
// TODO, enforce the use of existing view to prevent crash if a view is not present
//var availableViews = fs.readdirSync('views');

// Serve static bundles
// TODO add production/development ENV var management
// In Production we should serve assets from bower_components folder
// In Development we should serve assets from mnv folder so you can edit server and components easily (But is probably not a good practice)
var env = process.env.NODE_ENV || 'development';
//env = 'production';
app.use('/libs', express.static(__dirname + '/libs'));
// if ('development' == env) {
//   // Development only
//   // In development map resources to minerva widget dev folder
//   app.use('/bower_components', express.static(__dirname + '/mnv'));
// } else {
  app.use('/bower_components', express.static(__dirname + '/bower_components'));
// }

// TODO Implements useful log management
app.use(logger({path: "logs/logs.txt"}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// The world if section
app.get('/' + theWorldif.conf.homeURL + '/:alias?', theWorldif.routes );

// Provide JSON for test purpose
app.get('/data/:pathToFile', function(req, res, next){
  // TODO Check if file exist
  fs.readFile('data/' + req.params.pathToFile , 'utf8', function(err, data){
    if(err){
      return res.send(err);
    } else {
      res.json(JSON.parse(data));
    }
  });
})
// Use this routing just to bypass CORS ISSUE if needed
// Remove it with CORS enabled
// app.get('/article/:nid', function (req, res) {
//   var nid = req.params.nid || null;
//   var response = res;
//   http.get("http://www.economist.com/jsonify/node/" + nid, function(res) {
//     // Buffer the body entirely for processing as a whole.
//     var bodyChunks = [];
//     res.on('data', function(chunk) {
//       // You can process streamed parts here...
//       bodyChunks.push(chunk);
//     }).on('end', function() {
//       var body = Buffer.concat(bodyChunks);
//       var articles = [];
//       var data = JSON.parse(body);
//       // //console.log(util.inspect(data, { showHidden: true, depth: null }));
//       response.json(data);
//     })
//   }).on('error', function(e) {
//     console.log("Got error: " + e.message);
//   });
// });

app.listen(conf.app.port);

console.log("Minerva WebServer is running on port: " + conf.app.port + " in " + env + " mode " );