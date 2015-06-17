/* Parse a string and replace inline string elements with relative tags */
var parsedStr, re, m, els = [], me = this;

function attributesSplitter(attributes){
  var attributesObj = {};
  attributes.forEach(function(attr){
    var split = attr.split('=');
    attributesObj[split[0]] = split[1];
  });
  return attributesObj;
};

exports.inlineParser = function(){
  // Extract all the content inside square braket
  return me;
}

exports.parseHTML = function(str){
  parsedStr = str;
  // TODO Optimize this RE to catch inline tag that at least contains 1 instance of |
  re = /\[(.*?)[|](.*?)\]/gi;
  while ((m = re.exec(str)) !== null) {
    if (m.index === re.lastIndex) {
        re.lastIndex++;
    }
    els.push({
      "str": m[0],
      "type": m[1],
      "attributes": m[2].split('|')
    });
  }

  for (var i = els.length - 1; i >= 0; i--) {
    var el = els[i];
    parsedStr = parsedStr.replace(el.str, me[el.type](el));
  };
  return parsedStr;
}

// Parse different kinds of object
exports.minerva = function(el){
  var attr, attrTemp = attributesSplitter(el.attributes);
  // Default values
  attr = {
    "project": attrTemp.project || '',
    "className": attrTemp.className || '',
    "id": attrTemp.id || '',
    "version": attrTemp.version || '0.0.1'
  }
  // TODO
  // We have to provide also the version of the widget
  return '<div data-mnv="' + attr.project + '" class="mnv-widget mnv-' + attr.project + attr.className + '" id="' + attr.id + '"></div>\
          <script src="http://cdn.static-economist.com/sites/default/files/external/minerva/' + attr.project + '/' + attr.version + '/init.min.js" type="text/javascript"></script>';
}

exports.image = function(el){
  // We wrap the image on a span tag so we can use pseudo :after and :before to manipulate the DOM directly via CSS
  var attrTemp = attributesSplitter(el.attributes);
  return '<span title="' + attrTemp['title'] + '"><img ' + el.attributes.join(' ') + ' /></span>';
}
// Brightcove video
// [brightcove-player|iid=86839|vid=yryryruyr|linkBaseURL=|autoStart=yes|pid=' + attr.pid + '|key=AQ~~,AAABDH-R__E~,dB4S9tmhdOo20g03jDsDgNBGDcclfHEU|cssclass=|width=595|height=400]
exports['brightcove-player'] = function(el){
  var attr = attributesSplitter(el.attributes);
  return '<object type="application/x-shockwave-flash" data="http://c.brightcove.com/services/viewer/federated_f9?&width=' + attr.width + '&height=' + attr.height + '&flashID=myExperience_' + attr.pid + '_4225569290001&bgcolor=%23FFFFFF&isUI=true&isVid=true&dynamicStreaming=true&autoStart=' + attr.autoStart + '&wmode=opaque&templateLoadHandler=ECOmnitureBrightCoveHandlers1dc2b9b58d1b2e00a7ce606f58d6b793.omnitureBCTemplateLoaded&handlerID=ECOmnitureBrightCoveHandlers1dc2b9b58d1b2e00a7ce606f58d6b793&includeAPI=true&linkBaseURL=' + attr.linkBaseURL + '&iid=' + attr.iid + '&vid=' + attr.vid + '&pid=' + attr.pid + '&key=' + attr.key + '&cssclass=' + attr.cssclass + '&labels=http%3A%2F%2Fcdn.static-economist.com%2Fsites%2Fall%2Fmodules%2Fcustom%2Fec_brightcove%2FEcBcLables.xml&playerID=' + attr.pid + '&playerKey=AQ~~%2CAAABDH-R__E~%2CdB4S9tmhdOo20g03jDsDgNBGDcclfHEU&%40videoPlayer=4225569290001&debuggerID=&startTime=1433347582483" id="myExperience_' + attr.pid + '_4225569290001" width="' + attr.width + '" height="' + attr.height + '" class="BrightcoveExperience" seamlesstabbing="undefined" data-bc-mode="flash"> \
            <param name="allowScriptAccess" value="always"> \
            <param name="allowFullScreen" value="true"> \
            <param name="seamlessTabbing" value="false"> \
            <param name="swliveconnect" value="true"> \
            <param name="wmode" value="opaque"> \
            <param name="quality" value="high"> \
            <param name="bgcolor" value="#FFFFFF"> \
          </object> \
          <script type="text/javascript" src="http://admin.brightcove.com/js/api/SmartPlayerAPI.js"></script>';
}

exports.inline_ad = function(el){
  return '';
}