class UI_Header {
    html;

    constructor() {
        this.setHtml();
    }

    setHtml(){
        $.get("./components/header/header.html",  (result) => {
            this.html = result;
            $(".header-wrap").html(this.html);

            app.dataService.onSelectedItemQueueEvent.push((arrayLength) => {
                this.onSelectedDeleted(arrayLength);
            });

            this.initEvents();
       });
    }

    initEvents(){
        $(".search-btn").click(function (){
            app.dataService.fillterItems($(".input").val())
        })
        $(".threeRows").click(function (){
            if( $(".menu-list").hasClass("show")){
                $(".menu-list").removeClass("show")
                $(".menu-list .inside-menu").removeClass("show")
            }else {
                $(".menu-list").addClass("show")
                $(".menu-list .inside-menu").addClass("show")
            }
           
        })
        $(".compose-wrap").click(function () {
            if(!app.composeDialog){
                app.composeDialog = true;
                new ComposeDialog();
                $(".compose-dialog-wrap").removeClass("hide");
            }
        });
    }

    onSelectedDeleted(selectedLength){
    }
}   