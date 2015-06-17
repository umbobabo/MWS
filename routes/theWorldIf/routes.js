var fs = require('fs'),
    http = require('http'),
    util = require('util'),
    WIFconf = require('./config').config,
    aliasMapping,
    inlineParser = require('../../mnv_modules/inline_parser'),
    me = this;

exports.routes = function(req, res){
  if(req.query.output==='html'){
    me.html(req, res);
  } else {
    me.storytiles(req, res);
  }
}
// Use a specific template with retrieved data
exports.html = function(req, res){
  var response = res;
  http.get(req.query.data, function(res) {
    // Buffer the body entirely for processing as a whole.
    var bodyChunks = [];
    res.on('data', function(chunk) {
      // You can process streamed parts here...
      bodyChunks.push(chunk);
    })
    .on('end', function() {
      var body = Buffer.concat(bodyChunks), data = JSON.parse(body);
      data.article.body = inlineParser.parseHTML(data.article.body);
      // TODO Abstract part related to aticle data
      response.render(req.query.template, {
        article: data.article
      });
    })
  }).on('error', function(e) {
    // TODO manage errors
    console.log("Got error: " + e.message);
  });
}

exports.storytiles = function (req, res) {
  var articleID = null,
  tilesDataSource = "http://" + WIFconf.feed.host + "/" + WIFconf.feed.landingPath,
  aliasMapping = {};
  console.log(tilesDataSource);
  http.get( tilesDataSource , function(res) {
    // Buffer the body entirely for processing as a whole.
    var bodyChunks = [];
    res.on('data', function(chunk) {
      // You can process streamed parts here...
      bodyChunks.push(chunk);
    }).on('end', function() {
      var body = Buffer.concat(bodyChunks);
      var articles = [];
      var data = JSON.parse(body),
      // Default value for landing page
      article = { id: null, path: '/' + WIFconf.homeURL };
      for (var i = 0; i <= data.tiles.length - 1; i++) {
        var alias = data.tiles[i].page.aliasUrl;
        // Add alias to id map
        aliasMapping[alias] = data.tiles[i].id;
        data.tiles[i].url = '/' + WIFconf.homeURL + '/' + alias;
        articles.push(data.tiles[i]);
      };
      // Retrieve the ID from the alias lookup
      if(req.params.alias){
        articleID = aliasMapping[req.params.alias];
      }
      if(articleID!==null){
        article = { id: articleID, path: req.params.alias };
        // Also if you are on a single article you need to create the tiles
        showArticle(article, articles);
      } else {
        outputPage(data, article);
      }
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  });

  function showArticle(article, articles){
    // TODO remove the .json at the end when service is ready
    http.get("http://" + WIFconf.feed.host + "/" + WIFconf.feed.articlePath + "/" + article.id , function(res) {
        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on('data', function(chunk) {
          // You can process streamed parts here...
          bodyChunks.push(chunk);
        })
        .on('end', function() {
          var body = Buffer.concat(bodyChunks), data = JSON.parse(body), art = {
            tiles: articles
          };
          //console.log(util.inspect(data, { showHidden: true, depth: null }));
          data.article.body = inlineParser.parseHTML(data.article.body);
          console.log(util.inspect(data, { showHidden: true, depth: null }));
          outputPage(art , data.article);
        })
      }).on('error', function(e) {
        // TODO manage errors
        console.log("Got error: " + e.message);
      });
  }

  function outputPage(data, article){
    hbs.partialsDir = ['bower_components','views'];
    //console.log(util.inspect(data, { showHidden: true, depth: null }));
    // TODO review and optimise this part
    res.render('theWorldIfBody', {
        layout: 'theWorldIf',
        page: data.page,
        article: article,
        tiles: data.tiles,
        landingPageUrl: '/' + WIFconf.homeURL,
        className: (article.id!==null) ? 'article' : 'landing animation-end',
        WIFconf: JSON.stringify(WIFconf),
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