var fs = require('fs'),
    http = require('http'),
    util = require('util');

exports.storytiles = function (req, res) {
  var articleID = req.params.article || null;
  console.log('Article' + articleID);
  // Mockup data
  //var footerData = JSON.parse(fs.readFileSync('data/footer.json', 'utf8'));
  // Use local file or remote service
  if(false===true){
    // Local version of articles
    fs.readFile('data/theWorldIf/storytiles.json', 'utf8', function(err, data){
      data = JSON.parse(data)
      outputPage(data['ec-storytilesreveal-0'].tile);
    });
  } else {

    http.get("http://" + WIFconf.dataHost + "/jsonify/node/21646922", function(res) {
      // Buffer the body entirely for processing as a whole.
      var bodyChunks = [];
      res.on('data', function(chunk) {
        // You can process streamed parts here...
        bodyChunks.push(chunk);
      }).on('end', function() {
        var body = Buffer.concat(bodyChunks);
        var articles = [];
        var data = JSON.parse(body);
        console.log(data);
        //console.log('Data ' + util.inspect(data, { showHidden: true, depth: null }));
        // TODO Blogs and article provides different object so data mapping should be different for each  type
        for (var i = 0; i <= data.field_hub_article.length - 1; i++) {
          //console.log(data.field_hub_image);
          //console.log('Img ' + i + ' - ' + data.field_hub_image[i]);
          var img = (data.hasOwnProperty('field_hub_image') && data.field_hub_image[i] != null && data.field_hub_image[i] !== undefined && data.field_hub_image[i].hasOwnProperty('filepath')) ? 'http://' + conf.app.mediaHost + '/' + data.field_hub_image[i].filepath : '';
          var article = {
            section: 'This is the section',
            title: data.field_hub_flytitle[i].value,
            rubrik: data.field_hub_headline[i].value,
            image: img,
            type : 'tile-' + data.field_hub_columns[i].value,
            nid: data.field_hub_article[i].nid,
            url: '/' + WIFconf.homeURL + '/' + data.field_hub_article[i].nid,
            animate: (articleID!==null) ? 'animate' : ''
          };
          articles.push(article);
        };
        if(articleID!==null){
          getArticle(articleID, articles);
        } else {
          outputPage(articles, articleID);
        }
      })
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  }

  function getArticle(articleID, articles){
    http.get("http://" + WIFconf.dataHost + "/jsonify/node/" + articleID, function(res) {
        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on('data', function(chunk) {
          // You can process streamed parts here...
          bodyChunks.push(chunk);
        }).on('end', function() {
          var body = Buffer.concat(bodyChunks);
          var data = JSON.parse(body);
          console.log('Article data ' + data);
          outputPage(articles, data);
        })
      }).on('error', function(e) {
        console.log("Got error: " + e.message);
      });
  }

  function outputPage(data, article){
    var tiles = data, article;
    // 'bower_components',
    hbs.partialsDir = ['mnv/mnv-cmp-storytiles-reveal/js/tpl/handlebars'];
    //hbs.partialsDir = ['bower_components'];
    res.render('theWorldIfBody', {
        layout: 'theWorldIf',
        article: article,
        tile: tiles,
        className: (article!==null) ? 'article' : 'landing',
        //"mnv-cmp-footer": footerData['mnv-cmp-footer'],
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

var WIFconf = {
  homeURL: 'TheWorldIf',
  dataHost: "local.demo.economist.com"
    //var host = "www.economist.com";
};

exports.conf = WIFconf;