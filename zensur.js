var zensur = {

  // states
  // 0: uncensored
  // 1: start_censor
  // 2: censored
  // state transition probabilities:
  p_trans: [
    // x     uncensored   -> uncensored
    0.08, // uncensored   -> start_censor
    // 0     uncensored   -> censored
    // 0     start_censor -> uncensored
    // 0     start_censor -> start_censor
    // 1     start_censor -> censored
    0.55, // censored   -> uncensored
    // 0     censored   -> start_censor
    // x     censored   -> censored
  ],
  start_censor: "<span class=\"censored\">",
  stop_censor: "</span>",

  censorWord: function(state, word) {
    // ignore words not containing letters (may be spaces only)
    if (!word.match(/[0-9A-Za-z]/)) {
      return word;
    }

    var r = Math.random();
    var prefix = "";
    var suffix = "";

    if (state.s === 1) {
      // start_censor -> censored
      state.s = 2;
      prefix = this.start_censor;
    }

    if (state.s === 0 && r < this.p_trans[0]) {
      // uncensored -> start_censor
      state.s = 1;
    }
    else if (state.s === 2 && r < this.p_trans[1]) {
      // censored -> uncensored
      state.s = 0;
      suffix = this.stop_censor;
    }

    return prefix + word + suffix;
  },

  censorElement: function(element) {
    var state = { s: 0 };
    var words = element.innerHTML.split(/([\t\n\r ])/);
    for (var i in words) {
      words[i] = this.censorWord(state, words[i]);
    }
    if (state.s === 2) {
      words[words.length-1] = words[words.length-1] + this.stop_censor;
    }
    element.innerHTML = words.join("");
  },

  censor: function() {
    var elements = document.getElementsByTagName("p");
    for (var i in elements) {
      if (elements[i].children && elements[i].children.length === 0) {
        this.censorElement(elements[i]);
      }
    }
  },

};
