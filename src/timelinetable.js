'use strict';

/**
 * utils
 */

var _utils = {
  crtElm: function(name, opts, child) {
    var e = document.createElement(name);
    if (opts) {
      if (typeof opts === 'string') {
        e.className = opts;
        return e;
      }
      for (var k in opts) {
        e.key = opts[ k ];
      }
    }
    if (child) {
      e.appendChild(child);
    }
    return e;
  },
  /*
   * HTML generator functions
   */

  wrapTd: function(title, desc, detail) {
    var item = '<div class="item">' + detail + '</div>';
    var detailBox = '<div class="detail hide">' + item + '</div>';
    var arrowDown = '<i class="tlt-arrow-down"></i>';
    if (title) {
      return '<td class="item"><span class="title">' + title + '：' + '</span><span class="value">' + desc + '</span>' + arrowDown + detailBox + '</td>';
    } else {
      return '<td class="item">' + desc + arrowDown + detailBox + '</td>';
    }
  },

  wrapDateTd: function(value) {
    return '<td class="item date">' + value.replace(' ', '<br>') + '</td>';
  },

  wrapTr: function(value) {
    return '<tr class="log-row">' + value + '</tr>';
  },

  wrapPage: function(page, isActive) {
    var active = isActive ? 'active' : '';
    return '<li class="page ' + active + '"><a>' + page + '</a></li>';
  },

  wrapPageNav: function(direction, isDisabled) {
    var directionText = '';
    if (direction === 'prev') {
      directionText = '← 前一页';
    }
    if (direction === 'next') {
      directionText = '后一页 → ';
    }
    var disabled = isDisabled ? 'disabled' : '';
    return '<li class="' + direction + ' ' + disabled + '"><a>' + directionText + '</a></li>';
  },

  wrapPageSize: function(curPageSize, pageSizes) {
    return '<label class="tlt-pagesize-label">' +
      '每页显示' +
      '<select>' +
      pageSizes.map(function(value) {
        var selected = value === curPageSize ? 'selected' : '';
        if (value < 0) {
          return '<option value="' + value + '" ' + selected + '>全部</option>';
        }
        return '<option value="' + value + '" ' + selected + '>' + value + '</option>';
      }).join('') +
      '</select>' +
      '条' +
      '</label>';
  },

  wrapPageRow: function(total, prevLi, pageLi, nextLi, pageSizeSelect) {
    return '<div class="col-lg-4">' +
      '<div class="tlt-page-info">共' + total + '条记录</div>' +
      '</div>' +
      '<div class="col-lg-8">' +
      '<div class="tlt-pagination">' +
      '<ul>' + prevLi + pageLi + nextLi + '</ul>' +
      '</div>' +
      pageSizeSelect +
      '</div>';
  }
};

/**
 * TimeLineTable
 * @param container
 * @param opts
 */

var TimeLineTable = function(container, opts) {

  this.container = container;

  this.tContainer = _utils.crtElm('div', 'tlt-table-container');

  this.table = _utils.crtElm('table', 'tlt-table');

  this.pContainer = _utils.crtElm('div', 'tlt-page-container');

  this.options = {};
  for (var k in TimeLineTable.defaultOptions) {
    this.options[ k ] = TimeLineTable.defaultOptions[ k ];
  }
  for (var k in opts) {
    this.options[ k ] = opts[ k ];
  }

  if (opts.data) {
    this.data = opts.data;
  } else {
    console.warn('The second parameter must contain a \'data\' property!');
  }

  this.pageSize = this.options.pageSizes[ 0 ];
  this.curPage = 1;

  this._init();
};

TimeLineTable.prototype = {
  constructor: TimeLineTable,
  _init: function() {
    this.setup();
    this.update();
  },
  setup: function() {
    var wrap = _utils.crtElm('div', 'log-list');
    this.tContainer.appendChild(wrap);
    wrap.appendChild(this.table);
    this.container.appendChild(this.tContainer);
    this.container.appendChild(this.pContainer);
  },
  update: function() {
    this.updateTable();
    this.updatePaging();
  },
  updateTable: function() {
    var timeline = this;
    var rows = '';
    var data = this.options.data;
    var pageStartIndex = this._pageInfo().pageStartIndex;
    var pageEndIndex = this._pageInfo().pageEndIndex;
    var dateField = this.options.dateField;

    if (!timeline.table.querySelector('thead')) {
      timeline.table.appendChild(_utils.crtElm('thead'));
    }
    if (!timeline.table.querySelector('tbody')) {
      timeline.table.appendChild(_utils.crtElm('tbody'));
    }
    var body = timeline.table.querySelector('tbody');

    //append data
    for (var i = pageStartIndex; i < pageEndIndex; i++) {
      if (!data[ i ]) break;
      var row = '';
      if (dateField) {
        row += _utils.wrapDateTd(data[ i ][ this.options.dateField ]);
      }
      row += _utils.wrapTd('', data[ i ].desc, data[ i ].detail);
      rows += _utils.wrapTr(row);
    }
    body.innerHTML = rows;
  },
  updatePaging: function() {
    var prevLi;
    var nextLi;
    var pageLi = '';

    var pageSize = this._pageInfo().pageSize;
    var pageCount = this._pageInfo().pageCount;
    var page = this._pageInfo().page;
    var dataCount = this._pageInfo().dataCount;
    var pageStart = this._pageInfo().pageStart;
    var pageEnd = this._pageInfo().pageEnd;

    var pageSizeSelect = _utils.wrapPageSize(pageSize, this.options.pageSizes);

    if (page === 1 || pageCount === 0) {
      prevLi = _utils.wrapPageNav('prev', true);
    } else {
      prevLi = _utils.wrapPageNav('prev', false);
    }

    if (page === pageCount || pageCount === 0) {
      nextLi = _utils.wrapPageNav('next', true);
    } else {
      nextLi = _utils.wrapPageNav('next', false);
    }

    for (var i = pageStart; i <= pageEnd; i++) {
      if (page === i) {
        pageLi += _utils.wrapPage(i, true);
      } else {
        pageLi += _utils.wrapPage(i, false);
      }
    }

    this.pContainer.innerHTML = _utils.wrapPageRow(dataCount, prevLi, pageLi, nextLi, pageSizeSelect);
    this._registerEvent();
  },
  destroy: function() {
    var tbody = this.table.querySelector('tbody');
    var pageContainer = this.container.querySelector('.p-container');
    this.table.removeChild(tbody);
    this.container.removeChild(pageContainer);
  },
  _registerEvent: function() {
    var pageSizeSelect = this.container.querySelector('.tlt-pagesize-label select');
    var prevBtn = this.container.querySelector('.tlt-pagination .prev');
    var nextBtn = this.container.querySelector('.tlt-pagination .next');
    var pageBtn = this.container.querySelectorAll('.tlt-pagination .page');
    var arrow = this.container.querySelectorAll('.log-row i');

    var timeline = this;
    var page;

    pageSizeSelect.addEventListener('change', function(e) {

      var pageSize = parseInt(e.target.value);

      timeline.pageSize = pageSize;
      timeline.curPage = 1;
      timeline.update();
    }, false);

    prevBtn.addEventListener('click', function() {
      if (timeline.curPage === 1) {
        return;
      }
      timeline.curPage--;
      timeline.update();
    }, false);
    nextBtn.addEventListener('click', function() {
      var pageCount = timeline._pageInfo().pageCount;

      if (timeline.curPage === pageCount) {
        return;
      }
      timeline.curPage++;
      timeline.update();
    }, false);
    pageBtn.forEach(function(e) {
      var p = parseInt(e.querySelector('a').innerText);
      e.addEventListener('click', function() {

        timeline.curPage = p;
        timeline.update();
      }, false);
    });
    arrow.forEach(function(e) {
      e.addEventListener('click', function() {
        var detail = e.parentElement.querySelector('.detail');
        if (e.className === 'tlt-arrow-down') {
          e.className = 'tlt-arrow-up';
          detail.className = 'detail';
        } else {
          e.className = 'tlt-arrow-down';
          detail.className += ' hide';
        }
      });
    });
  },
  _pageInfo: function() {
    var page = this.curPage;
    var pageSize = this.pageSize;
    var dataCount = this.data.length;
    var pageCount = Math.ceil(dataCount / pageSize);
    var showPages = this.options.showPages;
    var pageStart;
    if (page <= Math.ceil(showPages / 2)) {
      pageStart = 1;
    } else if (page >= pageCount - Math.floor(showPages / 2)) {
      pageStart = pageCount - showPages + 1;
    } else {
      pageStart = page - Math.floor(showPages / 2);
    }
    var pageEnd = Math.min(pageStart + showPages - 1, pageCount);
    var pageStartIndex;
    var pageEndIndex;
    if (pageSize === -1) {
      pageStartIndex = 1;
      pageEndIndex = dataCount;
    } else {
      pageStartIndex = pageSize * (page - 1);
      pageEndIndex = pageSize * page;
    }

    return {
      page: page,
      pageSize: pageSize,
      pageCount: pageCount,
      dataCount: dataCount,
      showPages: showPages,
      pageStart: pageStart,
      pageEnd: pageEnd,
      pageStartIndex: pageStartIndex,
      pageEndIndex: pageEndIndex
    };
  }
};

TimeLineTable.defaultOptions = {
  dateField: 'date',
  datePosition: 'left',
  pageSizes: [ 10, 20, 30, -1 ],
  showPages: 5,
  showTotal: true,
  showPageSize: true,
};