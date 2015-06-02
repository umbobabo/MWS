// TODO remove dependeci from $JQuery

function initReveal(){
  var articleActive,
  me = this,
  revealContainer = document.getElementsByClassName('article-reveal-container'),
  close = document.querySelector('.close-btn'),
  tile = document.getElementsByClassName('artical-reveal-tile'),
  articleContainer = document.querySelector('.article-container'),

  tileTarget =  document.querySelector( ".article-reveal-container ul li:last-child" );
  me.el = document.querySelector('.mnv-ec-storytilesreveal');
  me.config = JSON.parse($(me.el).attr('data-config'));
  me.pushStateUsed = false;

  tileTarget.addEventListener("transitionend", detectTheEnd, false);
  tileTarget.addEventListener("webkitTransitionEnd", detectTheEnd, false);
  tileTarget.addEventListener("mozTransitionEnd", detectTheEnd, false);
  tileTarget.addEventListener("msTransitionEnd", detectTheEnd, false);
  tileTarget.addEventListener("oTransitionEnd", detectTheEnd, false);

  preventDefaultClicks();

  function preventDefaultClicks(){
    $('.artical-reveal-tile a, .close-btn').on('click', function(e){
      e.preventDefault();
    });
  }


  function resetTransitionDelay() {
    for (var i = 0; i <= totalOfVals; i++) {
      $( ".artical-reveal-tile:eq(" + [i] + ")" ).css( "transition-delay", (0.0) + "s" );
    }
  }


  function detectTheEnd(e) {
    if (e.propertyName == "opacity") {
      if(articleActive === true){
        revealContainer[0].classList.add('inactive');
        resetTransitionDelay();
      } else {
        emptyArticle();
      }
    }
  }

  function loadArticle(data) {
    var tmp = Handlebars.templates['article'];
    var html = tmp(data);
    $(articleContainer).html(html);
    me.removePreloader();
    goRevealAnimation();
    me.swapClass(true);
  }

  function triggerReverse(){
    for (var i = 0; i <= revNumber.length; i++) {
      $( ".artical-reveal-tile:eq(" + revNumber[i] + ")" )
      .toggleClass( "animate" )
      .css( "transition-delay", (0.1 *i) + "s" );
    }
  }

  function triggerForwards(){
    for (var i = 0; i <= forNumber.length; i++) {
      $( ".artical-reveal-tile:eq(" + forNumber[i] + ")" )
      .toggleClass( "animate" )
      .css( "transition-delay", (0.1 *i) + "s" );
    }
  }

  totalOfVals = $('.artical-reveal-tile').length;


  $('.artical-reveal-tile').bind('click', function() {
    var id = $(this).attr('data-id'), path = $('a', this).attr('href');
    me.showArticle(id, path);
  });

  // Manage history changes
  window.onpopstate = function(event) {
    me.pushStateUsed = true;
    if(event.state.hasOwnProperty("articleID")){
      me.showArticle(event.state.articleID, event.state.articlePath);
    } else {
      me.goLanding();
    }
    this.pushStateUsed = false;
  };

  me.swapClass = function(article){
    if(article){
      $(me.el).removeClass('landing');
      $(me.el).addClass('article');
    } else {
      $(me.el).removeClass('article');
      $(me.el).addClass('landing');
    }
  }

  me.showArticle = function(articleID, path){
    if(!articleID){
      // TODO add Error management logic
    } else {
      me.addPreloader();
      $.get("http://" +  me.config.feed.host + "/" + me.config.feed.articlePath + "/" + articleID + ".json", function( data ) {
        // Substitute inline element on the body
        //var parser = new inlineParser(data.body + 'ous east of the country, the post-Tiananmen [image|iid=86801|fid=165301|title=|alt=|caption=|use_original_size=|image_link=] deal\u2014stay out of politics and you can do anything you want\u2014is fraying, and [minerva|iid=87948|project=timeline] public outrage at corruption, pollution and other problems grows more vociferous. Yet rather than allow more formal popular participation and move towards the rule of law, China\u2019s leaders are allowing less participation as they crack down on free-thinkers, believing that carrying out real, structural reform is more dangerous than not doing so. In fact the opposite may be true. The deep fissures in the country will be increasingly hard to paper over with mere prosperity.\u003c\/p\u003e\u003cp\u003e\u003cspan\u003e[minerva|project=essay-china-gdp]\u003c\/span\u003e\u003c\/p\u003e\u003cp\u003eIt is not just that seeking to placate the public at home with \u003cem\u003ebraggadocio\u003c\/em\u003e overseas will make it harder still for China to garner allies and respect. There is a deeper problem. Many countries around the world admire, and would like to emulate, the undemocratic but effective way that China has managed its decades of growth. If China\u2019s domestic politics look less stable, some of that admiration will wane. And even if things can be held together, for the time being, admiration for China does not translate into affection for it, or');
        //var body = parser.parseHTML();
        loadArticle(data);
      })
      .fail(function() {
        // TODO add error management
      })
      .done(function(data) {
        // TODO complete this wit page information and do it DRY
        if(!me.pushStateUsed){
          history.pushState({ articleID: articleID, articlePath: path },"Replace this with the title page", path);
        }
      });
    }
  }

  function goRevealAnimation(){
    $(this).toggleClass("animate");

    articleActive = !articleActive;

    if (articleActive === false){
      revealContainer[0].classList.add('active');
    }

    indexVal = $( ".artical-reveal-tile" ).index( $(this) );

    revNumber = [];
    forNumber = [];

    indexValBelow = indexVal - 1;

    for (var i = indexValBelow; i >= 0 ; i--) {
      // console.log("i from below: " +  i);
      revNumber.push(i);
    };

    //loop through above and add animating class;
    for (var i = (indexVal+1); i < totalOfVals; i++) {
      forNumber.push(i);
      // console.log(forNumber);
    };


    triggerReverse();
    triggerForwards();
  }

  function emptyArticle(){
    articleContainer.innerHTML = '';
    if(!me.pushStateUsed){
      // TODO Replace title with page information
      history.pushState({},"Replace this with the title page", me.config.homeURL);
    }
  }

  me.goLanding = function(){
    if (articleActive === true){
      revealContainer[0].classList.remove('inactive');
      revealContainer[0].classList.add('active');
      for (var i = 0; i <= (tile.length-1); i++) {
        tile[i].classList.toggle('animate');
      }
    } else if(articleActive === false){
      revealContainer[0].classList.remove('active');
    }
    me.swapClass(false);
    articleActive = !articleActive;
  }

  close.addEventListener("click", function () {
    me.goLanding();
  });

  return me;
}

initReveal.prototype = new Widget();

docReady(function(){
  var reveal = new initReveal();
  // Show article on final URL request
  // If an article is showed on load, wait a second and run the reveal animation
  var articleID = $(reveal.el).attr("data-article-id"), articlePath = $(reveal.el).attr("data-article-path");
  if($(reveal.el).hasClass('article')){
    setTimeout(function(){
      reveal.showArticle(articleID, articlePath);
    }, 1500);
  } else {
    // TODO Write title from backend configuration
    history.pushState({},"Replace this with the title page", articlePath);
  }
});