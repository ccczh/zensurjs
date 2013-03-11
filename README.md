zensurjs
========

Automatically censor random parts of your website.

Installation
------------

*   Download [zensur.js](zensur.js) and upload it to your webspace.
    *   For security and privacy reasons please don't hotlink the file from somewhere else.
*   Insert the code snippet below to the header (or somewhere else) of your HTML document.
    *   You may also move the stylesheet to your CSS file and customize it to your needs.

```html
<style type="text/css">
  .censored { color: black; background-color: black; }
</style>
<script type="text/javascript" src="zensur.js"></script>
<script type="text/javascript">
  window.onload = function() { zensurjs(document.body); };
</script>
```

Usage
-----

### Banner with "Censorship off" button (simple HTML page with NO anchors)

The following is an usage example for a "censored" webpage with a banner and a
censored part following it. It has a link that switches off censorship (the
main content is displayed without censored words and the link disappears). In this
example it also "uncensors" parts of the banner text.

**Please note that this will only work correct for webpages that do not use own
hashed anchor tags!**

* The header part is a bit more complex:

```html
<style type="text/css">
  .censored { color: black; background-color: black; }
</style>
<script type="text/javascript" src="zensur.js"></script>
<script type="text/javascript">
  var zensurMode = (window.location.hash != "#ZENSUROFF");
  window.onload = function() {
    if (zensurMode) {
      zensurjs(document.getElementById("content"));
      document.getElementById("oppose").style.display = "block";
    } else {
      document.getElementById("banner_censored").setAttribute ("class", "");
    }
  }
  function zensurAus() {
    window.location.hash = "ZENSUROFF";
    window.location.reload();
  }
</script>
```

* The body part should look like this (of course you will modify the banner text;
this is just an example):

```html
<body>
  :
  <div id="banner" style="margin:20px; outline: 1px solid black; padding:10px; background-color:#FFFFF0;">
    <p style="color: red; font-size: 30px; line-height:50px;">
      March, 12<sup>th</sup>, 2013 is the
      <a href="http://march12.rsf.org/en/" target="_blank">"World Day Against Cyber Censorship"</a>
      and this website is dedicated to a free, open and uncensored Internet for everyone on this planet!
    </p>
    <p style="font-size: 30px; line-height:50px;">
      The really bad thing about censorship is that
      <span id="banner_censored" class="censored">you can't read what you need to know</span>!
    </p>
    <p id="oppose" style="color:red; font-size:30px; line-height:50px; display:none;">
      <a href="#"  onClick="zensurAus()">Click here if you oppose censorship!</a>
    <p>
  </div>
  <div id="content">
  :
  </div>
  :
</body>
```
