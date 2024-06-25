//共用 js
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim = function () {
    return this.replace(/(^\s*)/g, "");
}
String.prototype.rtrim = function () {
    return this.replace(/(\s*$)/g, "");
}

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "H+": this.getHours(),                   //小时
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

var formatDateTime = function (date, format) {
    if (format == undefined || format == null) {
        format = "yyyy-MM-dd HH:mm:ss";
    }
    return date.format(format);
}

// 兼容 IE 中 filter 属性
if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun /*, thisp */) {
        "use strict";

        if (this === void 0 || this === null)
            throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function")
            throw new TypeError();

        var res = [];
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, t))
                    res.push(val);
            }
        }

        return res;
    };
}

function deepCompare(x, y) {
    var i, l, leftChain, rightChain;

    function compare2Objects(x, y) {
        var p;

        // remember that NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
            return true;
        }

        // Compare primitives and functions.     
        // Check if both arguments link to the same object.
        // Especially useful on the step where we compare prototypes
        if (x === y) {
            return true;
        }

        // Works in case when functions are created in constructor.
        // Comparing dates is a common scenario. Another built-ins?
        // We can even handle functions passed across iframes
        if ((typeof x === 'function' && typeof y === 'function') ||
            (x instanceof Date && y instanceof Date) ||
            (x instanceof RegExp && y instanceof RegExp) ||
            (x instanceof String && y instanceof String) ||
            (x instanceof Number && y instanceof Number)) {
            return x.toString() === y.toString();
        }

        // At last checking prototypes as good as we can
        if (!(x instanceof Object && y instanceof Object)) {
            return false;
        }

        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
            return false;
        }

        if (x.constructor !== y.constructor) {
            return false;
        }

        if (x.prototype !== y.prototype) {
            return false;
        }

        // Check for infinitive linking loops
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
            return false;
        }

        // Quick checking of one object being a subset of another.
        // todo: cache the structure of arguments[0] for performance
        for (p in y) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            } else if (typeof y[p] !== typeof x[p]) {
                return false;
            }
        }

        for (p in x) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            } else if (typeof y[p] !== typeof x[p]) {
                return false;
            }

            switch (typeof (x[p])) {
                case 'object':
                case 'function':

                    leftChain.push(x);
                    rightChain.push(y);

                    if (!compare2Objects(x[p], y[p])) {
                        return false;
                    }

                    leftChain.pop();
                    rightChain.pop();
                    break;

                default:
                    if (x[p] !== y[p]) {
                        return false;
                    }
                    break;
            }
        }

        return true;
    }

    if (arguments.length < 1) {
        return true; //Die silently? Don't know how to handle such case, please help...
        // throw "Need two or more arguments to compare";
    }

    for (i = 1, l = arguments.length; i < l; i++) {

        leftChain = []; //Todo: this can be cached
        rightChain = [];

        if (!compare2Objects(arguments[0], arguments[i])) {
            return false;
        }
    }

    return true;
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return "";
}

function GetLocalCookie(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;

        if (document.cookie.substring(i, j) == arg) {
            return getCookieVal(j);
        }

        i = document.cookie.indexOf(" ", i) + 1;

        if (i == 0)
            break;
    }

    return null;
}

function getCookieVal(offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1) {
        endstr = document.cookie.length;
    }

    return unescape(document.cookie.substring(offset, endstr));
}

var layerloading = null;
var $ajaxFunc = function (reqUrl, jsonData, dataType, callback, isLoading) {
    if (layer && (isLoading == undefined || isLoading == null)) {
        layerloading = layer.load();
    }
    var ajaxRequestCount = 0;

    //return function (){
    function doAjax() {
        $.ajax({
            type: "POST",
            url: reqUrl,
            data: jsonData,
            dataType: dataType,
            success: function (data, textStatus, jqXHR) {
                if (layer && typeof (layer.close) == "function" && layerloading != null) {
                    layer.close(layerloading);
                }
                if (window.console && console.log) {
                    console.log(data);
                }
                if (typeof callback === "function") {
                    callback(data);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                if (console.log)
                    console.log("ajax requestCount:" + ajaxRequestCount + ". textStatus:" + textStatus + ". error:" + xhr.statusText);
                if (ajaxRequestCount < 1) {
                    ajaxRequestCount++;
                    doAjax();
                } else {
                    if (layer && typeof (layer.close) == "function" && layerloading != null) {
                        layer.close(layerloading);
                    }
                }
            }
        });
    }

    doAjax();
};

var $ajaxFunc_body = function (reqUrl, jsonData, dataType, callback) {
    if (layer) {
        layerloading = layer.load();
    }
    var ajaxRequestCount = 0;

    function doAjax() {
        $.ajax({
            type: "POST",
            url: reqUrl,
            contentType: "application/json",
            data: JSON.stringify(jsonData),
            dataType: dataType,
            success: function (data, textStatus, jqXHR) {
                if (layer && typeof (layer.close) == "function" && layerloading != null) {
                    layer.close(layerloading);
                }
                if (window.console && console.log) {
                    console.log(data);
                }
                if (typeof callback === "function") {
                    callback(data);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                if (console.log)
                    console.log("ajax requestCount:" + ajaxRequestCount + ". textStatus:" + textStatus + ". error:" + xhr.statusText);
                if (ajaxRequestCount < 1) {
                    ajaxRequestCount++;
                    // doAjax();
                } else {
                    if (layer && typeof (layer.close) == "function" && layerloading != null) {
                        layer.close(layerloading);
                    }
                }
            }
        });
    }

    doAjax();
};

function initPage(pageIndex, pageSize, totalCount, el, callback) {
    layui.use('laypage', function () {
        if (totalCount <= 0) {
            $("#" + el).html("");
            return false;
        }

        var laypage = layui.laypage;
        laypage.render({
            elem: el,
            curr: pageIndex || 1,
            limit: pageSize,
            count: totalCount,
            jump: function (obj, first) {
                if (!first) {
                    if (typeof callback === "function") {
                        callback(obj.curr);
                    }
                }
            }
        });
    });
}


function StrTrim(str) {
    if (!str)
        return "";
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

var layerIndex = null;

function LayerMsg(msg) {
    layerIndex = layer.msg(msg, {time: 1200});//layer.msg(msg, { time: 1000, offset: ['25%', '25%'] });
}

function head_search() {
    var kw = $("#txtheadsearchkw").val().trim();
    if (kw.length > 0) {
        var url = $("#contextPath").val() + "/search/" + $("#hidtxtorgid").val() + "?kw=" + encodeURIComponent(kw);
        var a = $("<a href='" + url + "' target='_blank'>--</a>").get(0);
        var e = document.createEvent('MouseEvents');
        e.initEvent('click', true, true);
        a.dispatchEvent(e);
    }
}

//在线客服
function OpenWin_TTKN400(iGroupID, sGroupName, iPageID, sPageName) {
    var strURL = 'http://help.cnki.net/Live800_1_0.aspx?GroupID=' + iGroupID + '&PageID=' + iPageID;
    var WinTTKN400 = window.open(strURL, 'TTKN400OnLine',
        'toolsbar=no,statusbar=no,resizable=no,scrollbars=no,width=575,height=425,top=' + (screen.height - 425) / 2
        + ',left=' + (screen.width - 570) / 2 + '');
    if (WinTTKN400 == null) {
        alert("开启在线咨询窗口失败！");
    }
}

