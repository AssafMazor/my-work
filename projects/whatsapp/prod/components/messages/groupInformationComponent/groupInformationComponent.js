
export class groupInformationComponent {
    contactType;
    template;
    contact;
    groupMembers;

    constructor(contactType , contactId) {
        let contact = app.dataService.getContact(contactId) 
        if(contact.members){
           this.groupMembers = app.dataService.getContactMembers(contactId) 
        }else {
            this.groupMembers = ""
        }
        this.contactType = contactType
        this.contact = contact
        this.setHtml();
    }

    setHtml() {
        $.get("./components/messages/groupInformationComponent/groupInformationComponent.hbs", (result) => {
          this.template = Handlebars.compile(result);

          $(".contact-info").html(this.template({
            contactType:this.contactType,
            groupMembers:this.groupMembers,
            groupMembersLength:this.groupMembers.length,
            contactName:this.contact.name
          }));

          this.initEvents();
        })
    }

    initEvents(){
        $(".contact-info .header .exit-btn").on("click" , (e) => {
            this.onExitBtnClick(e)
        })
        $(".item.delete-chat").on("click" , (e) => {
            this.onDeleteChatClick(e)
        })
        $(".item.group").on("click" , (e) => {
            this.onItemGroupClick(e)
        })
    }

    //----------------------------------
    // onExitBtnClick
    //----------------------------------

    onExitBtnClick(e){
        $(".contact-info").removeClass("show");
    }

    //----------------------------------
    // onDeleteChatClick
    //----------------------------------

    onDeleteChatClick(e){
        $(".contact-info").removeClass("show")
        app.dataService.deleteChat(this.contactId);
        $(".message-wrap").addClass("hide");
        $(".right").removeClass("hide");
    }

    //----------------------------------
    // onItemGroupClick
    //----------------------------------

    onItemGroupClick(e){
        $(".contact-info").removeClass("show")
        let closestItem = $(e.target).closest(".item.group").data("id");
        app.dataService.getMessageList(closestItem);
        $(".item").removeClass("selected");
    }
}