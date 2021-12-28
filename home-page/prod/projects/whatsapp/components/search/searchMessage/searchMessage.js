import {searchMessageItem} from "../searchMessageItem/searchMessageItem.js";

export class searchMessageComponents {
    message;

    data = {
        messages :[]
    };

    constructor(message) {
        this.message = message
        this.setHtml();
    }
  
    setHtml() {
      $.get("./components/search/searchMessage/searchMessage.hbs",(result) => {
            this.template = Handlebars.compile(result);
            $(".search-message-panle").html(this.template());
  
            app.dataService.getContactList();
  
            this.initEvents();
        }
      );
    }

    initEvents(){
        $(".inside-message-input .search-input-message").on("input" , (e) => {
            this.onSearchInputMessageInput(e)
        })
        $(".exit-btn").on("click" , (e) => {
            this.onExitBtnClick(e)
        })
    }

    //----------------------------------
    // onSearchInputMessageInput
    //----------------------------------

    onSearchInputMessageInput(e){
        this.data.messages = app.dataService.fillterMessageHistory($(".search-input-message").val() , this.message[0].id);
        this.searchList();
    }

    //----------------------------------
    // onExitBtnClick
    //----------------------------------

    onExitBtnClick(e){
        $(".search-message-panle").addClass("hide")
    }

    searchList(){
        $(".search-message-panle .search-message-list").html("")
        this.data.messages.forEach((message)=>{
            new searchMessageItem(message , $(".inside-message-input .search-input-message").val());
        })
    }

        
    
}