// JavaScript Document
// jQuery.divselect = function(textword,droplist,changetext) {
//         textword.unbind("click").click(function(e){
// 		droplist.hide();
//         if($(this).siblings(droplist).css("display")=="none"){
//            $(this).siblings(droplist).slideDown("fast");
//         }else{
//             $(this).siblings(droplist).slideUp("fast");
//         }
// 		e.stopPropagation();
//     });
//     	changetext.click(function(){
//         var txt = $(this).text();
//         $(this).parent().siblings(textword).html(txt);
//         droplist.hide();
//     });
// 		$(document).click(function(){
// 		droplist.hide();
// 	});
// };
//调用方式
/*<script>
$(function(){
    $.divselect(textword,droplist,changetext);
});
</script>*/


// 下拉列表
jQuery.divselect = function (textword, droplist, changetext,toggleclass) {
    textword.unbind("click").click(function (e) {
        droplist.hide();
        if ($(this).siblings(droplist).css("display") == "none") {
            $(this).siblings(droplist).slideDown("fast");
            $(this).parent().addClass(toggleclass)
        } else {
            $(this).siblings(droplist).slideUp("fast");
            $(this).parent().removeClass(toggleclass)
        }
        e.stopPropagation();
    });
    changetext.click(function () {
        var txt = $(this).text();
        var code = $(this).attr('data-code');
        $(this).parent().siblings(textword).html(txt);
        $(this).parent().siblings(textword).attr('data-code', code);
        droplist.hide();
        textword.parent().removeClass(toggleclass)
    });
    $(document).click(function () {
        droplist.hide();
        textword.parent().removeClass(toggleclass)
    });
};