// TODO remove dependece from $JQuery
function initReveal(){
  var articleActive,
  me = this,
  revealContainer = document.getElementsByClassName('article-reveal-container'),
  close = document.querySelector('.close-btn'),
  articleContainer = document.querySelector('.article-container'),

  tileTarget =  document.querySelector( ".article-reveal-container .article-reveal-tile:last-child" );
  me.el = document.querySelector('.mnv-ec-storytilesreveal');
  me.config = JSON.parse(me.el.getAttribute('data-config'));
  me.pushStateUsed = false;

  tileTarget.addEventListener("transitionend", detectTheEnd, false);
  tileTarget.addEventListener("webkitTransitionEnd", detectTheEnd, false);
  tileTarget.addEventListener("mozTransitionEnd", detectTheEnd, false);
  tileTarget.addEventListener("msTransitionEnd", detectTheEnd, false);
  tileTarget.addEventListener("oTransitionEnd", detectTheEnd, false);

 function preventDefaultClicks(e){
    e.preventDefault();
  }

  function detectTheEnd(e) {
    if (me.hasClass(me.el, 'landing')) {
      emptyArticle();
      me.removeClass(me.el, 'animation-start');
      me.addClass(me.el, 'animation-end');
    }
  }

  me.hasClass = function (el, className){
    if (el.classList)
      return el.classList.contains(className);
    else
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }

  function loadArticle(html) {
    articleContainer.innerHTML = html;
    me.removePreloader();
    me.swapClass(true);
  }

  function handleArticleRequest() {
    me.pushStateUsed = false;
    var id = this.getAttribute('data-id'), path = this.children[0].getAttribute('href');
    me.showArticle(id, path);
    me.removeClass(me.el, 'animation-end');
    me.addClass(me.el, 'animation-start');
  }

  addEventListenerByClass('article-reveal-tile', 'click', handleArticleRequest);
  addEventListenerByClass('article-reveal-tile-link', 'click', preventDefaultClicks);

  function addEventListenerByClass(className, event, fn) {
    var list = document.getElementsByClassName(className);
    for (var i = 0, len = list.length; i < len; i++) {
      list[i].addEventListener(event, fn, false);
    }
  }

  // Manage history changes
  window.onpopstate = function(event) {
    me.pushStateUsed = true;
    if(!event.state){
       me.goLanding();
       return false;
    }
    if(event.state.hasOwnProperty("articleID") && event.state){
      me.showArticle(event.state.articleID, event.state.articlePath);
    } else {
      me.addClass(me.el, 'animation-start');
      me.removeClass(me.el, 'animation-end');
      me.goLanding();
    }
  };

  me.swapClass = function(article){
    if(article){
      me.removeClass(me.el, 'landing');
      me.addClass(me.el, 'article');
    } else {
      me.removeClass(me.el, 'article');
      me.addClass(me.el, 'landing');
    }
  }

  me.showArticle = function(articleID, path){
    if(!articleID){
      // TODO add Error management logic
    } else {
      // Preloader is inherited by Widget base class
      me.addPreloader();
      debugger;
      me.ajax( path + "?output=html&template=partials/theWorldIf/article&data=http://" +  me.config.feed.host + "/" + me.config.feed.articlePath + "/" + articleID , function( html ) {
      // Olad approach with client-side handlebars and data request
        //$.get("http://" +  me.config.feed.host + "/" + me.config.feed.articlePath + "/" + articleID + ".json", function( data ) {
        // Substitute inline element on the body
        //var parser = new inlineParser(data.body + 'ous east of the country, the post-Tiananmen [image|iid=86801|fid=165301|title=|alt=|caption=|use_original_size=|image_link=] deal\u2014stay out of politics and you can do anything you want\u2014is fraying, and [minerva|iid=87948|project=timeline] public outrage at corruption, pollution and other problems grows more vociferous. Yet rather than allow more formal popular participation and move towards the rule of law, China\u2019s leaders are allowing less participation as they crack down on free-thinkers, believing that carrying out real, structural reform is more dangerous than not doing so. In fact the opposite may be true. The deep fissures in the country will be increasingly hard to paper over with mere prosperity.\u003c\/p\u003e\u003cp\u003e\u003cspan\u003e[minerva|project=essay-china-gdp]\u003c\/span\u003e\u003c\/p\u003e\u003cp\u003eIt is not just that seeking to placate the public at home with \u003cem\u003ebraggadocio\u003c\/em\u003e overseas will make it harder still for China to garner allies and respect. There is a deeper problem. Many countries around the world admire, and would like to emulate, the undemocratic but effective way that China has managed its decades of growth. If China\u2019s domestic politics look less stable, some of that admiration will wane. And even if things can be held together, for the time being, admiration for China does not translate into affection for it, or');
        //var body = parser.parseHTML();
        loadArticle(html);
        if(!me.pushStateUsed){
          customHistory.pushState({ articleID: articleID, articlePath: path },"Replace this with the title page", path);
        }
      }, 'text');
    }
  }

  function emptyArticle(){
    articleContainer.innerHTML = '';
    // if(!me.pushStateUsed){
    //   // TODO Replace title with page information
    //   customHistory.pushState({},"Replace this with the title page", "/" + me.config.homeURL);
    // }
  }

  me.goLanding = function(){
    if(!me.pushStateUsed){
      customHistory.pushState({},"Replace this with the title page", "/" + me.config.homeURL);
    }
    me.swapClass(false);
  }

  close.addEventListener("click", function () {
    me.goLanding();
  });
  addEventListenerByClass('close-btn', 'click', preventDefaultClicks);

  return me;
}
// Add inheritance to get the widget preloader
initReveal.prototype = new Widget();

var customHistory = {
  pushState: function(a,b,c){
    if(history && (typeof history.pushState === 'function') ){
      history.pushState(a,b,c);
    }
  }
}

docReady(function(){
  var reveal = new initReveal();
  // Add FTScroller
  containerElement = document.querySelector('.article-reveal-container');
  scroller = new FTScroller(containerElement, {
      scrollbars: false,
      scrollingX: false
  });
  window.addEventListener('resize', scroller.updateDimensions, true);
  // Show article on final URL request
  // If an article is showed on load, wait a second and run the reveal animation
  var articleID = reveal.el.getAttribute("data-article-id"), articlePath = reveal.el.getAttribute("data-article-path");
  if(reveal.hasClass(reveal.el, 'article')){
    setTimeout(function(){
      reveal.showArticle(articleID, articlePath);
    }, 1500);
  } else {
    // TODO Write title from backend configuration
    customHistory.pushState({},"Replace this with the title page", articlePath);
  }
});