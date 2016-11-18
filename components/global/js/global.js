;(function() {
    'use strict';

    var app = this;

    app.EVENTS = {
        SET_BASE_PRODUCT: 'setBaseProduct',
        EXPORT_INIT: 'exportInit',
        EXPORT_COMPLETE: 'exportComplete',
        SET_ART: 'setArt',
        REMOVE_ART: 'removeArt',
        CHANGE_INDEX: 'changeIndex',
        CLEAR_ALL: 'clearAll',
        CUSTOM_DRAWING_START: 'customDrawingAdd',
        CUSTOM_DRAWING_END: 'customDrawingEnd',
        CUSTOM_DRAWING_SIZE: 'customDrawingSize',
        CUSTOM_DRAWING_COLOR: 'customDrawingColor'
    };

    app.CURRENT_ARTS_COUNTER = 0;

}).call(window.DCX = window.DCX || {});