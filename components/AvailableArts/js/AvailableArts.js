;(function($) {
    'use strict';

    var app = this;

    var MODULE = 'arts';

    var DEFAULTS = {
        SELECTORS: {
            MODULE: '.' + MODULE,
            BUTTON: '.' + MODULE + '__button'
        },
        CLASSES: {
            ACTIVE: 'grid__button_active',
            HIDDEN: 'hidden'
        },
        TEXT: {
            ALERT: '3 maximum'
        }
    };

    var AvailableArts = function(options) {
        this.options = $.extend({}, this.defaults, options);

        this.elems = {
            $module: $(DEFAULTS.SELECTORS.MODULE),
            $button: $(DEFAULTS.SELECTORS.BUTTON)
        };

        this.init();
    };

    $.extend(AvailableArts.prototype, {
        defaults: DEFAULTS,

        init: function() {
            app.subscribe(app.EVENTS.SET_BASE_PRODUCT, this._clearActiveArts.bind(this));
            app.subscribe(app.EVENTS.REMOVE_ART, this._removeArt.bind(this));
            app.subscribe(app.EVENTS.CLEAR_ALL, this._clearActiveArts.bind(this));
            app.subscribe(app.EVENTS.CUSTOM_DRAWING_START, this._hideAvailableArts.bind(this));
            app.subscribe(app.EVENTS.CUSTOM_DRAWING_END, this._showAvailableArts.bind(this));

            this.elems.$button.on('click.AvailableArts', this._addArt.bind(this));
        },

        _removeArt: function(data) {
            this.elems.$module
                .find('.' + this.options.CLASSES.ACTIVE + '[data-art-url="' + data.artUrl + '"]')
                .removeClass(this.options.CLASSES.ACTIVE);
        },

        _clearActiveArts: function() {
            app.CURRENT_ARTS_COUNTER = 0;

            this._showAvailableArts();
            this.elems.$button.removeClass(this.options.CLASSES.ACTIVE);
        },

        _addArt: function(e) {
            var artUrl = $(e.currentTarget).data('art-url');
            var artThumb = $(e.currentTarget).children().attr('src');

            e.preventDefault();

            if ($(e.currentTarget).hasClass(this.options.CLASSES.ACTIVE)) {
                return;
            }

            if (app.CURRENT_ARTS_COUNTER < 3) {
                app.CURRENT_ARTS_COUNTER++;

                $(e.currentTarget).addClass(this.options.CLASSES.ACTIVE);

                app.publish(app.EVENTS.SET_ART, {artUrl: artUrl, artThumb: artThumb});
            } else {
                alert(this.options.TEXT.ALERT);
            }
        },

        _showAvailableArts: function() {
            this.elems.$module.removeClass(this.options.CLASSES.HIDDEN);
        },

        _hideAvailableArts: function() {
            this.elems.$module.addClass(this.options.CLASSES.HIDDEN);
        }
    });

    var AvailableArtsModule = new AvailableArts();

    app.AvailableArts = AvailableArts;
}).call(window.DCX = window.DCX || {}, jQuery);
