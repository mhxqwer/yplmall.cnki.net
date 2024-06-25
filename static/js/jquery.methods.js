/*
 *  自定义jquery方法，每个方法都必须有注释
 *  注释规范：方法名、参数解释、方法说明、返回值说明
 *  严禁改写已有方法，如不满足使用，可以复制粘贴重命名后修改
 */
;
(function ($) {
    $.extend({
        // 看典项目
        kd: {
            /*
             *  关键词转数组
             *  str为需要转化的字符串
             *  分隔符包括两个分号，一个分号，冒号，逗号，中文逗号，两个空格，一个空格（根据kbase数据库存储格式分隔）
             *  返回分隔后的数组
             */
            stringToArray: function (str) {
                if (str.trim().length) {
                    if (str.indexOf(';;') != -1) {
                        return str.split(';;');
                    } else if (str.indexOf(';') != -1) {
                        return str.split(';');
                    } else if (str.indexOf('  ') != -1) {
                        return str.split('  ');
                    } else if (str.indexOf(' ') != -1) {
                        return str.split(' ');
                    } else if (str.indexOf(',') != -1) {
                        return str.split(',');
                    } else if (str.indexOf('，') != -1) {
                        return str.split('，');
                    } else if (str.indexOf(':') != -1) {
                        return str.split(':');
                    } else if (str.indexOf('：') != -1) {
                        return str.split('：');
                    }
                    return [str];
                } else {
                    return '';
                }
            },

            /*
             *  看典页码分页字符串输出
             *  total为数据总数，displayNum为页面显示条目数， pagerCount为页码显示几位数，currentPager为当前的页码
             *  此方法根据看典pc样式输出页码，里面嵌入了样式，
             *  返回页码字符串
             */
            outputPager: function (total, displayNum, pagerCount, currentPager) {
                var currentPager = parseInt(currentPager);
                if (total > 0 && displayNum > 0 && pagerCount > 0 && currentPager > 0) {
                    // 计算总共多少页
                    var pages = Math.ceil((total / displayNum));

                    // 当前页码错误，显示第一页
                    if (currentPager > pages || currentPager <= 0) {
                        currentPager = 1;
                    }
                    // 页码字符串
                    var pagerStr = '';
                    // 当前页不为第一页时，显示上一页
                    if (currentPager != 1) {
                        pagerStr += '<a data-page="' + 1 + '" href="javascript:;">首页</a>';
                        pagerStr += '<a data-page="' + (currentPager - 1) + '" href="javascript:;">上一页</a>';
                    }
                    if (pages <= 5) {
                        for (var i = 1; i <= pages; i++) {
                            if (currentPager == i) {
                                pagerStr += '<span class="current">' + i + '</span>';
                            } else {
                                pagerStr += '<a data-page="' + i + '" href="javascript:;">' + i + '</a>';
                            }
                        }
                    } else {
                        if (currentPager + 2 <= pages) {
                            if (currentPager < 5) {
                                for (var i = 1; i <= 5; i++) {
                                    if (currentPager == i) {
                                        pagerStr += '<span class="current">' + i + '</span>';
                                    } else {
                                        pagerStr += '<a data-page="' + i + '" href="javascript:;">' + i + '</a>';
                                    }
                                }
                                pagerStr += '<span>...</span>';
                            } else {
                                pagerStr += '<span>...</span>';
                                for (var i = currentPager - 2; i < currentPager + 2; i++) {
                                    if (currentPager == i) {
                                        pagerStr += '<span class="current">' + i + '</span>';
                                    } else {
                                        pagerStr += '<a data-page="' + i + '" href="javascript:;">' + i + '</a>';
                                    }
                                }
                                pagerStr += '<span>...</span>';
                            }
                        } else {
                            pagerStr += '<span>...</span>';
                            for (var i = currentPager - 2; i <= pages; i++) {
                                if (currentPager == i) {
                                    pagerStr += '<span class="current">' + i + '</span>';
                                } else {
                                    pagerStr += '<a data-page="' + i + '" href="javascript:;">' + i + '</a>';
                                }
                            }
                        }
                    }
                    // 总页面大于要显示的页码数
                    // if (pages >= pagerCount) {
                    //     // console.log('总页面大于要显示的页码数',(parseInt(currentPager) + parseInt(pagerCount) - 1))
                    //     if (parseInt(parseInt(currentPager) + parseInt(pagerCount) - 1) <= pages) { //页码可以全部显示
                    //         // console.log('页码可以全部显示')
                    //         for (var j = currentPager; j < parseInt(currentPager) + parseInt(pagerCount); j++) {
                    //             if (currentPager == j) {
                    //                 pagerStr += '<span class="current">' + j + '</span>';
                    //             } else {
                    //                 pagerStr += '<a data-page="' + j + '" href="javascript:;">' + j + '</a>';
                    //             }
                    //         }
                    //         pagerStr += '<span>...</span>';
                    //     } else {
                    //         // console.log('页码不可以全部显示')
                    //         for (var j = parseInt(pages - pagerCount + 1); j <= pages; j++) { //页码显示不全
                    //             if (currentPager == j) {
                    //                 pagerStr += '<span class="current">' + j + '</span>';
                    //             } else {
                    //                 pagerStr += '<a data-page="' + j + '" href="javascript:;">' + j + '</a>';
                    //             }
                    //         }
                    //     }
                    // } else { // 总页面小于要显示的页码数
                    //     // console.log('总页面小于要显示的页码数')
                    //     for (var i = 1; i <= pages; i++) {
                    //         if (currentPager == i) {
                    //             pagerStr += '<span class="current">' + i + '</span>';
                    //         } else {
                    //             pagerStr += '<a data-page="' + i + '" href="javascript:;">' + i + '</a>';
                    //         }
                    //     }
                    // }
                    // 不为最后一页
                    if (currentPager != pages) {
                        pagerStr += '<a data-page="' + parseInt(currentPager + 1) + '" href="javascript:;">下一页</a><a data-page="' + pages + '" href="javascript:;">尾页</a>';
                    }
                    return pagerStr;
                } else {
                    // 什么都不做
                }
            },


            yyoutputPager: function (total, displayNum, pagerCount, currentPager) {
                if (total > 0 && displayNum > 0 && pagerCount > 0 && currentPager > 0) {
                    // 计算总共多少页
                    var pages = Math.floor(((total - 1) / displayNum) + 1);

                    // 当前页码错误，显示第一页
                    if (currentPager > pages || currentPager <= 0) {
                        currentPager = 1;
                    }
                    // 页码字符串
                    var pagerStr = '';
                    // 当前页不为第一页时，显示上一页

                    pagerStr += '<a data-page="' + parseInt(currentPager - 1) + '" href="javascript:;"> < </a>';
                    // 总页面大于要显示的页码数
                    if (pages >= pagerCount) {
                        // console.log('总页面大于要显示的页码数',(parseInt(currentPager) + parseInt(pagerCount) - 1))
                        if (parseInt(parseInt(currentPager) + parseInt(pagerCount) - 1) <= pages) { //页码可以全部显示
                            // console.log('页码可以全部显示')
                            for (var j = currentPager; j < parseInt(currentPager) + parseInt(pagerCount); j++) {
                                if (currentPager == j) {
                                    pagerStr += '<span class="current">' + j + '</span>';
                                } else {
                                    pagerStr += '<a data-page="' + j + '" href="javascript:;">' + j + '</a>';
                                }
                            }
                        } else {
                            // console.log('页码不可以全部显示')
                            for (var j = parseInt(pages - pagerCount + 1); j <= pages; j++) { //页码显示不全
                                if (currentPager == j) {
                                    pagerStr += '<span class="current">' + j + '</span>';
                                } else {
                                    pagerStr += '<a data-page="' + j + '" href="javascript:;">' + j + '</a>';
                                }
                            }
                        }
                    } else { // 总页面小于要显示的页码数
                        // console.log('总页面小于要显示的页码数')
                        for (var i = 1; i <= pages; i++) {
                            if (currentPager == i) {
                                pagerStr += '<span class="current">' + i + '</span>';
                            } else {
                                pagerStr += '<a data-page="' + i + '" href="javascript:;">' + i + '</a>';
                            }
                        }
                    }
                    // 不为最后一页
                    if (currentPager != pages) {
                        pagerStr += '<a data-page="' + parseInt(parseInt(currentPager) + parseInt(1)) + '" href="javascript:;"> > </a>';
                    }
                    return pagerStr;
                } else {
                    // 什么都不做
                }
            },
            /*
             *  看典页码上一页、下一页输出
             *  total为数据总数，displayNum为页面显示条目数， pagerCount为页码显示几位数，currentPager为当前的页码
             *  此方法根据看典pc样式输出页码，里面嵌入了样式，
             *  返回页码对象
             */
            outputPrevNextPager: function (total, displayNum, pagerCount, currentPager) {
                // 页码字符串对象
                var prevNextPage = {
                    prevPage: '',
                    nextPage: ''
                };

                if (total > 0 && displayNum > 0 && pagerCount > 0 && currentPager > 0) {
                    // 计算总共多少页
                    var pages = Math.floor(((total - 1) / displayNum) + 1);

                    // 当前页码错误，显示第一页
                    if (currentPager > pages || currentPager <= 0) {
                        currentPager = 1;
                    }

                    // 当前页不为第一页时，显示上一页
                    if (currentPager != 1) {
                        prevNextPage.prevPage += '<a data-page="' + parseInt(currentPager - 1) + '" href="javascript:;">上一页</a>';
                    }

                    // 不为最后一页
                    if (currentPager != pages) {
                        prevNextPage.nextPage += '<a data-page="' + parseInt(parseInt(currentPager) + parseInt(1)) + '" href="javascript:;">下一页</a>';
                    }
                    return prevNextPage;
                } else {
                    return false;
                }
            },

            /*
             *  搜索结果关键字标红
             *  str为接口获取到的字符串，prefix为前缀， postfix为后缀，keyword为关键字
             *  此方法根据看典pc样式输出，里面嵌入了样式，
             *  返回处理后字符串
             */
            keywordStyleRed: function (str, prefix, postfix, keyword) {
                var prefixPosition = str.indexOf(prefix);
                var postfixPosition = str.indexOf(postfix);
                if (prefixPosition != -1 && postfixPosition) {
                    var newStr = str.replace(new RegExp(prefix, 'g'), '<span class="cRed">');
                    newStr = newStr.replace(new RegExp(postfix, 'g'), '</span>');
                    return newStr;
                } else if (keyword) {
                    var newStr = str.replace(new RegExp(keyword, 'g'), '<span class="cRed">' + keyword + '</span>');
                    return newStr;
                } else {
                    return str;
                }
            },
            // 时间戳转化成时间：
            dateFormat: function (date) {
                var date = new Date(date);
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
                var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
                var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
                return Y + M + D + h + m + s;
            },
            // 搜索结果页 ‘|’输出
            boundaryOutput: function (str) {
                // var str = str.trim();
                if (str && str.length > 0) {
                    return '|';
                } else {
                    return ''
                }
            },
            // 获取参数：
            getparams: function (name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = decodeURI(location.search).substr(1).match(reg);
                if (r != null) return (r[2]);
                return null;
            }
        }
    })
})(jQuery);