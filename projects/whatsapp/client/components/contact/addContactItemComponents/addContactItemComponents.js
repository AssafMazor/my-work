import { EmojiButton } from '../../../lib/emoji-button.js';

export class addContactItemComponent {
    picker = new EmojiButton({inset: "auto auto 108px 1254px"});

    template;
    groupsMembers;

    constructor(groupsMembers) {
        this.groupsMembers = groupsMembers
        this.setHtml();
    }

    setHtml() {
        $.get("./components/contact/addContactItemComponents/addContactItemComponents.hbs", (result) => {
          this.template = Handlebars.compile(result);
          $(".add-contact-item").html(this.template());

          this.initEvents();

        })
    }

    initEvents(){
        $(".add-contact-input").on("input" , (e) => {
            this.onAddContactInputChange(e)
        })
        $(".accept-group-bg").on("click" , (e) => {
            this.onAddNewContactGroup()
        })
        $(".exit-btn").on("click" , (e) => {
            this.onExitBtnClick(e)
        })
        this.picker.on('emoji', selection => {
            this.onEmojiSendClick(selection.emoji);
        });
        $(".add-contact .emoji-btn").on("click", (e) => {
            this.emojiBtnClick(e)
        });
    }

    //----------------------------------
    // onAddNewContactGroup
    //----------------------------------

    onAddNewContactGroup(){
        app.dataService.addNewContact({
            "name": $(".add-contact-input").val(),
            "title":"רות",
            "svg":"../../assests/pp.jfif",
            "time":new Date().getTime(),
            "id": new Date().getTime(),
            "isBlocked":false,
            "isExit":false,
            "members":this.groupsMembers
        });
        $(".add-contact-item").removeClass("show")
    }

    //----------------------------------
    // onEmojiSendClick
    //----------------------------------

    onEmojiSendClick(emoji){
        $(".group-type").css("bottom" , "27");
        $(".accept-group-bg").addClass("show");
        $(".add-contact-input").val($(".add-contact-input").val() + emoji)
    }

    //----------------------------------
    // onAddContactInputChange
    //----------------------------------

    onAddContactInputChange(e){
        if($(".add-contact-input").val() === ""){
            $(".group-type").css("bottom" , "5")
            $(".accept-group-bg").removeClass("show")
        }else {
            $(".group-type").css("bottom" , "27")
            $(".accept-group-bg").addClass("show")
        }
        let str = $(".add-contact-input").val() 

        if(str.length > 25){
            str = str.substring(0, 25);
            $(".add-contact-input").val(str); 
        }
        $(".remaining-length").html(25 - str.length)
    }

    //----------------------------------
    // onExitBtnClick
    //----------------------------------

    onExitBtnClick(e){
        $(".add-contact-item").removeClass("show")
    }

    //----------------------------------
    // emojiBtnClick
    //----------------------------------

    emojiBtnClick(e){
        this.picker.togglePicker(document.querySelector(".add-contact .emoji-btn"))
    }
}