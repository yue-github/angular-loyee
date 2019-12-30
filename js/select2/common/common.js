define(function(require, exports, module) {
    /**
     * 初始化seaJS
     */
    seajs.config({
        charset: 'utf-8',

        //设置别名,方便调用
        alias : {
            'bootstrap': 'bootstrap/dist/js/bootstrap.min.js'
        },

        // 预加载
        preload: []

    });

});