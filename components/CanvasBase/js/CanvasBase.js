;(function($, window, document) {
    'use strict';

    var app = this;

    var DEFAULTS = {
        SELECTORS: {
            CANVAS: '#productEditorCanvas',
            IMAGE: '#productImage'
        }
    };

    var CanvasBase = function(options) {
        this.options = $.extend({}, this.defaults, options);

        this.elems = {
            $canvas: $(DEFAULTS.SELECTORS.CANVAS),
            $image: $(DEFAULTS.SELECTORS.IMAGE)
        };

        this.canvasData = {};

        this.canvas = false;
        this.context = false;

        this.canvasSizePrint = {
            width: 600,
            height: 600
        };

        this.artArr = [];

        this.dragging = null;
        this.dragHoldX = null;
        this.dragHoldY = null;
        this.dragIndex = false;

        this.drawingEnable = false;
        this.drawingData = [];
        this.drawingSize = false;
        this.drawingColor = false;

        this.rotating = false;

        this.controls = {
            rotate: {
                image: new Image(),
                x: 0,
                y: 0,
                width: 25,
                height: 25
            }
        };
        this.controls.rotate.image.src = 'img/controls/rotate_control.png';

        this.init();
    };

    $.extend(CanvasBase.prototype, {
        defaults: DEFAULTS,

        init: function() {
            this.initCanvas();

            $(window).on('keydown.CanvasBase', this.initKeyboardControls.bind(this));
            this.elems.$canvas.on('mousedown.CanvasBase', this.mouseDownListener.bind(this));

            app.subscribe(app.EVENTS.SET_BASE_PRODUCT, this._setBaseProduct.bind(this));
            app.subscribe(app.EVENTS.CLEAR_ALL, this._clearAll.bind(this));
            app.subscribe(app.EVENTS.EXPORT_INIT, this._exportCanvas.bind(this));

            app.subscribe(app.EVENTS.SET_ART, this._setArt.bind(this));
            app.subscribe(app.EVENTS.REMOVE_ART, this._removeArt.bind(this));
            app.subscribe(app.EVENTS.CHANGE_INDEX, this._changeIndex.bind(this));

            app.subscribe(app.EVENTS.CUSTOM_DRAWING_START, this._addCustomDrawing.bind(this));
            app.subscribe(app.EVENTS.CUSTOM_DRAWING_END, this._endDrawing.bind(this));
        },

        /**
         * save array of dots as new canvas. import it to base canvas. clear array of dots.
         * @private
         */
        _endDrawing: function() {
            var minX;
            var maxX;
            var minY;
            var maxY;
            var maxSize;
            var tempCanvas = document.createElement('canvas');
            var tempContext = tempCanvas.getContext('2d');
            var posX = 0;
            var posY = 0;
            var drawingWidth = 0;
            var drawingHeight = 0;

            this.drawingEnable = false;

            if (this.drawingData.length) {
                minX = maxX = this.drawingData[0].x;
                minY = maxY = this.drawingData[0].y;
                maxSize = this.drawingData[0].size;

                for (var j = 0; j < this.drawingData.length; j++) {
                    minX = (this.drawingData[j].x < minX) ? this.drawingData[j].x : minX;
                    minY = (this.drawingData[j].y < minY) ? this.drawingData[j].y : minY;

                    maxX = (this.drawingData[j].x > maxX) ? this.drawingData[j].x : maxX;
                    maxY = (this.drawingData[j].y > maxY) ? this.drawingData[j].y : maxY;

                    maxSize = (this.drawingData[j].size > maxSize) ? this.drawingData[j].size : maxSize;
                }

                posX = minX - maxSize;
                posY = minY - maxSize;
                drawingWidth = maxSize * 2 + maxX - minX;
                drawingHeight = maxSize * 2 + maxY - minY;

                tempCanvas.width = (maxSize * 2 + maxX - minX);
                tempCanvas.height = (maxSize * 2 + maxY - minY);

                for (var i = 0; i < this.drawingData.length; i++) {
                    tempContext.strokeStyle = this.drawingData[i].color;
                    tempContext.lineWidth = this.drawingData[i].size;
                    tempContext.lineJoin = 'round';

                    tempContext.beginPath();
                    tempContext.moveTo(this.drawingData[i].x - posX - 1, this.drawingData[i].y - posY);
                    tempContext.lineTo(this.drawingData[i].x - posX, this.drawingData[i].y - posY);
                    tempContext.closePath();
                    tempContext.stroke();
                }

                this.drawingData = [];
            }

            this.artArr.push({
                x: posX,
                y: posY,
                base: tempCanvas,
                width: drawingWidth,
                height: drawingHeight,
                src: false,
                controls: false,
                custom: true,
                angle: 0
            });

            this.drawScreen();
        },

        _addCustomDrawing: function(data) {
            this.drawingEnable = true;

            this.drawingSize = data.size;
            this.drawingColor = data.color;
        },

        _changeIndex: function(data) {
            var currentArt = this.artArr[data.artIndex];

            if (data.direction === 'up' && (this.artArr.length !== data.artIndex + 1)) {
                this.artArr.splice(data.artIndex, 1);
                this.artArr.splice(data.artIndex + 1, 0, currentArt);
            } else if (data.direction === 'down' && (data.artIndex !== 0)) {
                this.artArr.splice(data.artIndex, 1);
                this.artArr.splice(data.artIndex - 1, 0, currentArt);
            }

            this.drawScreen();
        },

        _removeArt: function(data) {
            this.artArr.splice(data.artIndex, 1);

            this.drawScreen();
        },

        _setArt: function(data) {
            var _this = this;
            var newArt = new Image();
            var posX;
            var posY;
            var scaledSize;

            newArt.onload = function() {
                scaledSize = _this._scaleSize(
                    _this.canvasData.width,
                    _this.canvasData.height,
                    this.width,
                    this.height
                );

                posX = (_this.canvasData.width / 2) - (scaledSize.width / 2);
                posY = (_this.canvasData.height / 2) - (scaledSize.height / 2);

                _this.context.drawImage(newArt, posX, posY, scaledSize.width, scaledSize.height);

                _this.artArr.push({
                    x: posX,
                    y: posY,
                    base: newArt,
                    width: scaledSize.width,
                    height: scaledSize.height,
                    src: data.artUrl,
                    controls: false,
                    custom: false,
                    angle: 0
                });
            };

            newArt.src = data.artUrl;
        },

        _scaleSize: function(maxW, maxH, currW, currH){
            var ratio = Math.min(maxW / currW, maxH / currH);

            return {
                width: (currW * ratio - 50),
                height: (currH * ratio - 50)
            };
        },

        _exportCanvas: function() {
            var tempCanvas = document.createElement('canvas');
            var tempContext = tempCanvas.getContext('2d');
            var $tempImg = new Image();

            tempCanvas.width = this.canvasSizePrint.width;
            tempCanvas.height = this.canvasSizePrint.height;

            this.removeAllControls();

            tempContext.clearRect(0, 0, this.canvasSizePrint.width, this.canvasSizePrint.height);

            $tempImg.src = this.baseImageSrc;

            tempContext.drawImage($tempImg, 0, 0, this.canvasSizePrint.width, this.canvasSizePrint.height);
            tempContext.drawImage(this.canvas, this.canvasData.left, this.canvasData.top);

            app.publish(app.EVENTS.EXPORT_COMPLETE, tempCanvas.toDataURL('image/png'));
        },

        _setBaseProduct: function(data) {
            this._clearAll();

            this.baseImageSrc = data.image; // used for export

            this.elems.$image.attr('src', this.baseImageSrc);

            this.canvasData = {
                width: data.width,
                height: data.height,
                left: parseInt(data.left),
                top: parseInt(data.top)
            };

            this.canvas.width = this.canvasData.width;
            this.canvas.height = this.canvasData.height;

            this.elems.$canvas.css({
                width: data.width,
                height: data.height,
                left: parseInt(data.left),
                top: parseInt(data.top)
            });
        },

        _clearAll: function() {
            this.context.clearRect(0, 0, this.canvasData.width, this.canvasData.height);

            this.drawingData = [];
            this.artArr = [];
        },

        initCanvas: function() {
            this.canvas = $(this.options.SELECTORS.CANVAS).get(0);
            this.context = this.canvas.getContext('2d');

            this.context.save();
        },

        drawScreen: function() {
            var currentItem;
            var centerX;
            var centerY;

            this.context.clearRect(0, 0, this.canvasData.width, this.canvasData.height);

            for (var i = 0; i < this.artArr.length; i++) {
                currentItem = this.artArr[i];

                this.context.save();

                centerX = currentItem.x + (currentItem.width / 2);
                centerY = currentItem.y + (currentItem.height / 2);

                if (this.rotating && (this.dragIndex === i)) {
                    currentItem.angle = currentItem.angle + 2;

                    this.context.translate(centerX, centerY);
                    this.context.rotate(currentItem.angle * Math.PI / 180);
                    this.context.translate(-centerX, -centerY);
                } else {
                    if (currentItem.angle) {
                        this.context.translate(centerX, centerY);
                        this.context.rotate(currentItem.angle * Math.PI / 180);
                        this.context.translate(-centerX, -centerY);
                    }
                }

                this.context.drawImage(
                    currentItem.base,
                    currentItem.x,
                    currentItem.y,
                    currentItem.width,
                    currentItem.height
                );

                if (currentItem.controls) { // draw borders around image
                    this.context.lineWidth = '3';
                    this.context.strokeStyle = '#1bc98e';
                    this.context.strokeRect(
                        currentItem.x - 5,
                        currentItem.y - 5,
                        currentItem.width + 10,
                        currentItem.height + 10
                    );
                }

                this.context.restore();

                if (currentItem.controls) {
                    this._rotateControl();
                }
            }

            if (this.drawingData.length) {
                for (var j = 0; j < this.drawingData.length; j++) {
                    this.context.strokeStyle = this.drawingData[j].color;
                    this.context.lineWidth = this.drawingData[j].size;
                    this.context.lineJoin = 'round';

                    this.context.beginPath();
                    this.context.moveTo(this.drawingData[j].x - 1, this.drawingData[j].y);
                    this.context.lineTo(this.drawingData[j].x, this.drawingData[j].y);
                    this.context.closePath();
                    this.context.stroke();
                }
            }

            this.context.globalCompositeOperation = 'source-over';
        },

        _rotateControl: function() {
            this.controls.rotate.x = (this.canvasData.width - this.controls.rotate.width) / 2;
            this.controls.rotate.y = 0;

            this.context.drawImage(
                this.controls.rotate.image,
                (this.canvasData.width - this.controls.rotate.width) / 2,
                0,
                this.controls.rotate.width,
                this.controls.rotate.height
            );
        },

        initKeyboardControls: function(e) {
            if (this.dragIndex !== false) {
                switch (e.keyCode) {
                    case 38:
                        e.preventDefault();
                        this.artArr[this.dragIndex].y -= 2;

                        break;
                    case 39:
                        e.preventDefault();
                        this.artArr[this.dragIndex].x += 2;

                        break;
                    case 40:
                        e.preventDefault();
                        this.artArr[this.dragIndex].y += 2;

                        break;
                    case 37:
                        e.preventDefault();
                        this.artArr[this.dragIndex].x -= 2;

                        break;
                }

                this.drawScreen();
            }
        },

        removeAllControls: function() {
            for (var i = 0; i < this.artArr.length; i++) {
                this.artArr[i].controls = false;
            }

            this.drawScreen();
        },

        mouseDownListener: function(e) {
            var rect = this.canvas.getBoundingClientRect();
            var mouseX = (e.clientX - rect.left);
            var mouseY = (e.clientY - rect.top);
            var currentItem;

            if (this.hitTest(mouseX, mouseY, null, 'rotate')) { // test if we hit rotate control
                this.rotating = true;
            }

            if (this.drawingEnable) {
                this.drawingData.push({
                    x: mouseX,
                    y: mouseY,
                    size: this.drawingSize,
                    color: this.drawingColor
                });

                $(window).on('mousemove.CanvasBase', this.mouseMoveListener.bind(this));
            } else if (!this.rotating) {
                if (this.artArr.length) {
                    for (var i = 0; i < this.artArr.length; i++) {
                        currentItem = this.artArr[i];

                        currentItem.controls = false;

                        if (this.hitTest(mouseX, mouseY, i, null)) {
                            this.dragging = true;

                            this.dragHoldX = mouseX - currentItem.x;
                            this.dragHoldY = mouseY - currentItem.y;
                            this.dragIndex = i;
                        }
                    }
                }
            } else if (this.rotating) {
                $(window).on('mousemove.CanvasBase', this.mouseMoveListener.bind(this));
            }

            if (this.dragging) {
                this.artArr[this.dragIndex].controls = true;

                this.drawScreen();

                $(window).on('mousemove.CanvasBase', this.mouseMoveListener.bind(this));
            } else {
                this.removeAllControls();
            }

            this.elems.$canvas.off('mousedown.CanvasBase');
            $(window).on('mouseup.CanvasBase', this.mouseUpListener.bind(this));

            //code below prevent the mouse down from having an effect on the main browser window:
            if (e.preventDefault) {
                e.preventDefault();
            } else if (e.returnValue) {
                e.returnValue = false;
            }
        },

        mouseUpListener: function() {
            this.elems.$canvas.on('mousedown.CanvasBase', this.mouseDownListener.bind(this));
            $(window).off('mouseup.CanvasBase');

            if (this.rotating) {
                this.rotating = false;
                $(window).off('mousemove.CanvasBase');
            }

            if (this.dragging) {
                this.dragging = false;
                $(window).off('mousemove.CanvasBase');
            }

            if (this.drawingEnable) {
                $(window).off('mousemove.CanvasBase');
            }
        },

        mouseMoveListener: function(e) {
            var rect = this.canvas.getBoundingClientRect();

            if (this.drawingEnable) {
                this.drawingData.push({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                    size: this.drawingSize,
                    color: this.drawingColor
                });
            }

            if (this.rotating) {
                this.drawScreen();
                return;
            }

            if (this.dragging && this.artArr.length) {
                this.artArr[this.dragIndex].x = (e.clientX - rect.left) - this.dragHoldX;
                this.artArr[this.dragIndex].y = (e.clientY - rect.top) - this.dragHoldY;
            }

            this.drawScreen();
        },

        /**
         * check if we click on art
         * @param x
         * @param y
         * @param currentArtIndex
         * @param type
         * @returns {boolean}
         */
        hitTest: function(x, y, currentArtIndex, type) {
            var currentArt;

            if (type === 'rotate') {
                return (x < (this.controls.rotate.x + this.controls.rotate.width)) &&
                    (y < (this.controls.rotate.y + this.controls.rotate.height)) &&
                    (x > this.controls.rotate.x) && (y > this.controls.rotate.y);
            } else {
                currentArt = this.artArr[currentArtIndex];

                return (x < (currentArt.x + currentArt.width)) &&
                    (y < (currentArt.y + currentArt.height)) &&
                    (x > currentArt.x) && (y > currentArt.y);
            }
        }
    });

    var CanvasBaseModule = new CanvasBase();

    app.CanvasBase = CanvasBase;
}).call(window.DCX = window.DCX || {}, jQuery, window, document);
