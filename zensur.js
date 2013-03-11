(function() {
  // states
  // 0: uncensored
  // 1: start_censor
  // 2: censored
  // state transition probabilities:
  var p_trans = [
    // x     uncensored   -> uncensored
    0.08, // uncensored   -> start_censor
    // 0     uncensored   -> censored
    // 0     start_censor -> uncensored
    // 0     start_censor -> start_censor
    // 1     start_censor -> censored
    0.55, // censored   -> uncensored
    // 0     censored   -> start_censor
    // x     censored   -> censored
  ];
  var censored_tag = "span";
  var censored_class = "censored";
  var start_censor = "<" + censored_tag + " class=\"" + censored_class + "\">";
  var stop_censor = "</" + censored_tag + ">";
  var re_censor = /[0-9A-Za-z]/;
  var isCensored = true;
  var censoredElements = [];

  function splitWords(text) {
    // some older IEs don't suppport capturing parentheses
    // return text.split(/([\t\n\r ])/);
    if (text.length === 0) {
      return [""];
    }
    var words = [];
    var last_i = 0;
    for (var i = 0; i < text.length; i++) {
      switch(text[i]) {
        case '\t':
        case '\n':
        case '\r':
        case ' ':
          if (last_i !== i) {
            words.push(text.slice(last_i, i));
          }
          words.push(text[i]);
          last_i = i + 1;
      }
    }
    if (last_i !== text.length) {
      words.push(text.slice(last_i));
    }
    return words;
  }

  function censorWord(state, word) {
    // ignore words not containing letters (may be spaces only)
    if (!word.match(re_censor)) {
      return word;
    }

    var r = Math.random();
    var prefix = "";
    var suffix = "";

    if (state.s === 1) {
      // start_censor -> censored
      state.s = 2;
      prefix = start_censor;
    }

    if (state.s === 0 && r < p_trans[0]) {
      // uncensored -> start_censor
      state.s = 1;
    }
    else if (state.s === 2 && r < p_trans[1]) {
      // censored -> uncensored
      state.s = 0;
      suffix = stop_censor;
    }

    return prefix + word + suffix;
  }

  function censorTextNode(node) {
    var state = { s: 0 };
    if (Math.random() < p_trans[0]) {
      // start_censor
      state.s = 1;
    }
    var words = splitWords(node.nodeValue);
    for (var i in words) {
      words[i] = censorWord(state, words[i]);
    }
    if (state.s === 2) {
      words[words.length-1] = words[words.length-1] + stop_censor;
    }
    var newnode = document.createElement(censored_tag);
    newnode.innerHTML = words.join("");
    return newnode;
  }

  function censorElement(element, on) {
    var childs = element.childNodes;
    var uncensored = false;
    for (var i in childs) {

      if (childs[i].nodeType === 1 &&
          childs[i].nodeName !== "OPTION" &&
          childs[i].nodeName !== "SCRIPT" &&
          childs[i].nodeName !== "SELECT" &&
          childs[i].nodeName !== "STYLE" &&
          childs[i].nodeName !== "TEXTAREA" &&
          childs[i].nodeName !== "TITLE")
      {
        if (!on &&
            childs[i].nodeName === censored_tag.toUpperCase() &&
            childs[i].className === censored_class &&
            childs[i].childNodes.length === 1)
        {
          uncensored = true;
          element.replaceChild(childs[i].childNodes[0], childs[i]);
        }

        var childUncensored = censorElement(childs[i], on);
        if (!on && childUncensored)
        {
          var newnode = document.createTextNode("");
          for (var j in childs[i].childNodes) {
            if (!childs[i].childNodes[j].nodeType === 3) {
              return;
            }
            if (childs[i].childNodes[j].nodeValue) {
              newnode.nodeValue += childs[i].childNodes[j].nodeValue;
            }
          }
          element.replaceChild(newnode, childs[i]);
        }
      }

      else if (on &&
          childs[i].nodeType === 3 &&
          childs[i].nodeValue.match(re_censor))
      {
        element.replaceChild(censorTextNode(childs[i]), childs[i]);
      }

    }

    return uncensored;
  }

  function doCensor(on) {
    for (var i in censoredElements) {
      censorElement(censoredElements[i], on);
    }
  }

  window.zensurjs = function(arg) {
    if (arg === undefined) {
      isCensored = !isCensored;
      doCensor(isCensored);
    }
    else {
      censoredElements.push(arg);
      if (isCensored) {
        censorElement(arg, true);
      }
    }
    return isCensored;
  };
})();
