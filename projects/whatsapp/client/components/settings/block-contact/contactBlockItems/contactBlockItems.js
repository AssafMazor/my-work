
export class ContactBlockItem {
    blockedContact;

    constructor(blockedContact) {
        this.blockedContact = blockedContact
        this.setHtml();
    }
  
    setHtml() {
      $.get("./components/settings/block-contact/contactBlockItems/contactBlockItems.hbs",(result) => {
            this.template = Handlebars.compile(result);
                        
            $(".contact-block-list .block-list").append(this.template(this.blockedContact));

            this.initEvents();
        }
      );
    }

    initEvents(){
      $(".block-list .item").on("click" , (e) => {
        this.onItemClick(e)
       
      })
    } 

    //----------------------------------
    // onItemClick
    //----------------------------------
    
    onItemClick(e){
      let closestItem = $(e.target).closest(".item").data("id");
      app.dataService.setBlockItem(closestItem);
    }
}
  