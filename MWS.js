var express = require("express"),
    exphbs  = require('express-handlebars'),
    logger = require('express-logger'),
    fs = require('fs'),
    http = require('http'),
    bodyParser = require('body-parser'),
    util = require('util');

var app = express(), hbs;

var conf = {
  "app": {
    port: 3100
  }
};

var availableViews = fs.readdirSync('views');
// Serve static bundles
app.use('/bower_components', express.static(__dirname + '/bower_components'));
// TODO Implements useful log management
app.use(logger({path: "logs/logs.txt"}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

hbs =  exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('/TheWorldIf/:article?', function (req, res) {
  var article = req.params.article || null;
  // Mockup data
  var footerData = JSON.parse(fs.readFileSync('data/footer.json', 'utf8'));
  // Use local file or remote service
  if(true!==true){
    // Local version of articles
    fs.readFile('data/theWorldIf/storytiles.json', 'utf8', function(err, data){
      data = JSON.parse(data)
      outputPage(data['ec-storytilesreveal-0'].tile);
    });
  } else {
    http.get("http://www.economist.com/jsonify/node/21646922", function(res) {
      // Buffer the body entirely for processing as a whole.
      var bodyChunks = [];
      res.on('data', function(chunk) {
        // You can process streamed parts here...
        bodyChunks.push(chunk);
      }).on('end', function() {
        var body = Buffer.concat(bodyChunks);
        var articles = [];
        var data = JSON.parse(body);
        // //console.log(util.inspect(data, { showHidden: true, depth: null }));
        for (var i = data.field_hub_article.length - 1; i >= 0; i--) {
          var img = (data.field_hub_image[i] !== null && data.field_hub_image[i].filepath) ? 'http://www.economist.com/' + data.field_hub_image[i].filepath : '';
          var article = {
            section: 'This is the section',
            title: data.field_hub_flytitle[i].value,
            rubrik: data.field_hub_headline[i].value,
            image: img,
            type : 'cover'
          };
          articles.push(article);
        };
        outputPage(articles);
      })
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  }

  function outputPage(data){
    var articles = data;

    hbs.partialsDir = ['bower_components'];
    res.render('theWorldIfBody', {
        layout: 'theWorldIf',
        article: article,
        tile: articles,
        "mnv-cmp-footer": footerData['mnv-cmp-footer'],
        helpers: {
          ifvalue: function(conditional, options) {
            if (conditional == options.hash.equals) {
              return options.fn(this);
            } else {
              return options.inverse(this);
            }
          }
        }
      });
  }
});

app.listen(conf.app.port);

console.log("Minerva WebServer is running on port: " + conf.app.port );