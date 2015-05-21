var express = require("express"),
    exphbs  = require('express-handlebars'),
    logger = require('express-logger'),
    fs = require('fs');

var app = express(), hbs;

var conf = {
  "app": {
    port: 3100,
    repoFolder: "mnv"
  },
  "templates": {
    "folder": "dist/tpl"
  }
};

var data = {
   "company-info":[
      {
         "link_title":"Advertise",
         "link_path":"http:\/\/www.economistgroupmedia.com\/"
      },
      {
         "link_title":"Reprints",
         "link_path":"http:\/\/www.economist.com\/rights\/"
      },
      {
         "link_title":"Careers",
         "link_path":"http:\/\/www.economistgroupcareers.com\/"
      },
      {
         "link_title":"Editorial staff",
         "link_path":"http:\/\/www.economist.com\/mediadirectory"
      },
      {
         "link_title":"Site Map",
         "link_path":"http:\/\/www.economist.com\/content\/site-index"
      },
      {
         "link_title":"The Economist Group",
         "link_path":"http:\/\/www.economistgroup.com\/"
      }
   ],
   "contact":[
      {
         "link_title":"Subscribe",
         "link_path":"http:\/\/www.economist.com\/products\/subscribe"
      },
      {
         "link_title":"Contact us",
         "link_path":"http:\/\/www.economist.com\/contact-info"
      },
      {
         "link_title":"Help",
         "link_path":"http:\/\/www.economist.com\/help\/home"
      }
   ],
   "legal":[
      {
         "link_title":"Accessibility",
         "link_path":"http:\/\/www.economist.com\/help\/accessibilitypolicy"
      },
      {
         "link_title":"Cookies",
         "link_path":"http:\/\/www.economist.com\/cookies-info"
      },
      {
         "link_title":"Privacy",
         "link_path":"http:\/\/www.economistgroup.com\/results_and_governance\/governance\/privacy"
      },
      {
         "link_title":"Terms of use",
         "link_path":"http:\/\/www.economist.com\/legal\/terms-of-use"
      }
   ],
   "social-header":[
      {
         "title":"Follow us"
      }
   ],
   "social-channel":[
      {
         "social_icon":"icon-facebook3",
         "social_link_path":"https:\/\/www.facebook.com\/TheEconomist\/"
      },
      {
         "social_icon":"icon-twitter3",
         "social_link_path":"https:\/\/twitter.com\/TheEconomist\/"
      },
      {
         "social_icon":"icon-feed4",
         "social_link_path":"http:\/\/www.economist.com\/rss\/"
      },
      {
         "social_icon":"icon-mail",
         "social_link_path":"https:\/\/twitter.com\/TheEconomist\/"
      },
      {
         "social_icon":"icon-google-plus3",
         "social_link_path":"https:\/\/plus.google.com\/+TheEconomist\/posts\/"
      },
      {
         "social_icon":"icon-youtube3",
         "social_link_path":"http:\/\/www.youtube.com\/user\/economistmagazine\/"
      },
      {
         "social_icon":"icon-linkedin",
         "social_link_path":"http:\/\/www.linkedin.com\/groups\/Economist-official-group-Economist-newspaper-3056216\/"
      },
      {
         "social_icon":"icon-pinterest",
         "social_link_path":"http:\/\/www.pinterest.com\/theeconomist\/"
      }
   ]
};

var availableViews = fs.readdirSync('views');
// Serve static bundles
app.use('/bundles', express.static(__dirname + '/bundles'));
// TODO Implements useful log management
app.use(logger({path: "logs/logs.txt"}));

hbs =  exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('/TheWorldIf/:article', function (req, res) {
  res.render('theWorldIfBody', {
      layout: 'theWorldIf',
      article: article
    });
});

app.listen(conf.app.port);

console.log("Minerva WebServer is running on port: " + conf.app.port );