;(function($) {
    'use strict';

    var app = this;

    var MODULE = 'export';

    var DEFAULTS = {
        SELECTORS: {
            MODULE: '.' + MODULE
        }
    };

    var Export = function(options) {
        this.options = $.extend({}, this.defaults, options);

        this.elems = {
            $module: $(DEFAULTS.SELECTORS.MODULE)
        };

        this.init();
    };

    $.extend(Export.prototype, {
        defaults: DEFAULTS,

        init: function() {
            app.subscribe(app.EVENTS.EXPORT_COMPLETE, this.completeExport.bind(this));

            this.elems.$module.on('click.Export', this.initExport.bind(this));
        },

        initExport: function() {
            app.publish(app.EVENTS.EXPORT_INIT);
        },

        completeExport: function(url) {
            this.elems.$module.attr('href', url);
        }
    });

    var ExportModule = new Export();

    app.Export = Export;

}).call(window.DCX = window.DCX || {}, jQuery);
