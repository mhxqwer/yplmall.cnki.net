$(document).click(function(e){
    var menus= $('.keyword-menu'); //设置空白以外的目标区域
    var clicks = $('.keyword-click'); //设置空白以外的目标区域
    if(!menus.is(e.target) && menus.has(e.target).length === 0&&!clicks.is(e.target) && clicks.has(e.target).length === 0){
        //写你需要做的事件
        $(".keyword-menu").hide();
    }
})
function showMean(abcd){
    var keyword = $(abcd).attr("data-id");
    var kzt = $(abcd).attr("data-kzt");
    // console.log(keyword);
    var keywordmenu=$(abcd).find(".keyword-menu");
    if(keywordmenu&&keywordmenu.length>0){
        if(keywordmenu.is(':visible')){
            console.log("visible");
            $(".keyword-menu").hide();
            return;
        }
        else{
            $(".keyword-menu").hide();
            keywordmenu.show();
            return;
        }
    }
    $(".keyword-menu").hide();
    if(keyword){
        var contextPath = $("#contextPath").val();
        var reqUrl = contextPath + "/magazine/webapi/rbookentryexplainlist";
        var jsonData = {"kw": keyword, "kzt": kzt};
        $ajaxFunc(reqUrl, jsonData, "json", function (res) {
            if (res.code == 0) {
                var entrys = res.entry;
                var infodata = res.info;
                var html = '<div class="keyword-menu">' +
                    '                                    <div class="keyword-menu-explain">' +
                    '                                        <div class="keyword-menu-explain-title clearfix">' +
                    '                                            <div class="keyword-title-text">“' +keyword+
                    '”                                               释义' +
                    '                                            </div>' +
                    '                                            <a href="$" target="_blank" class="keyword-title-more">' +
                    '                                                更多释义&gt;' +
                    '                                            </a>' +
                    '                                        </div>' +
                    '###'+
                    '                                    </div>' +
                    '                                    <div class="keyword-menu-book">' +
                    '                                        <div class="keyword-menu-book-title clearfix">' +
                    '                                            <div class="keyword-title-text">' +
                    '                                                推荐工具书' +
                    '                                            </div>' +
                    '                                            <a href="$$" target="_blank" class="keyword-title-more">' +
                    '                                                更多工具书&gt;' +
                    '                                            </a>' +
                    '                                        </div>' +
                    '####'+
                    '                                    </div>' +
                    '                                </div>'
                var noempty=0;
                if(entrys&&entrys.code==0){
                    var entrylist=entrys.data.list;
                    var htmlentrys = '';
                    if(entrylist&&entrylist.length>0){
                        noempty= 1;
                        for(var i=0;i<entrylist.length && i<3;i++){
                            var thisEntry = entrylist[i];
                            htmlentrys += '<div class="keyword-menu-explain-item">' +
                                '<a href="/reference/ref_readerItem.aspx?recid='+thisEntry.EntryCode+'" target="_blank" class="keyword-menu-explain-item-title">'+
                                thisEntry.EntryName.replace(keyword,'<span>'+keyword+'</span>')+
                                '</a>' +
                                '<div class="keyword-menu-explain-item-text" onclick="gotoentrypage(\''+thisEntry.EntryCode+'\')">'+
                                '<a style="text-decoration:none;color:#000000;" href="/reference/ref_readerItem.aspx?recid='+thisEntry.EntryCode+'" target="_blank">'+thisEntry.Entry+'</a>' +
                                '</div>' +
                                '<a href="/reference/detail_'+thisEntry.BookCode+'.html" target="_blank" class="keyword-menu-explain-item-source">'+
                                thisEntry.BookName +'&nbsp;'+thisEntry.Publisher+'&nbsp;'+thisEntry.PublicationDate+
                                '</a>' +
                                '</div>';
                        }
                        html=html.replace("###",'<div class="keyword-menu-explain-items">###</div>');
                        html=html.replace("###",htmlentrys);
                        html=html.replace("$","/reference/searchresult_entry.aspx?keywd="+encodeURI(keyword));
                    }
                    else{
                        var nociHtml = '<div class="keyword-menu-explain-empty">\n' +
                            '                                            <div class="keyword-menu-explain-empty-text">\n' +
                            '                                                抱歉，没有找到标题与<span>“'+keyword+'”</span>相关的词条，您可以尝试换词检索:\n' +
                            '                                            </div>\n' +
                            '                                            <a href="/reference/searchresult_entry.aspx?keywd='+encodeURI(keyword)+'" target="_blank" class="keyword-menu-explain-empty-btn">\n' +
                            '                                                词条检索\n' +
                            '                                            </a>\n' +
                            '                                        </div>'
                        html=html.replace("###",nociHtml);
                        html=html.replace("$","/reference/searchresult_entry.aspx?keywd="+encodeURI(keyword));
                    }
                }
                if(infodata&&infodata.code==0){
                    var infolist=infodata.data.list;
                    var htminfos = '';
                    if(infolist&&infolist.length>0) {
                        noempty = 1;
                        for(var i=0;i<infolist.length&&i<3;i++){
                            var thisinfo = infolist[i];
                            htminfos += '<a href="/reference/detail_'+thisinfo.BookCode+'.html" target="_blank" title="'+thisinfo.BookName+'" class="keyword-menu-book-item">' +
                                '<img style="width:80px;height:120px;" src="//mall.cnki.net/crfdpic/small/'+thisinfo.BookCode+'fm_small.jpg" alt="" class="keyword-menu-book-img">' +
                                '<div class="keyword-menu-book-text">' +
                                thisinfo.BookName +
                                '</div>' +
                                '</a>';
                        }
                        html=html.replace("####",'<div class="keyword-menu-books clearfix">####</div>');
                        html=html.replace("####",htminfos);
                        html=html.replace("$$",'/reference/books.aspx?keywd='+encodeURI(keyword)+'&sel_type=0');
                    }
                    else{
                        var nociHtml = '<div class="keyword-menu-explain-empty">\n' +
                            '                                            <div class="keyword-menu-explain-empty-text">\n' +
                            '                                                抱歉，没有找到标题与<span>“'+keyword+'”</span>相关的工具书，您可以尝试换词检索:\n' +
                            '                                            </div>\n' +
                            '<a href="/reference/" target="_blank" class="keyword-menu-books-empty-btn">查找工具书</a>'+
                            '                                        </div>'

                        html=html.replace("####",nociHtml);
                        html=html.replace("$$",'/reference/');
                    }
                }
                $(abcd).html('释'+html)
                $(abcd).find(".keyword-menu").show();
            }
        })
    }
}

function gotoentrypage(entryCode){
    window.open("/reference/ref_readerItem.aspx?recid="+entryCode);
}

$(function(){
    var contextPath = $("#contextPath").val();
    var asynsysvsm = $("#asynsysvsm").val();
    var asyncatalog = $("#asyncatalog").val();


    if(asynsysvsm=='1'){//加载相似文献
        var articleFileName = $("#articleFileName").val();
        if(articleFileName){
            var jsonData = {"vsm": $("#vsm").val()};
            var reqUrl = contextPath + "/magazine/part/similararticle/"+articleFileName;
            $ajaxFunc(reqUrl, jsonData, "html",function (res) {
                $('.atop').append(res); //替换成新的数据
            },false);
        }
    }

    if(asyncatalog=='1'){//加载目录
        var magaThname=$("#magaThname").val();
        if(articleType&&magaThname){
            var reqUrl = contextPath + "/magazine/part/magacatelog/"+magaThname;

            $ajaxFunc(reqUrl, null, "html", function (res) {
                $('#cataloglist').append(res); //替换成新的数据
            },false);
        }
    }

})
