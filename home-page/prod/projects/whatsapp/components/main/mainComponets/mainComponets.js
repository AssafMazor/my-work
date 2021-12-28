import {WelcomeComponent} from "../welcomeComponents/welcomeComponents.js";
import {ContactListComponent} from "../../contact/contactListComponents/contactListComponents.js";
import {MessagesComponent} from "../../messages/messageComponets/messageComponets.js";


export class UI_Main {

    constructor() {
        let isWhite = window.localStorage.getItem('theme') === "white"
        this.setHtml();

        if(isWhite){
            this.loadCss("./override-white.css" , "override-white");
        }
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
        $.get("./components/main/mainComponets/mainComponets.hbs", (result) => {
          this.template = Handlebars.compile(result);
          $(".main-container").html(this.template);
          new WelcomeComponent();
          new ContactListComponent();
          new MessagesComponent();
        })
    }

    
    loadCss(href , cssId , callback) {
        const existingCss = document.getElementById(cssId);

        if (!existingCss) {
            var head  = document.getElementsByTagName('head')[0];
            var link  = document.createElement('link');
            link.id   = cssId;
            link.rel  = 'stylesheet';
            link.type = 'text/css';
            link.href = href;
            link.media = 'all';
            head.appendChild(link);

            link.onload = () => {
                if (callback) {
                callback(cssId);
                }
            };
            link.onerror = () => {
                if (tries < 2) {
                setTimeout(()=>{
                    this.loadCss("./override-white.css" , "override-white");
                }, 100);
                }else{
                   callback(cssId, true);
                }
        };

        }
        if (existingCss && callback) {
        callback(cssId);
    }  
}
}   