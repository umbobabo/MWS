/* Parse a string and replace inline string elements with relative tags */
function inlineParser(str){
  var parsedStr = str, re, m, els = [], me = this;
  // TODO Optimize this RE to catch inline tag that at least contains 1 instance of |
  me.parseHTML = function(){
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

  function attributesSplitter(attributes){
    var attributesObj = {};
    attributes.forEach(function(attr){
      var split = attr.split('=');
      attributesObj[split[0]] = split[1];
    });
    return attributesObj;
  };
  // Parse different kinds of object
  me.minerva = function(el){
    var attr, attrTemp = attributesSplitter(el.attributes);
    // Default values
    attr = {
      "project": attrTemp.project || '',
      "className": attrTemp.className || '',
      "id": attrTemp.id || ''
    }
    return '<div data-mnv="' + attr.project + '" class="mnv-widget mnv-' + attr.project + attr.className + '" id="' + attr.id + '"></div>';
  }

  me.image = function(el){
    return '<img ' + el.attributes.join(' ') + ' />';
  }
  // Brightcove video
  me.inline = function(el){
    return '';
  }

  me.inline_ad = function(el){
    return '';
  }
  // Extract all the content inside square braket
  return me;
}