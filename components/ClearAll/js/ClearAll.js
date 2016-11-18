;(function($) {
    'use strict';

    var app = this;

    var MODULE = 'clear-all';

    var DEFAULTS = {
        SELECTORS: {
            MODULE: '.' + MODULE
        }
    };

    var ClearAll = function(options) {
        this.options = $.extend({}, this.defaults, options);

        this.elems = {
            $module: $(DEFAULTS.SELECTORS.MODULE)
        };

        this.init();
    };

    $.extend(ClearAll.prototype, {
        defaults: DEFAULTS,

        init: function() {
            this.elems.$module.on('click.ClearAll', this._clearAll.bind(this));
        },

        _clearAll: function() {
            app.publish(app.EVENTS.CLEAR_ALL);
        }
    });

    var ClearAllModule = new ClearAll();

    app.ClearAll = ClearAll;
}).call(window.DCX = window.DCX || {}, jQuery);
