/*suggest*/
var maxResults = 10;
var xmlDom = null;

var mallDomainUrl = "";

function doHeadSearch() {
    btnSearchData();
}
function doHeadSearch_aiplus() {
    var selKeys = document.getElementById("headq").value;
    var selType = document.getElementById("searchtype").value;
    if (selKeys == "" || selKeys == "只输入书刊名即可") {
        selKeys = "";
    }
    selKeys = encodeURIComponent(selKeys);
    var url = "https://aiplus.cnki.net/aiplus/?question="+selKeys+"&type=fulllib";
    // if($(".m-title .keyword").length>0){
    //     //如果是搜索页面，则在当前页面打开
    //     window.open(url,'_self');
    // }else{
        window.open(url);
    // }
    return false;
}
function btnSearchData() {
    var selKeys = document.getElementById("headq").value;
    var selType = document.getElementById("searchtype").value;
    if (selKeys == "" || selKeys == "只输入书刊名即可") {
        selKeys = "";
    }
    var results = document.getElementById("results");
    if (results.hasChildNodes()) {
        clearSuggest();
    }
    selKeys = encodeURIComponent(selKeys);
    var urlValue = "";

    var domain = "/mallsearch/home/";
    switch (selType) {
        case "0": //全部出版物
            urlValue = domain + "index?keys=" + selKeys;
            break;
        case "1": //期刊
        default:
            urlValue = domain + "maga?keys=" + selKeys;
            break;
        case "2": //报纸
            urlValue = "/newspaper/papersearchlist.aspx?keywd=" + selKeys;
            break;
        case "3": //图书
            urlValue = domain + "book?keys=" + selKeys;
            break;
        case "4": //工具书
            urlValue = domain + "rbook?keys=" + selKeys;
            break;
        case "5": //文献
            urlValue = domain + "article?keys=" + selKeys;
            break;
    }
    // TODO 切换新版时，需要注意
    // var mallDomainUrl2=mallDomainUrl;
    // if($("#springbootActiveProfiles").length>0){
    //     var activeProfiles=$("#springbootActiveProfiles").val();
    //     if(activeProfiles.indexOf("dev")>-1 && $("#contextPath").length>0){
    //         mallDomainUrl2=$("#contextPath").val();
    //     }
    // }
    //走新版的用下面这个，老版本的有上面的
    var mallDomainUrl2=$("#contextPath").val();

    if($(".m-title .keyword").length>0){
        //如果是搜索页面，则在当前页面打开
        window.open(mallDomainUrl2 + urlValue,'_self');
    }else{
        window.open(mallDomainUrl2 + urlValue);
    }


    return false;
}

// 旧方法，请求的是.net项目中的接口
// function textChanged(evt) {
//     var e = window.event ? window.event : evt;
//     var o = window.event ? window.event.srcElement : evt.target;
//     var v = o.value;
//     var keyCode = e.keyCode;
//     v = v.replace("'", "''");
//     var selType = document.getElementById("searchtype").value;
//
//     var reqUrl = mallDomainUrl + "/mallsearch/api/SearchApi/TipWordsForCors" + "?jsoncallback=?&v=" + Math.random();
//     $.ajax({
//         url: reqUrl,
//         type: "POST",
//         dataType: "jsonp",
//         data: {"name": v, "t": selType},
//         error: function (XMLHttpRequest, textStatus, errorThrown) {
//             console.log(errorThrown);
//         },
//         success: function (data, textStatus, jqXHR) {
//             xmlDom = createXmlDom(data.res);
//             suggest(v, keyCode, o);
//         }
//     });
//
// }

function textChanged(evt) {
    var e = window.event ? window.event : evt;
    var o = window.event ? window.event.srcElement : evt.target;
    var v = o.value;
    var keyCode = e.keyCode;
    v = v.replace("'", "''");
    var selType = document.getElementById("searchtype").value;

    var ctx2=$("#contextPath").val();
    var reqUrl = ctx2 + "/mallsearch/TipWords";
    $.ajax({
        url: reqUrl,
        type: "POST",
        dataType: "json",
        data: {"name": v, "t": selType},
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
        },
        success: function (data) {
            if(!!data && data.length>0){
                suggest(v, keyCode, o,data);
            }

        }
    });

}

function suggest(keywords, keyCode, object,terms) {
    var results = document.getElementById("results");
    if (keywords != "") {
        var ul = document.createElement("ul");
        var li;
        var a;
        if ((keyCode == '40' || keyCode == '38' || keyCode == '13')) {
            navigate(keyCode, object);
        } else {
            var kIndex = -1;
            for (var i = 0; i < terms.length; i++) {

                li = document.createElement("li");
                a = document.createElement("a");
                a.href = "javascript://";
                a.setAttribute("ref", terms[i]);
                a.onmouseover = function () {
                    var el = this.parentNode.parentNode.getElementsByTagName("a");
                    for (var index = 0, len = el.length; index < len; index++) {
                        el[index].className = "";
                    }
                    this.className = "hover";
                }
                a.onmouseout = function () {
                    this.className = "";
                }
                a.onclick = function () {
                    populate(this, object);
                }
                a.appendChild(document.createTextNode(""));
                if (keywords.length == 1) {
                    var kws = terms[i].toLowerCase().split(" ");
                    var firstWord = 0;
                    for (var j = 0; j < kws.length; j++) {
                        ul.appendChild(li);
                        if (j != 0) {
                            kIndex = terms[i].toLowerCase().indexOf(" " + keywords.toLowerCase());
                            kIndex++;
                        }
                        break;
                    }
                } else if (keywords.length > 1) {
                    ul.appendChild(li);
                } else continue;
                a.innerHTML = terms[i];
                li.appendChild(a);
            }

            if (results.hasChildNodes()) results.removeChild(results.firstChild);

            if (ul.hasChildNodes()) {
                results.appendChild(filterResults(ul));

                if (results.firstChild.childNodes.length == 1) {
                    results.firstChild.firstChild.getElementsByTagName("a")[0].className = "hover";
                    document.getElementById("keyIndex").value = "0";
                } else {
                    document.getElementById("keyIndex").value = "-1";
                }
            }
        }
    } else {
        if (results.hasChildNodes()) results.removeChild(results.firstChild);
    }
}




// function suggest(keywords, keyCode, object) {
//     var results = document.getElementById("results");
//     if (keywords != "") {
//         var terms = get_data();
//         var ul = document.createElement("ul");
//         var li;
//         var a;
//         if ((keyCode == '40' || keyCode == '38' || keyCode == '13')) {
//             navigate(keyCode, object);
//         } else {
//             var kIndex = -1;
//             for (var i = 0; i < terms.length; i++) {
//
//                 li = document.createElement("li");
//                 a = document.createElement("a");
//                 a.href = "javascript://";
//                 a.setAttribute("ref", terms[i].val);
//                 a.onmouseover = function () {
//                     var el = this.parentNode.parentNode.getElementsByTagName("a");
//                     for (var index = 0, len = el.length; index < len; index++) {
//                         el[index].className = "";
//                     }
//                     this.className = "hover";
//                 }
//                 a.onmouseout = function () {
//                     this.className = "";
//                 }
//                 a.onclick = function () {
//                     populate(this, object);
//                 }
//                 a.appendChild(document.createTextNode(""));
//                 if (keywords.length == 1) {
//                     var kws = terms[i].val.toLowerCase().split(" ");
//                     var firstWord = 0;
//                     for (var j = 0; j < kws.length; j++) {
//                         ul.appendChild(li);
//                         if (j != 0) {
//                             kIndex = terms[i].val.toLowerCase().indexOf(" " + keywords.toLowerCase());
//                             kIndex++;
//                         }
//                         break;
//                     }
//                 } else if (keywords.length > 1) {
//                     ul.appendChild(li);
//                 } else continue;
//                 a.innerHTML = terms[i].val;
//                 li.appendChild(a);
//             }
//
//             if (results.hasChildNodes()) results.removeChild(results.firstChild);
//
//             if (ul.hasChildNodes()) {
//                 results.appendChild(filterResults(ul));
//
//                 if (results.firstChild.childNodes.length == 1) {
//                     results.firstChild.firstChild.getElementsByTagName("a")[0].className = "hover";
//                     document.getElementById("keyIndex").value = "0";
//                 } else {
//                     document.getElementById("keyIndex").value = "-1";
//                 }
//             }
//         }
//     } else {
//         if (results.hasChildNodes()) results.removeChild(results.firstChild);
//     }
// }

function createXmlDom(xmlstr) {
    if (window.DOMParser) {
        var p = new DOMParser();
        var doc = p.parseFromString(xmlstr, "text/xml");
        return doc;
    } else if (window.ActiveXObject) {
        var doc = new ActiveXObject("Msxml2.DOMDocument");
        doc.loadXML(xmlstr);
        return doc;
    } else {
        return false;
    }
}

function get_data() {
    var terms = new Array();
    var nodes = xmlDom.getElementsByTagName("row");

    var value = null;
    if (nodes != null) {
        for (var i = 0; i < nodes.length; i++) {
            node = nodes[i];
            value = node.firstChild.nodeValue;
            terms.push({val: value});
        }
    }
    return terms;
}

function filterResults(s) {
    var sorted = new Array();

    for (var i = 0; i < s.childNodes.length; i++) {
        sorted.push(s.childNodes[i]);
    }

    var ul = document.createElement("ul");
    var lis = sorted.sort(sortIndex);

    for (var j = 0; j < lis.length; j++) {
        if (j < maxResults) ul.appendChild(lis[j]);
        else break;
    }

    return ul;

}

function sortIndex(a, b) {
    return (a.getElementsByTagName("a")[0].rev - b.getElementsByTagName("a")[0].rev);
}

function navigate(key, object) {
    var results = document.getElementById("results");
    var keyIndex = document.getElementById("keyIndex");

    var i = keyIndex.value;

    if (i == "" || !i) i = -1;
    else i = parseFloat(i);

    var ul = results.childNodes[0];

    if (ul && ul.childNodes.length > 0) {

        var el = ul.getElementsByTagName("a");
        for (var index = 0, len = el.length; index < len; index++) {
            el[index].className = "";
        }

        if (key == '40') {
            i++;
            if (i > ul.childNodes.length - 1) i = ul.childNodes.length - 1;

            keyIndex.value = i;

            try {
                ul.childNodes[i].getElementsByTagName("a")[0].className = "hover";
                document.getElementById(object.id).value = ul.childNodes[i].getElementsByTagName("a")[0].getAttribute("ref");
                ul.childNodes[i - 1].getElementsByTagName("a")[0].className = "";

            } catch (e) {
            }
        } else if (key == '38') {
            i--;
            if (i <= 0) i = 0;

            keyIndex.value = i;

            try {
                ul.childNodes[i].getElementsByTagName("a")[0].className = "hover";
                document.getElementById(object.id).value = ul.childNodes[i].getElementsByTagName("a")[0].getAttribute("ref");
                ul.childNodes[i + 1].getElementsByTagName("a")[0].className = "";
            } catch (e) {
            }
        } else if (key == '13' || key == '9') {
            if (i == -1) {
                hideSuggest();
            } else {
                populate(ul.childNodes[i].getElementsByTagName("a")[0], object);
            }
        } else return;
    }
}

function tabfix(keywords, keyCode, object) {
    if (keyCode.keyCode == '9') {
        navigate(keyCode, object);
        return false;
    } else return true;
}

function populate(a, object) {
    try {
        document.getElementById(object.id).value = a.getAttribute("ref");
    } catch (e) {
    }
    clearSuggest();
}

function findPos(obj) {
    var curleft = curtop = 0;
    if (obj.offsetParent) {
        curleft = obj.offsetLeft
        curtop = obj.offsetTop
        try {
            while (true) {
                var tagname = obj.offsetParent.offsetParent.tagName.toUpperCase()
                if ((tagname != "HTML") && (tagname != "BODY")) {
                    obj = obj.offsetParent;
                    curleft += obj.offsetLeft;
                    curtop += obj.offsetTop;
                } else {
                    break;
                }
            }
        } catch (ee) {
        }
    }
    return [curleft, curtop];
}

function getOffsetLeft(o) {
    var left = 0;
    var offsetParent = o;
    while (offsetParent != null && offsetParent != document.body) {
        left += offsetParent.offsetLeft;
        offsetParent = offsetParent.offsetParent;
    }
    return left;
}

function clearSuggest() {
    setTimeout("hideSuggest()", 200);
}

function hideSuggest() {
    var results = document.getElementById("results");
    if (results.hasChildNodes()) results.removeChild(results.firstChild);
    document.getElementById("keyIndex").value = "-1"; // reset the suggestions index
}

function setSearchTextAndType(type) {
    var oldSearchText = $("#headq").val();
    if (oldSearchText.length == 0 || oldSearchText.indexOf("搜期刊") != -1 || oldSearchText.indexOf("搜图书") != -1 || oldSearchText.indexOf("请输入您要查找文献的关键词") != -1 || oldSearchText.indexOf("搜工具书") != -1) {
        var tempSearchText = "搜期刊、图书、工具书、文献";
        switch (parseInt(type)) {
            case 1:
                tempSearchText = "搜期刊";
                break;
            case 3:
                tempSearchText = "搜图书";
                break;
            case 4:
                tempSearchText = "搜工具书";
                break;
            case 5:
                tempSearchText = "请输入您要查找文献的关键词";
                break;
            default:
                tempSearchText = "搜期刊、图书、工具书、文献";
                break;
        }
        // $("#headq").val(tempSearchText);
    }
}

function onblurSearchTextHandler(el) {
    if (el.value == '') {
        var tempSearchType = parseInt($("#searchtype").val());
        setSearchTextAndType(tempSearchType);
        el.style.color = '#999';
    }
    ;
    clearSuggest();
}

//清空默认关键词
function onclickSearchTextHandler(el) {
    if (el.value == '只输入书刊名即可' || el.value.indexOf("搜期刊") != -1 || el.value.indexOf("搜图书") != -1 || el.value.indexOf("请输入您要查找文献的关键词") != -1 || el.value.indexOf("搜工具书") != -1) {
        el.value = '';
        el.style.color = '';
    }
}

function changeSearchTypeHandler(elname, el) {
    setSearchTextAndType($("#" + elname).val());
}
