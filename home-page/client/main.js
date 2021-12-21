
function onScrollDownBtnClick(){
    $("html, body").animate({
        scrollTop: $(".projects-page").offset().top - 200
    }, "slow");
}

window.app = {};

$(document).ready(function (){
    app.dataService = new DataService();
    new UI_Main();
})
