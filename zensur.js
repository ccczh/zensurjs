var zensur = {

  // states
  // 0: uncensored0 -> 1: uncensored1 -> 2: censored -> 0: uncensored0
  // state transition probabilities:
  p_trans: [
    // 0     uncensored0 -> uncensored0
    // 1     uncensored0 -> uncensored1
    // 0     uncensored0 -> censored
    0.02, // uncensored1 -> uncensored0
    // x     uncensored1 -> uncensored1
    0.08, // uncensored1 -> censored
    0.7,  // censored    -> uncensored0
    // 0     censored    -> uncensored1
    // x     censored    -> censored
  ],
  start_censor: "<span class=\"censored\">",
  stop_censor: "</span>",

  censorWord: function(state, word) {
    if (!word.match(/[0-9A-Za-z]/)) {
      return word;
    }
    if (state.s === 0) {
      // uncensored0 -> uncensored1
      state.s = 1;
      return word;
    }
    var r = Math.random();
    if (state.s === 1 && r < this.p_trans[0]) {
      // uncensored1 -> uncensored0
      state.s = 2;
      return this.start_censor + word + this.stop_censor;
    }
    else if (state.s === 1 && r < this.p_trans[0] + this.p_trans[1]) {
      // uncensored1 -> censored
      state.s = 2;
      return this.start_censor + word;
    }
    else if (state.s === 2 && r < this.p_trans[2]) {
      // censored -> uncensored0
      state.s = 0;
      return word + this.stop_censor;
    }
    return word;
  },

  censorElement: function(element) {
    var state = { s: 1 };
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
