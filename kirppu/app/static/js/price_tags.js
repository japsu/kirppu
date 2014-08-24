// Generated by CoffeeScript 1.7.1
(function() {
  var C, L, LocalizationStrings, PriceTagsConfig, addItem, bindFormEvents, bindItemDeleteEvents, bindItemToggleEvents, bindNameEditEvents, bindOneTagsEvents, bindPriceEditEvents, bindTagEvents, createTag, deleteAll, deleteIsDisabled, listViewIsOn, onPriceChange, toggleDelete, toggleListView;

  LocalizationStrings = (function() {
    function LocalizationStrings() {}

    LocalizationStrings.prototype.toggleDelete = {
      enabledText: 'Disable delete',
      disabledText: 'Enable delete'
    };

    LocalizationStrings.prototype.deleteItem = {
      enabledTitle: 'Delete this item.',
      disabledTitle: 'Enable delete by clicking the button at the top of the page.'
    };

    LocalizationStrings.prototype.deleteAll = {
      confirmText: 'Are you sure you want to delete all items?',
      failedText: 'Deleting all items failed.',
      enabledTitle: 'Delete all items.',
      disabledTitle: 'Enable delete all by clicking the "Enable delete" button'
    };

    return LocalizationStrings;

  })();

  L = new LocalizationStrings();

  PriceTagsConfig = (function() {
    PriceTagsConfig.prototype.url_args = {
      code: ''
    };

    PriceTagsConfig.prototype.urls = {
      roller: '',
      name_update: '',
      price_update: '',
      item_delete: '',
      size_update: '',
      item_add: '',
      barcode_img: '',
      items_delete_all: ''
    };

    function PriceTagsConfig() {}

    PriceTagsConfig.prototype.name_update_url = function(code) {
      var url;
      url = this.urls.name_update;
      return url.replace(this.url_args.code, code);
    };

    PriceTagsConfig.prototype.price_update_url = function(code) {
      var url;
      url = this.urls.price_update;
      return url.replace(this.url_args.code, code);
    };

    PriceTagsConfig.prototype.item_delete_url = function(code) {
      var url;
      url = this.urls.item_delete;
      return url.replace(this.url_args.code, code);
    };

    PriceTagsConfig.prototype.size_update_url = function(code) {
      var url;
      url = this.urls.size_update;
      return url.replace(this.url_args.code, code);
    };

    PriceTagsConfig.prototype.barcode_img_url = function(code) {
      var url;
      url = this.urls.barcode_img;
      return url.replace(this.url_args.code, code);
    };

    return PriceTagsConfig;

  })();

  C = new PriceTagsConfig;

  createTag = function(name, price, vendor_id, code, type) {
    var tag;
    tag = $(".item_template").clone();
    tag.removeClass("item_template");
    if (type === "short") {
      tag.addClass("item_short");
    }
    if (type === "tiny") {
      tag.addClass("item_tiny");
    }
    $('.item_name', tag).text(name);
    $('.item_price', tag).text(price);
    $('.item_head_price', tag).text(price);
    $('.item_vendor_id', tag).text(vendor_id);
    $(tag).attr('id', 'item_' + code);
    $('.item_extra_code', tag).text(code);
    $('.barcode_container > img', tag).attr('src', C.barcode_img_url(code));
    return tag;
  };

  addItem = function() {
    var content, onSuccess;
    onSuccess = function(items) {
      var item, tag, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        tag = createTag(item.name, item.price, item.vendor_id, item.code, item.type);
        $('#items').prepend(tag);
        _results.push(bindTagEvents($(tag)));
      }
      return _results;
    };
    content = {
      name: $("#item-add-name").val(),
      price: $("#item-add-price").val(),
      range: $("#item-add-suffixes").val(),
      type: $("input[name=item-add-type]:checked").val()
    };
    return $.post(C.urls.item_add, content, onSuccess);
  };

  deleteAll = function() {
    var tags;
    if (!confirm(L.deleteAll.confirmText)) {
      return;
    }
    tags = $('#items > .item_container');
    tags.hide();
    $.ajax({
      url: C.urls.items_delete_all,
      type: 'DELETE',
      complete: function(jqXHR, textStatus) {
        if (textStatus === "success") {
          return tags.remove();
        } else {
          $(tags).show();
          return alert(L.deleteAll.failedText);
        }
      }
    });
  };

  deleteIsDisabled = false;

  toggleDelete = function() {
    var deleteAllButton, deleteButtons, toggleButton;
    deleteIsDisabled = deleteIsDisabled ? false : true;
    toggleButton = $('#toggle_delete');
    if (deleteIsDisabled) {
      toggleButton.removeClass('btn-primary');
      toggleButton.addClass('btw-default');
      toggleButton.text(L.toggleDelete.disabledText);
    } else {
      toggleButton.removeClass('btw-default');
      toggleButton.addClass('btn-primary');
      toggleButton.text(L.toggleDelete.enabledText);
    }
    deleteAllButton = $('#delete_all');
    if (deleteIsDisabled) {
      deleteAllButton.attr('disabled', 'disabled');
      deleteAllButton.attr('title', L.deleteAll.disabledTitle);
    } else {
      deleteAllButton.removeAttr('disabled');
      deleteAllButton.attr('title', L.deleteItem.enabledTitle);
    }
    deleteButtons = $('.item_button_delete');
    if (deleteIsDisabled) {
      deleteButtons.attr('disabled', 'disabled');
      deleteButtons.attr('title', L.deleteItem.disabledTitle);
    } else {
      deleteButtons.removeAttr('disabled');
      deleteButtons.attr('title', L.deleteItem.enabledTitle);
    }
  };

  listViewIsOn = false;

  toggleListView = function() {
    var items;
    listViewIsOn = listViewIsOn ? false : true;
    items = $('#items > .item_container');
    if (listViewIsOn) {
      return items.addClass('item_list');
    } else {
      return items.removeClass('item_list');
    }
  };

  onPriceChange = function() {
    var formGroup, input, value;
    input = $(this);
    formGroup = input.parents(".form-group");
    value = input.val().replace(',', '.');
    if (value > 400 || value <= 0 || Number.isNaN(Number.parseInt(value))) {
      formGroup.addClass('has-error');
    } else {
      formGroup.removeClass('has-error');
    }
  };

  bindFormEvents = function() {
    $('#add_short_item').click(addItem);
    $('#delete_all').click(deleteAll);
    $('#toggle_delete').click(toggleDelete);
    $('#list_view').click(toggleListView);
    toggleDelete();
    $('#item-add-price').change(onPriceChange);
  };

  bindPriceEditEvents = function(tag, code) {
    $(".item_price", tag).editable(C.price_update_url(code), {
      indicator: "<img src='" + C.urls.roller + "'>",
      tooltip: "Click to edit...",
      onblur: "submit",
      style: "width: 2cm",
      callback: function(value) {
        return $(".item_head_price", tag).text(value);
      }
    });
  };

  bindNameEditEvents = function(tag, code) {
    $(".item_name", tag).editable(C.name_update_url(code), {
      indicator: "<img src='" + C.urls.roller + "'>",
      tooltip: "Click to edit...",
      onblur: "submit",
      style: "inherit"
    });
  };

  bindItemDeleteEvents = function(tag, code) {
    var onItemDelete;
    onItemDelete = function() {
      $(tag).hide();
      $.ajax({
        url: C.item_delete_url(code),
        type: 'DELETE',
        complete: function(jqXHR, textStatus) {
          if (textStatus === "success") {
            return tag.remove();
          } else {
            return $(tag).show();
          }
        }
      });
    };
    $('.item_button_delete', tag).click(onItemDelete);
  };

  bindItemToggleEvents = function(tag, code) {
    var getNextType, onItemSizeToggle, setTagType;
    setTagType = function(tag_type) {
      if (tag_type === "tiny") {
        $(tag).addClass('item_tiny');
      } else {
        $(tag).removeClass('item_tiny');
      }
      if (tag_type === "short") {
        $(tag).addClass('item_short');
      } else {
        $(tag).removeClass('item_short');
      }
    };
    getNextType = function(tag_type) {
      tag_type = (function() {
        switch (tag_type) {
          case "tiny":
            return "short";
          case "short":
            return "long";
          case "long":
            return "tiny";
          default:
            return "short";
        }
      })();
      return tag_type;
    };
    onItemSizeToggle = function() {
      var new_tag_type, tag_type;
      if ($(tag).hasClass('item_short')) {
        tag_type = "short";
      } else if ($(tag).hasClass('item_tiny')) {
        tag_type = "tiny";
      } else {
        tag_type = "long";
      }
      new_tag_type = getNextType(tag_type);
      setTagType(new_tag_type);
      $.ajax({
        url: C.size_update_url(code),
        type: 'POST',
        data: {
          tag_type: new_tag_type
        },
        complete: function(jqXHR, textStatus) {
          if (textStatus !== "success") {
            return setTagType(tag_type);
          }
        }
      });
    };
    $('.item_button_toggle', tag).click(onItemSizeToggle);
  };

  bindOneTagsEvents = function(index, tag) {
    var code;
    code = $(".item_extra_code", tag).text();
    bindPriceEditEvents(tag, code);
    bindNameEditEvents(tag, code);
    bindItemDeleteEvents(tag, code);
    bindItemToggleEvents(tag, code);
  };

  bindTagEvents = function(tags) {
    tags.each(bindOneTagsEvents);
  };

  window.localization = L;

  window.itemsConfig = C;

  window.addItem = addItem;

  window.deleteAll = deleteAll;

  window.toggleDelete = toggleDelete;

  window.bindTagEvents = bindTagEvents;

  window.bindFormEvents = bindFormEvents;

}).call(this);
