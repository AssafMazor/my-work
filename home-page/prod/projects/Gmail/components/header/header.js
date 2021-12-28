import {ComposeDialog} from "../composeDialog/composeDialog.js"

export class UI_Header {
    html;

    constructor() {
        this.setHtml();
    }

    setHtml(){
        $.get("./components/header/header.html",  (result) => {
            this.html = result;
            $(".header-wrap").html(this.html);

            app.dataService.onSelectedItemQueueEvent.subscribe((arrayLength) => {
                this.onSelectedDeleted(arrayLength);
            });

            this.initEvents();
       });
    }

    initEvents(){
        $(".search-btn").click(function (){
            app.dataService.fillterItems($(".input").val())
        })
        $(".threeRows").on("click" ,  (e) => {
            this.onThreeRowsClick();
        });
        $(".compose-wrap").on("click" ,  (e) => {
            this.onComposeWrapClick();
        });
    }

    //----------------------------------
    // onThreeRowsClick
    //----------------------------------

    onThreeRowsClick(){
        if( $(".menu-list").hasClass("show")){
            $(".menu-list").removeClass("show")
            $(".menu-list .inside-menu").removeClass("show")
        }else {
            $(".menu-list").addClass("show")
            $(".menu-list .inside-menu").addClass("show")
        }
    }

    //----------------------------------
    // onComposeWrapClick
    //----------------------------------

    onComposeWrapClick(){
        if(!app.composeDialog){
            app.composeDialog = true;
            new ComposeDialog();
            $(".compose-dialog-wrap").removeClass("hide");
        }
    }

    //----------------------------------
    // onSelectedDeleted
    //----------------------------------

    onSelectedDeleted(selectedLength){
    }
}   