# timeline_table
Timeline tables allow you create complex data show for logs.

## Quick start

1. include the css file in the html head
```
<link rel="stylesheet" href=".../timelinetable.min.css">
```
2. include the js file in before the end of body tag
```
<script src=".../timelinetable.min.js"></script>
```
3. create the container with a id attribute
```
<div id="tlt-container"></div>
```
4. initialise
```
  var data = [];
  for (var i = 0; i < 100; i++) {
    data.push({
      date: '2017-06-01 00:00:00',
      desc: '描述文字' + (i + 1),
      detail: '详细内容' + (i + 1)
    });
  }
  var tlt = new TimeLineTable(document.getElementById('tlt-container'), {
    data: data
  });
```
