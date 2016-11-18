/*globals sinon, expect*/

;(function($, window) {
    'use strict';

    var app = this;

    describe('Export.test.js', function() {
        var sut = new app.Export();
        var sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('export', function() {
            beforeEach(function() {
                sandbox.spy(app, 'publish');
            });

            it('should initExport export', function() {
                sut.initExport();

                expect(app.publish).to.have.been.calledWith('exportInit');
            });
        });
    });
}).call(window.DCX = window.DCX || {}, jQuery, window);
