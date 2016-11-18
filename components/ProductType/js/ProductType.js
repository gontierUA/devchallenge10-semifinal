;(function($) {
    'use strict';

    var app = this;

    var MODULE = 'product-type';

    var DEFAULTS = {
        SELECTORS: {
            MODULE: '.' + MODULE,
            BUTTON: '.' + MODULE + '__button'
        },
        CLASSES: {
            ACTIVE: 'grid__button_active'
        }
    };

    var ProductType = function(options) {
        this.options = $.extend({}, this.defaults, options);

        this.elems = {
            $module: $(DEFAULTS.SELECTORS.MODULE),
            $button: $(DEFAULTS.SELECTORS.BUTTON)
        };

        this.init();
    };

    $.extend(ProductType.prototype, {
        defaults: DEFAULTS,

        init: function() {
            this.elems.$button.on('click.ProductType', this._setProduct.bind(this));

            this._setDefaultProduct();
        },

        _setDefaultProduct: function() {
            this.elems.$button.eq(0).trigger('click.ProductType');
        },

        _setProduct: function(e) {
            var productData = $(e.currentTarget).data('product');

            e.preventDefault();

            this.elems.$button.removeClass(DEFAULTS.CLASSES.ACTIVE);

            $(e.currentTarget).addClass(DEFAULTS.CLASSES.ACTIVE);

            app.publish(app.EVENTS.SET_BASE_PRODUCT, productData);
        }
    });

    var ProductTypeModule = new ProductType();

    app.ProductType = ProductType;
}).call(window.DCX = window.DCX || {}, jQuery);
