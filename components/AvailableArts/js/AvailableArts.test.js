/*globals sinon, expect*/

;(function($, window) {
    'use strict';

    var app = this;

    describe('AvailableArts.test.js', function() {
        var sut = new app.AvailableArts();
        var sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('available arts', function() {
            beforeEach(function() {
                sandbox.spy($.fn, 'addClass');
                sandbox.spy(app, 'publish');
                sandbox.spy(window, 'alert');
            });

            it('should hide available arts', function() {
                sut._hideAvailableArts();

                expect(sut.elems.$module.addClass).to.have.been.calledWith('hidden');
            });

            it('should show alert if > 3 arts', function() {
                app.CURRENT_ARTS_COUNTER = 4;

                sut._addArt({
                    currentTarget: $('<a></a>'),
                    preventDefault: $.noop
                });

                expect(alert).to.have.been.calledWith('3 maximum');
            });

            it('should add art', function() {
                app.CURRENT_ARTS_COUNTER = 1;

                sut._addArt({
                    currentTarget: $('<a></a>'),
                    preventDefault: $.noop
                });

                expect(app.publish).to.have.been.calledWith('setArt');
            });
        });
    });
}).call(window.DCX = window.DCX || {}, jQuery, window);
