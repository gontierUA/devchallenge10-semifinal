;(function($) {
    'use strict';

    var app = this;

    var MODULE = 'custom-drawing';

    var DEFAULTS = {
        SELECTORS: {
            MODULE: '.' + MODULE,
            BUTTON: '.' + MODULE + '__button-main',
            CONTROLS: '.' + MODULE + '__controls',
            BUTTON_SIZE: '.' + MODULE + '__button_size',
            BUTTON_COLOR: '.' + MODULE + '__button_color'
        },
        CLASSES: {
            ACTIVE: 'grid__button_active',
            ACTIVE_CONTROLS: MODULE + '__controls_active',
            ACTIVE_CONTROL_ITEM: 'active'
        },
        TEXT: {
            START: 'START CUSTOM DRAWING',
            FINISH: 'FINISH CUSTOM DRAWING',
            ALERT: '3 maximum'
        }
    };

    var CustomDrawing = function(options) {
        this.options = $.extend({}, this.defaults, options);

        this.elems = {
            $module: $(DEFAULTS.SELECTORS.MODULE),
            $button: $(DEFAULTS.SELECTORS.BUTTON),
            $controls: $(DEFAULTS.SELECTORS.CONTROLS),
            $buttonsSize: $(DEFAULTS.SELECTORS.BUTTON_SIZE),
            $buttonsColor: $(DEFAULTS.SELECTORS.BUTTON_COLOR)
        };

        this.size = null;
        this.color = null;

        this.init();
    };

    $.extend(CustomDrawing.prototype, {
        defaults: DEFAULTS,

        init: function() {
            app.subscribe(app.EVENTS.SET_BASE_PRODUCT, this._clearDrawings.bind(this));
            app.subscribe(app.EVENTS.CLEAR_ALL, this._clearDrawings.bind(this));

            this.elems.$button.on('click.CustomDrawing', this._toggleCustomDrawing.bind(this));
            this.elems.$buttonsSize.on('click.CustomDrawing', this._changeSize.bind(this));
            this.elems.$buttonsColor.on('click.CustomDrawing', this._changeColor.bind(this));
        },

        _clearDrawings: function() {
            this.elems.$button
                .text(this.options.TEXT.START)
                .removeClass(this.options.CLASSES.ACTIVE);

            this.elems.$controls.removeClass(this.options.CLASSES.ACTIVE_CONTROLS);

            this._removeButtonActiveClass(this.elems.$buttonsSize);
            this._removeButtonActiveClass(this.elems.$buttonsColor);
        },

        _toggleCustomDrawing: function(e) {
            e.preventDefault();

            if (app.CURRENT_ARTS_COUNTER >= 3) {
                alert(this.options.TEXT.ALERT);
                return;
            }

            if (this.elems.$button.hasClass(this.options.CLASSES.ACTIVE)) {
                this.elems.$button
                    .text(this.options.TEXT.START)
                    .removeClass(this.options.CLASSES.ACTIVE);

                this.elems.$controls.removeClass(this.options.CLASSES.ACTIVE_CONTROLS);

                this._removeButtonActiveClass(this.elems.$buttonsSize);
                this._removeButtonActiveClass(this.elems.$buttonsColor);

                app.CURRENT_ARTS_COUNTER++;

                app.publish(app.EVENTS.CUSTOM_DRAWING_END);
            } else {
                this.elems.$button
                    .text(this.options.TEXT.FINISH)
                    .addClass(this.options.CLASSES.ACTIVE);

                this.elems.$controls.addClass(this.options.CLASSES.ACTIVE_CONTROLS);

                this.elems.$buttonsSize.first().addClass(this.options.CLASSES.ACTIVE_CONTROL_ITEM);
                this.elems.$buttonsColor.first().addClass(this.options.CLASSES.ACTIVE_CONTROL_ITEM);

                this.size = this.elems.$buttonsSize.first().data('size');
                this.color = this.elems.$buttonsColor.first().data('color');

                app.publish(app.EVENTS.CUSTOM_DRAWING_START, {
                    size: this.size,
                    color: this.color
                });
            }
        },

        _removeButtonActiveClass: function($button) {
            $button
                .filter('.' + this.options.CLASSES.ACTIVE_CONTROL_ITEM)
                .removeClass(this.options.CLASSES.ACTIVE_CONTROL_ITEM);
        },

        _changeSize: function(e) {
            this._removeButtonActiveClass(this.elems.$buttonsSize);

            $(e.currentTarget).addClass(this.options.CLASSES.ACTIVE_CONTROL_ITEM);

            this.size = $(e.currentTarget).data('size');

            app.publish(app.EVENTS.CUSTOM_DRAWING_START, {
                size: this.size,
                color: this.color
            });
        },

        _changeColor: function(e) {
            this._removeButtonActiveClass(this.elems.$buttonsColor);

            $(e.currentTarget).addClass(this.options.CLASSES.ACTIVE_CONTROL_ITEM);

            this.color = $(e.currentTarget).data('color');

            app.publish(app.EVENTS.CUSTOM_DRAWING_START, {
                size: this.size,
                color: this.color
            });
        }
    });

    var CustomDrawingModule = new CustomDrawing();

    app.CustomDrawing = CustomDrawing;
}).call(window.DCX = window.DCX || {}, jQuery);
