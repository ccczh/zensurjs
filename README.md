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

You may also add a link for toggling the censorship like this:
```html
<a href="" onclick="zensurjs(); return false;">Toggle Censorship for this page!</a>
```
