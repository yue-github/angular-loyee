//  var baseUrl='http://localhost:8080/eshop/';
// var baseUrl='https://service.eebin.com/';//正式服cc
// var baseUrl='http://192.168.31.96:8080/';//
// var baseUrl='http://192.168.31.180:8765/';//
var baseUrl='http://localhost:8765/';//
// var baseUrl='http://127.0.0.1:8765/';//
// var baseUrl='https://loyee.coral3.com/';//
var $byLayer = {};

var icons = {
    'success': 1,
    'failed': 2,
    'question': 3,
    'warning': 7
};
//加载
$byLayer.loading =function () {
    return layer.load(0, {shade: 0.5});
};
//关闭
$byLayer.close = function (index) {
    layer.close(index);
};
//提示
$byLayer.msg = function (text, type, callback) {
    if(!type) {
        type = 'success';
    }
    layer.msg(text, {icon: icons[type], time: 2000}, function(){
        if(callback) {
            callback();
        }
    });
};
//询问
$byLayer.confirm = function (text, success) {
    return layer.confirm(text, {icon: 3, title:'提示'}, function(index){
        success(index);
    });
}
//保留两位小数
$byLayer.toDecimal2=function(x){
    if(x){
        return parseFloat(x*1).toFixed(2);
    }else if(x==0){
        return parseFloat(x*1).toFixed(2);
    }else{
        return '0.00';
    }
}

//返回页数范围（用来遍历）
function getRange(curr, all, count) {
    //容错处理
    if (!curr || isNaN(curr) || curr < 1) curr = 1;
    if (!all || isNaN(all) || all < 1) all = 1;
    if (curr > all) curr = all;
    if (!count || isNaN(count) || count < 1) count = 10;
    //计算显示的页数
    curr = parseInt(curr);
    all = parseInt(all);
    count = parseInt(count);
    var from = curr - parseInt(count / 2);
    var to = curr + parseInt(count / 2) + (count % 2) - 1;
    //显示的页数容处理
    if (from <= 0) {
        from = 1;
        to = from + count - 1;
        if (to > all) {
            to = all;
        }
    }
    if (to > all) {
        to = all;
        from = to - count + 1;
        if (from <= 0) {
            from = 1;
        }
    }
    var range = [];
    for (var i = from; i <= to; i++) {
        range.push(i);
    }
    return range;
}
/**
 * 时间格式化
 * @param {Object} fmt
 */
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}








