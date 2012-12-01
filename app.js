$(function () {
  var item_index = 0;
  var items      = $('.list .post, .list .thread');
  var max_items  = items.length;
  var _offset    = window.location.search.match(/offset=([0-9]+)/i);
  var offset     = _offset === null ? 0 : _offset[1] * 1;

  $(document).on('keyup', function (e) {
    var el = e.target || e.srcElement;

    if (! (el.tagName == 'INPUT' || el.tagName == 'SELECT' || el.tagName == 'TEXTAREA' || (el.contentEditable && el.contentEditable == 'true'))) {
      e.preventDefault();

      switch (e.keyCode) {
        case 74: // J
          updateIndex(1);
        break;

        case 75: // K
          updateIndex(-1);
        break;

        case 13: // Enter
          window.location = getItemLocation(item_index);
        break;

        case 37: // Left arrow
          window.location = getPageLocation(-1);
        break;

        case 39: // Right arrow
          window.location = getPageLocation(1);
        break;

        case 81: // Q
          if (e.ctrlKey) {
            var reply_link = getItem(item_index).find('[data-trigger=quickreply]');

            if (reply_link.length > 0) {
              $('body').animate({scrollTop: $('#post-content').offset().top}, 400, function () {
                $('#post-content').val($('#post-content').val() + '@' + reply_link.data('name')).focus();
              });
            }
          }
        break;
      }

      return false;
    }
  });

  var getItem = function (index) {
    return items.eq(index);
  };

  var getItemLocation = function (index) {
    return getItem(index).find('.title a, a[title="Permalink to this item"]').attr('href');
  };

  var getPageLocation = function (direction) {
    if (direction > 0) {
      return updateQueryStringParameter(window.location.href, 'offset', offset + 20);
    } else {
      return updateQueryStringParameter(window.location.href, 'offset', Math.max(0, offset - 20));
    }
  };

  var updateIndex = function (direction) {
    if (direction > 0) {
      item_index = Math.min(max_items, item_index + direction);
    } else {
      item_index = Math.max(0, item_index + direction);
    }

    $('body').animate({scrollTop: getItem(item_index).offset().top}, 400, function () {
      highlightItem(item_index);
    });
  };

  var highlightItem = function (index) {
    items.css('background', 'transparent');
    getItem(index).css('background', 'rgba(50, 50, 50, 0.5)');
  };

  // Credit to http://stackoverflow.com/a/6021027/692871 to save time
  var updateQueryStringParameter = function (uri, key, value) {
    var re        = new RegExp("([?|&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";

    if (uri.match(re)) {
      return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
      return uri + separator + key + "=" + value;
    }
  };
});