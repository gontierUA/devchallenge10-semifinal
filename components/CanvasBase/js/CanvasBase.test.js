/*globals sinon, expect*/

;(function($, window) {
    'use strict';

    var app = this;

    describe('CanvasBase.test.js', function() {
        var sut = new app.CanvasBase();
        var sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('keyboard', function() {
            beforeEach(function() {
                sandbox.spy(app, 'publish');
                sandbox.spy(sut, 'hitTest');
                sandbox.stub(sut, 'drawScreen').returns(true);
            });

            it('should move top art with keyboard', function() {
                sut.dragIndex = 0;

                sut.artArr = [];

                sut.artArr.push({
                    x: 5,
                    y: 5,
                    width: 30,
                    height: 30
                });

                sut.initKeyboardControls({
                    keyCode: 38,
                    preventDefault: $.noop
                });

                expect(sut.artArr[sut.dragIndex].y).to.equal(3);
            });

            it('should move right art with keyboard', function() {
                sut.dragIndex = 0;

                sut.artArr = [];

                sut.artArr.push({
                    x: 5,
                    y: 5,
                    width: 30,
                    height: 30
                });

                sut.initKeyboardControls({
                    keyCode: 39,
                    preventDefault: $.noop
                });

                expect(sut.artArr[sut.dragIndex].x).to.equal(7);
            });

            it('should move bottom art with keyboard', function() {
                sut.dragIndex = 0;

                sut.artArr = [];

                sut.artArr.push({
                    x: 5,
                    y: 5,
                    width: 30,
                    height: 30
                });

                sut.initKeyboardControls({
                    keyCode: 40,
                    preventDefault: $.noop
                });

                expect(sut.artArr[sut.dragIndex].y).to.equal(7);
            });

            it('should move left art with keyboard', function() {
                sut.dragIndex = 0;

                sut.artArr = [];

                sut.artArr.push({
                    x: 5,
                    y: 5,
                    width: 30,
                    height: 30
                });

                sut.initKeyboardControls({
                    keyCode: 37,
                    preventDefault: $.noop
                });

                expect(sut.artArr[sut.dragIndex].x).to.equal(3);
            });
        });

        describe('arts', function() {
            beforeEach(function() {
                sandbox.spy(app, 'publish');
                sandbox.spy(sut, 'hitTest');
                sandbox.spy(Array.prototype, 'splice');
                sandbox.stub(sut, 'drawScreen').returns(true);
            });

            it('should test mouse down', function() {
                sut.artArr.push({
                    x: 5,
                    y: 5,
                    width: 30,
                    height: 30
                });

                var test = sut.hitTest(10, 10, 0, null);

                expect(test).to.be.true;
            });

            it('should scale size of art', function() {
                var test = sut._scaleSize(250, 470, 396, 383);

                expect(test).to.deep.equal({
                    height : 191.79292929292927,
                    width: 199.99999999999997
                });
            });

            it('should remove art', function() {
                sut._removeArt({
                    artIndex: 0
                });

                expect(sut.drawScreen).to.have.been.called;
            });

            it('should increase index of art', function() {
                sut.artArr = [{
                    x: 5,
                    y: 5,
                    width: 30,
                    height: 30
                }];

                sut.artArr.push({
                    x: 5,
                    y: 5,
                    width: 30,
                    height: 30
                });

                sut._changeIndex({
                    artIndex: 0,
                    direction: 'up'
                });

                expect(sut.artArr.splice).to.have.been.calledWith(0 , 1);
                expect(sut.drawScreen).to.have.been.called;
            });

            it('should decrease index of art', function() {
                sut.artArr = [{
                    x: 5,
                    y: 5,
                    width: 30,
                    height: 30
                }];

                sut._changeIndex({
                    artIndex: 1,
                    direction: 'down'
                });

                expect(sut.artArr.splice).to.have.been.calledWith(1, 1);
            });
        });

        describe('mouse', function() {
            beforeEach(function() {
                sandbox.spy($.fn, 'off');
                sandbox.stub(sut, 'drawScreen').returns(true);
            });

            it('should handle mouseMoveListener', function() {
                sut.mouseMoveListener();

                expect(sut.drawScreen).to.have.been.called;
            });

            it('should handle mouseMoveListener with rotating', function() {
                sut.rotating = true;

                sut.mouseMoveListener();

                expect(sut.drawScreen).to.have.been.called;
            });

            it('should handle mouseUpListener', function() {
                sut.rotating = true;

                sut.mouseUpListener();

                expect($(window).off).to.have.been.called;
            });

            it('should handle mouseUpListener with dragging', function() {
                sut.dragging = true;

                sut.mouseUpListener();

                expect(sut.dragging).to.be.false;
                expect($(window).off).to.have.been.calledWith('mousemove.CanvasBase');
            });

            it('should handle mouseUpListener with drawing', function() {
                sut.drawingEnable = true;

                sut.mouseUpListener();

                expect($(window).off).to.have.been.calledWith('mousemove.CanvasBase');
            });
        });

        describe('drawing', function() {
            beforeEach(function() {
                sandbox.spy($.fn, 'off');
                sandbox.stub(sut, 'drawScreen').returns(true);
            });

            it('should clear points array', function() {
                sut.drawingData = [{
                    x: 2,
                    y: 2,
                    size: 5,
                    color: '#FFF'
                }, {
                    x: 2,
                    y: 2,
                    size: 5,
                    color: '#FFF'
                }];

                sut._endDrawing();

                expect(sut.drawingData.length).to.equal(0);
            });
        })
    });
}).call(window.DCX = window.DCX || {}, jQuery, window);
