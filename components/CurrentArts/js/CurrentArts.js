;(function($) {
    'use strict';

    var app = this;

    var MODULE = 'current-arts';

    var DEFAULTS = {
        SELECTORS: {
            MODULE: '.' + MODULE,
            BUTTON_REMOVE: '.' + MODULE + '__remove',
            GRID_BUTTON: '.grid__button',
            BUTTON_UP: '.' + MODULE + '__up',
            BUTTON_DOWN: '.' + MODULE + '__down'
        },
        CLASSES: {
            BUTTON: MODULE + '__button',
            BUTTON_REMOVE: MODULE + '__remove',
            BUTTON_UP: MODULE + '__up',
            BUTTON_DOWN: MODULE + '__down',
            GRID_BUTTON: 'grid__button',
            GRID_ITEM: 'grid__item',
            GRID_IMAGE: 'grid__img'
        },
        TEXT: {
            CUSTOM: 'CUSTOM DRAWING',
            REMOVE: 'REMOVE',
            UP: 'UP',
            DOWN: 'DOWN'
        }
    };

    var CurrentArts = function(options) {
        this.options = $.extend({}, this.defaults, options);

        this.elems = {
            $module: $(DEFAULTS.SELECTORS.MODULE)
        };

        this.init();
    };

    $.extend(CurrentArts.prototype, {
        defaults: DEFAULTS,

        init: function() {
            app.subscribe(app.EVENTS.SET_ART, this._setCurrentArt.bind(this));
            app.subscribe(app.EVENTS.SET_BASE_PRODUCT, this._clearCurrentActiveArts.bind(this));
            app.subscribe(app.EVENTS.CLEAR_ALL, this._clearCurrentActiveArts.bind(this));
            app.subscribe(app.EVENTS.CUSTOM_DRAWING_END, this._addCustomDrawing.bind(this));

            this.elems.$module.on('click.CurrentArts', this.options.SELECTORS.BUTTON_REMOVE, this._removeArt.bind(this));

            this.elems.$module.on('click.CurrentArts', this.options.SELECTORS.BUTTON_UP, this._changeIndex.bind(this));
            this.elems.$module.on('click.CurrentArts', this.options.SELECTORS.BUTTON_DOWN, this._changeIndex.bind(this));
        },

        _changeIndex: function(e) {
            var $currentItem = $(e.currentTarget);
            var $currentParent = $currentItem.parent();
            var parentIndex = $currentParent.index();
            var direction = ($currentItem.hasClass(this.options.CLASSES.BUTTON_UP)) ? 'up': 'down';

            if (direction === 'up') {
                $currentParent.insertAfter($currentParent.next());
            } else if (direction === 'down') {
                $currentParent.insertBefore($currentParent.prev());
            }

            app.publish(app.EVENTS.CHANGE_INDEX, {artIndex: parentIndex, direction: direction});
        },

        _removeArt: function(e) {
            var $currentItem = $(e.currentTarget);
            var artIndex = $currentItem.parent().index();
            var artUrl = $currentItem.siblings(this.options.SELECTORS.GRID_BUTTON).data('art-url');

            $currentItem.parent().remove();

            app.CURRENT_ARTS_COUNTER--;

            app.publish(app.EVENTS.REMOVE_ART, {artIndex: artIndex, artUrl: artUrl});
        },

        _clearCurrentActiveArts: function() {
            this.elems.$module.empty();
        },

        _setCurrentArt: function(data) {
            var html = this._htmlMock(
                '<a class="' + this.options.CLASSES.GRID_BUTTON + '" data-art-url="' + data.artUrl + '">' +
                '<img src="' + data.artThumb + '" class="' + this.options.CLASSES.GRID_IMAGE + '" />' +
                '</a>'
            );

            this.elems.$module.append(html);
        },

        _addCustomDrawing: function() {
            var html = this._htmlMock('<a class="' + this.options.CLASSES.GRID_BUTTON + '">' + this.options.TEXT.CUSTOM + '</a>');

            this.elems.$module.append(html);
        },

        _htmlMock: function(custom) {
            return (
                '<li class="' + this.options.CLASSES.GRID_ITEM + '">' +
                custom +
                '<button class="' + this.options.CLASSES.BUTTON + ' '+ this.options.CLASSES.BUTTON_DOWN + '">' +
                this.options.TEXT.DOWN +
                '</button>' +
                '<button class="' + this.options.CLASSES.BUTTON + ' '+ this.options.CLASSES.BUTTON_UP + '">' +
                 this.options.TEXT.UP +
                '</button>' +
                '<button class="' + this.options.CLASSES.BUTTON_REMOVE + '">' +
                this.options.TEXT.REMOVE +
                '</button>' +
                '</li>'
            );
        }
    });

    var CurrentArtsModule = new CurrentArts();

    app.CurrentArts = CurrentArts
}).call(window.DCX = window.DCX || {}, jQuery);
