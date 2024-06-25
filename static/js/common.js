//将时间戳转换成正常时间格式
function timestampToTime(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D;
}

// 字符串截取 包含对中文处理,str需截取字符串,start开始截取位置,n截取长度
function subStr(str, start, n) { // eslint-disable-line
    if (str.replace(/[\u4e00-\u9fa5]/g, '**').length <= n) {
        return str;
    }
    var len = 0;
    var tmpStr = '';
    for (var i = start; i < str.length; i++) { // 遍历字符串
        if (/[\u4e00-\u9fa5]/.test(str[i])) { // 中文 长度为两字节
            len += 2;
        } else {
            len += 1;
        }
        if (len > n) {
            break;
        } else {
            tmpStr += str[i];
        }
    }
    return tmpStr;
}

function getBlength (str) {
    for (var i = str.length, n = 0; i--; ) {
        n += str.charCodeAt(i) > 255 ? 2 : 1;
    }
    return n;
}
function cutstr(str, len, endstr){
    var len = +len,
        endstr = typeof(endstr) == 'undefined' ? "..." : endstr.toString(),
        endstrBl = getBlength(endstr);
    function n2(a) {var n = a / 2 | 0; return (n > 0 ? n : 1)}//用于二分法查找
    if (!(str + "").length || !len || len <= 0) {
        return "";
    }
    if(len<endstrBl){
        endstr = "";
        endstrBl = 0;
    }
    var lenS = len - endstrBl,
        _lenS = 0,
        _strl = 0;
    while (_strl <= lenS) {
        var _lenS1 = n2(lenS - _strl),
            addn = getBlength(str.substr(_lenS, _lenS1));
        if (addn == 0) {return str;}
        _strl += addn
        _lenS += _lenS1
    }
    if(str.length - _lenS > endstrBl || getBlength(str.substring(_lenS-1))>endstrBl){
        return str.substr(0, _lenS - 1) + endstr
    }else{
        return str;
    }
}




String.prototype.replaceAll = function (FindText, RepText) {
    return this.replace(new RegExp(FindText, "g"), RepText);
}

function toAddOrder(url) {
    var submitForm = document.createElement("form");
    submitForm.setAttribute("name", "jsDownForm");
    submitForm.target = "_blank";
    submitForm.method = "post";
    submitForm.action = url;
    document.body.appendChild(submitForm);
    submitForm.submit();
    document.body.removeChild(submitForm)

}