var express = require("express"),
    exphbs  = require('express-handlebars'),
    logger = require('express-logger'),
    fs = require('fs');

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

hbs =  exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('/TheWorldIf/:article?', function (req, res) {
  var article = req.params.article || null;
  // Mockup data
  var storytilesData = JSON.parse(fs.readFileSync('data/theWorldIf/storytiles.json', 'utf8'));
  var footerData = JSON.parse(fs.readFileSync('data/footer.json', 'utf8'));
  // End of Mockup data
  hbs.partialsDir = ['bower_components'];
  res.render('theWorldIfBody', {
      layout: 'theWorldIf',
      article: article,
      // TODO Review this part, sucks!
      tile: storytilesData['ec-storytilesreveal-0'].tile,
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
});

app.listen(conf.app.port);

console.log("Minerva WebServer is running on port: " + conf.app.port );