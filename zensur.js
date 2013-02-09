function zensurjs() {
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
  var start_censor = "<span class=\"censored\">";
  var stop_censor = "</span>";
  var re_censor = /[0-9A-Za-z]/;

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
    var words = node.nodeValue.split(/([\t\n\r ])/);
    for (var i in words) {
      words[i] = censorWord(state, words[i]);
    }
    if (state.s === 2) {
      words[words.length-1] = words[words.length-1] + stop_censor;
    }
    var newnode = document.createElement("span");
    newnode.innerHTML = words.join("");
    return newnode;
  }

  function censorElement(element) {
    var childs = element.childNodes;
    for (var i in childs) {
      if (childs[i].nodeType === 1 &&
          childs[i].nodeName !== "OPTION" &&
          childs[i].nodeName !== "SCRIPT" &&
          childs[i].nodeName !== "SELECT" &&
          childs[i].nodeName !== "STYLE" &&
          childs[i].nodeName !== "TEXTAREA" &&
          childs[i].nodeName !== "TITLE")
      {
        censorElement(childs[i]);
      }
      else if (childs[i].nodeType === 3 &&
          childs[i].nodeValue.match(re_censor))
      {
        element.replaceChild(censorTextNode(childs[i]), childs[i]);
      }
    }
  }

  return censorElement;
}
