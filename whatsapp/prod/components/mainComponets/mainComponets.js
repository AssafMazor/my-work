import {WelcomeComponent} from "../welcomeComponents/welcomeComponents.js";
import {ContactListComponent} from "../contactListComponents/contactListComponents.js";
import {MessagesComponent} from "../messageComponets/messageComponets.js";


export class UI_Main {

    constructor() {
        this.setHtml();

        app.dataService.onMessageChangeSubject.subscribe((data)=>{
            if(data.messages !== null){
                $(".right").addClass("hide");
                $(".message-wrap").removeClass("hide");
            }else {
                $(".right").removeClass("hide");
                $(".message-wrap").addClass("hide");
            }
        })
    }

    setHtml() {
        $.get("./components/mainComponets/mainComponets.hbs", (result) => {
          this.template = Handlebars.compile(result);
          $(".main-container").html(this.template);
          new WelcomeComponent();
          new ContactListComponent();
          new MessagesComponent();
        })
    }
}   