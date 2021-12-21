$(document).ready(function () {
    $(window.scroll).scroll(function () {
        if(window.pageYOffset > 600){
            $(".arrow-up-wrap").removeClass("hide")
        }else {
            $(".arrow-up-wrap").addClass("hide")
        }
    })
})
function onScrollDownBtnClick(){
    $("html, body").animate({
        scrollTop: $(".projects-page").offset().top
    }, "slow");
}

function onArrowUpClick(){
    $("html, body").animate({
        scrollTop: $(".welcome-page").offset().top - 0
    }, "slow");
}

