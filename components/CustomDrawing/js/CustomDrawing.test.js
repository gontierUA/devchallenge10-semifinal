/*globals sinon, expect*/

;(function($, window) {
    'use strict';

    var app = this;

    describe('CustomDrawing.test.js', function() {
        var sut = new app.CustomDrawing();
        var sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('custom drawing', function() {
            beforeEach(function() {
                sandbox.spy($.fn, 'removeClass');
                sandbox.spy(app, 'publish');
                sandbox.spy(window, 'alert');
            });

            it('should change color', function() {
                sut._changeColor({
                    currentTarget: $('<a></a>'),
                    preventDefault: $.noop
                });

                expect(app.publish).to.have.been.calledWith('customDrawingAdd', sinon.match.object);
            });

            it('should change size', function() {
                sut._changeSize({
                    currentTarget: $('<a></a>'),
                    preventDefault: $.noop
                });

                expect(app.publish).to.have.been.calledWith('customDrawingAdd', sinon.match.object);
            });


            it('should toggle custom drawing when art >= 3', function() {
                app.CURRENT_ARTS_COUNTER = 3;

                sut._toggleCustomDrawing({
                    currentTarget: $('<a></a>'),
                    preventDefault: $.noop
                });

                expect(window.alert).to.have.been.calledWith('3 maximum');
            });

            it('should end custom drawing', function() {
                sandbox.stub($.fn, 'hasClass').returns(true);

                app.CURRENT_ARTS_COUNTER = 1;

                sut._toggleCustomDrawing({
                    currentTarget: $('<a></a>'),
                    preventDefault: $.noop
                });

                expect(app.publish).to.have.been.calledWith('customDrawingEnd');
            });

            it('should start custom drawing', function() {
                sandbox.stub($.fn, 'hasClass').returns(false);

                app.CURRENT_ARTS_COUNTER = 1;

                sut._toggleCustomDrawing({
                    currentTarget: $('<a></a>'),
                    preventDefault: $.noop
                });

                expect(app.publish).to.have.been.calledWith('customDrawingAdd', sandbox.match.object);
            });
        });
    });
}).call(window.DCX = window.DCX || {}, jQuery, window);
