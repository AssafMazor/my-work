import {MessageItemComponent} from '../message-item-componets/message-item-componets.js';
import { EmojiButton } from '../../../lib/emoji-button.js';
import {searchMessageComponents} from '../../search/searchMessage/searchMessage.js';
import {groupInformationComponent} from '../groupInformationComponent/groupInformationComponent.js';

export class MessagesComponent {
    picker = new EmojiButton({inset: "auto auto 17px 276px"});

    data = {
        messages: [],
    };
    contact;
    isGroup;
    contactId;

    constructor() {
        this.setHtml();
        
        app.dataService.onMessageChangeSubject.subscribe((data)=>{
            if(data.messages !== null){
                this.contact = app.dataService.getContact(data.id) 
                this.isGroup = !!this.contact.members
                this.data.messages = data.messages;
                this.contactId = data.id
                this.setHtml();
            }
        })
    }

    setHtml() {
        $.get("./components/messages/messageComponets/messageComponets.hbs", (result) => {
        this.template = Handlebars.compile(result);
        this.data.messages.isDesktop = $( window ).width() > 600
          
        $(".message-wrap").html(this.template({
        isGroup:this.isGroup,
        name:this.contact.name,
        messages:this.data.messages
        }));

        this.renderMessageList();
        this.initEvents();
        })
    }

    renderMessageList(){
        $(".message-wrap-container").html("")
        this.data.messages.forEach((message)=>{
            new MessageItemComponent(message);
        })
    }

    initEvents(){
        this.initBtnClickEvents();
        this.initMessageClickEvents();

        $(".fillters-row  .emoji-btn").on("click", (e) => {
            this.onEmojiBtnClick(e)
        });
        this.picker.on('emoji', selection => {
            this.onEmojiSendClick(selection.emoji);
            selection.emoji = ""
        });
        $(".search-message-btn").on("click" , (e) => {
            this.onSearchMessageBtnClick(e)
        })
        $(".open-settings-menu").on("click" , (e) => {
            this.onOpenSettingsMenuClick(e)
        })
    }

    initBtnClickEvents(){
        $(".back-arrow").on("click", (e) => {
            this.onBackArrowClick(e)
        });
        $(".send-arrow").on("click", (e) => {
            this.sendArrowClick(e)
        });
        $(".send-btn").on("click", (e) => {
            this.onSendClick();
        });
    }

    initMessageClickEvents(){
        $(".message-wrap .clear-chat").on("click" , (e) => {
            this.onClearChatClick(e)
        })
        $(".message-wrap .delete-chat").on("click" , (e) => {
            this.onDeleteChatClick(e)
        })
        $(".message-wrap .info-group").on("click" , (e) => {
            this.onInfoGroupClick(e)
        })
        $(".message-wrap .info-contact").on("click" , (e) => {
            this.onInfoContactClick(e)
        })
    }

    //----------------------------------
    // onEmojiSendClick
    //----------------------------------
 
    onEmojiSendClick(emoji){
        $(".fillters-row .search-input").html($(".fillters-row .search-input").html() + emoji)
    }
    
    //----------------------------------
    // onEmojiBtnClick
    //----------------------------------

    onEmojiBtnClick(e){
        this.picker.togglePicker(document.querySelector(".fillters-row  .emoji-btn"))
    }

    //----------------------------------
    // onEmojiBtnSelection
    //----------------------------------

    //----------------------------------
    // onSearchMessageBtnClick
    //----------------------------------

    onSearchMessageBtnClick(e){
        $(".search-message-panle").removeClass("hide");
        $(".message-wrap").css("width" , "40%")
        new searchMessageComponents(this.data.messages)
    }

    //----------------------------------
    // onOpenSettingsMenuClick
    //----------------------------------

    onOpenSettingsMenuClick(e){
        $(".settings-modal").toggleClass("show");
    }

    //----------------------------------
    // onBackArrowClick
    //----------------------------------

    onBackArrowClick(e){
        $(".message-wrap").addClass("hide")
    }

    //----------------------------------
    // sendArrowClick
    //----------------------------------

    sendArrowClick(e){
        $(".message-wrap").addClass("hide")
    }

    //----------------------------------
    // onClearChatClick
    //----------------------------------

    onClearChatClick(e){
        $(".settings-modal").removeClass("show")
        app.dataService.clearChat(this.contactId);
    }

    //----------------------------------
    // onDeleteChatClick
    //----------------------------------

    onDeleteChatClick(e){
        $(".settings-modal").removeClass("show")
        app.dataService.deleteChat(this.contactId);
        $(".message-wrap").addClass("hide")
        $(".right").removeClass("hide")
    }

    //----------------------------------
    // onInfoGroupClick
    //----------------------------------

    onInfoGroupClick(e){
        $(".message-wrap").css("width" , "40%");
        $(".contact-info").addClass("show");
        new groupInformationComponent(true , this.contactId);
        $(".settings-modal").removeClass("show");
    }

    //----------------------------------
    // onInfoContactClick
    //----------------------------------

    onInfoContactClick(e){
        $(".message-wrap").css("width" , "40%");
        $(".contact-info").addClass("show");
        new groupInformationComponent(false , this.contactId);
        $(".settings-modal").removeClass("show");
    }

    //----------------------------------
    // onSendClick
    //----------------------------------
 
    onSendClick(){
        if($(".fillters-row .search-input").html() === ""){
            alert("need message content")
        }else {
            app.dataService.addNewMessage({
                "datetime":new Date().getTime(),
                "type": 2,
                "content":$(".fillters-row .search-input").html(),
                "file":["ghjgjhgjghjg/"],
                "id":this.data.messages.id} ,
                this.contactId
            )
        }
        $(".fillters-row .search-input").html("")
    }
}