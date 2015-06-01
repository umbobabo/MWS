var fs = require('fs'),
    http = require('http'),
    util = require('util'),
    WIFconf = {
      homeURL: 'TheWorldIf',
      dataHost: "localhost:3100",
      landingPath: "data/storytiles.json",
      articlePath: "data"
    };

exports.storytiles = function (req, res) {
  var articleID = req.params.article || null, tilesDataSource = "http://" + WIFconf.dataHost + "/" + WIFconf.landingPath;
  http.get( tilesDataSource , function(res) {
    // Buffer the body entirely for processing as a whole.
    var bodyChunks = [];
    res.on('data', function(chunk) {
      // You can process streamed parts here...
      bodyChunks.push(chunk);
    }).on('end', function() {
      var body = Buffer.concat(bodyChunks);
      var articles = [];
      var data = JSON.parse(body);
      for (var i = 0; i <= data.tiles.length - 1; i++) {
        data.tiles[i].url = '/' + WIFconf.homeURL + '/' + data.tiles[i].id
        //if(articleID!==null){
        //  data.tiles[i].animate = 'animate';
        //}
        articles.push(data.tiles[i]);
      };
      if(articleID!==null){
        // Also if you are on a single article you need to create the tiles
        showArticle(articleID, articles);
      } else {
        outputPage(data.tiles, articleID);
      }
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  });

  function showArticle(articleID, articles){
    // TODO remove the .json at the end when service is ready
    http.get("http://" + WIFconf.dataHost + "/" + WIFconf.articlePath + "/" + articleID + ".json", function(res) {
        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on('data', function(chunk) {
          // You can process streamed parts here...
          bodyChunks.push(chunk);
        }).on('end', function() {
          var body = Buffer.concat(bodyChunks);
          var data = JSON.parse(body);
          outputPage(articles, data.article, articleID);
        })
      }).on('error', function(e) {
        console.log("Got error: " + e.message);
      });
  }

  function outputPage(data, article, articleID){
    var tiles = data, article;
    // 'bower_components',
    hbs.partialsDir = ['mnv/mnv-cmp-masthead/js/tpl/handlebars', 'mnv/mnv-cmp-storytiles-reveal/js/tpl/handlebars'];
    //hbs.partialsDir = ['bower_components'];
    res.render('theWorldIfBody', {
        layout: 'theWorldIf',
        article: article,
        tiles: tiles,
        landingPageUrl: '/' + WIFconf.homeURL,
        className: (article!==null) ? 'article' : 'landing',
        articleID: articleID,
        //"mnv-cmp-footer": footerData['mnv-cmp-footer'],
        "masthead":{
            "title": "The World If",
            "subtitle": "This is a subtitle"
        },
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
}

exports.conf = WIFconf;