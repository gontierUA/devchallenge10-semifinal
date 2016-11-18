/*globals sinon, expect*/

;(function($) {
    'use strict';

    var app = this;

    describe('ClearAll.test.js', function() {
        var sut = new app.ClearAll();
        var sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('current arts', function() {
            beforeEach(function() {
                sandbox.spy(app, 'publish');
            });

            it('should clear all', function() {
                sut._clearAll({
                    currentTarget: $('<a></a>'),
                    preventDefault: $.noop
                });

                expect(app.publish).to.have.been.calledWith('clearAll');
            });
        });
    });
}).call(window.DCX = window.DCX || {}, jQuery);
