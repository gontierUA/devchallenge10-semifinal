/*globals sinon, expect*/

;(function($, window) {
    'use strict';

    var app = this;

    describe('CurrentArts.test.js', function() {
        var sut = new app.CurrentArts();
        var sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('current arts', function() {
            beforeEach(function() {
                sandbox.spy($.fn, 'removeClass');
                sandbox.spy($.fn, 'append');
                sandbox.stub(app, 'publish').returns(true);
            });

            it('should remove art', function() {
                sut._removeArt({
                    currentTarget: $('<a></a>'),
                    preventDefault: $.noop
                });

                expect(app.publish).to.have.been.calledWith('removeArt');
            });

            it('should add panel for drawing', function() {
                sut._addCustomDrawing();

                expect(sut.elems.$module.append).to.have.been.calledWith(sandbox.match.string);
            });

            it('should change index', function() {
                sut._changeIndex({
                    currentTarget: $('<a></a>'),
                    preventDefault: $.noop
                });

                expect(app.publish).to.have.been.calledWith('changeIndex');
            });
        });
    });
}).call(window.DCX = window.DCX || {}, jQuery, window);
