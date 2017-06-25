# timeline_table
Timeline tables allow you create complex data show for logs.
![image](https://github.com/doubaozia/timeline_table/blob/master/demo.png)

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
> data is required
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

## Options
|option|type|required|default|comment|
|---|---|---|---|---|
|data|Array|true||data arrays will show|
|dateField|String|false|'date'|the date key name in data|
|pageSizes| Array|false|[10, 20, 30, -1]|the page size array, -1 means show all data|
|showPages|Number|false |5|maximum pages once show|
