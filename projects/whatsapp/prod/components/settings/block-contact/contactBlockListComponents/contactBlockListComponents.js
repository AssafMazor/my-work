import {ContactBlockItem} from '../contactBlockItems/contactBlockItems.js';
import {addContactBlock} from '../addContactBlock/addContactBlock.js';

export class ContactBlockListComponent {

    blockedContact = []
    contacts;
    subscription;
  
    constructor(contacts) {
        this.contacts = contacts

        this.setHtml();
        
        this.subscription = app.dataService.onBlockChangeSubject.subscribe(() => {
            this.renderBlockItems();
        });
    }
  
    setHtml() {
      $.get("./components/settings/block-contact/contactBlockListComponents/contactBlockListComponents.hbs",(result) => {
            this.template = Handlebars.compile(result);
            $(".contact-block-list").html(this.template());
            this.initEvents();
            app.dataService.getContactBlockList();
        }
      );
    }

    renderBlockItems(){
        this.blockedContact = app.dataService.getBlocked();
        $(".contact-block-list .block-list").html("");
        this.blockedContact.forEach((contact) => {
            new ContactBlockItem(contact);
        });
    }   

    initEvents(){
        $(".exit-btn").on("click" , (e) => {
            this.onExitBtnClick(e)
        })
        $(".add-contact-block").on("click" , (e) => {
            this.addContactBlockClick(e) 
        })
    }

    //----------------------------------
    // onExitBtnClick
    //----------------------------------

    onExitBtnClick(e){
        $(".contact-block-list").removeClass("show");
        this.subscription.unsubscribe();
    }

    //----------------------------------
    // addContactBlockClick
    //----------------------------------

    addContactBlockClick(e){
        $(".add-contact-block-dialog").addClass("show")
        $(".add-contact-block-dialog-wrap").removeClass("hide")
        new addContactBlock();
    }
}
  