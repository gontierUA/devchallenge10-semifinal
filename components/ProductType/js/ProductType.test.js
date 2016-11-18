/*globals sinon, expect*/

;(function($, window) {
    'use strict';

    var app = this;

    describe('ProductType.test.js', function() {
        var sut = new app.ProductType();
        var sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('product type', function() {
            beforeEach(function() {
                sandbox.spy($.fn, 'removeClass');
                sandbox.spy(app, 'publish');
            });

            it('should set active product', function() {
                sut._setProduct({
                    currentTarget: $('<a></a>'),
                    preventDefault: $.noop
                });

                expect(sut.elems.$button.removeClass).to.have.been.calledWith('grid__button_active');
                expect(app.publish).to.have.been.calledWith('setBaseProduct');
            });
        });
    });
}).call(window.DCX = window.DCX || {}, jQuery, window);
