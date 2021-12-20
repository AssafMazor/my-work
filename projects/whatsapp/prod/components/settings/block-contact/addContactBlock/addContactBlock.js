
export class addContactBlock {
    contacts;
    template;
  
    constructor(contacts) {
        this.contacts = contacts
        this.setHtml();

        this.subscription = app.dataService.onBlockChangeSubject.subscribe(() => {
            this.setHtml();
        });
    }
  
    setHtml() {
      $.get("./components/settings/block-contact/addContactBlock/addContactBlock.hbs",(result) => {
            this.template = Handlebars.compile(result);
            let content = this.template({contacts:app.dataService.getActive()})
            $(".add-contact-block-dialog").html(content);
            setTimeout(() => {
                this.initEvents();
            },0)
        });
    }

    initEvents(){
        $(".close-btn").on("click" , (e) => {
            this.onCloseBtnClick(e);
        })
        $(".item").on("click" , (e) => {
            this.onItemClick(e);
          })
    }


    //----------------------------------
    // onCloseBtnClick
    //----------------------------------

    onCloseBtnClick(e){
        $(".add-contact-block-dialog").removeClass("show")
        $(".add-contact-block-dialog-wrap").addClass("hide")
    }

    //----------------------------------
    // onItemClick
    //----------------------------------

    onItemClick(e){
        let closestItem = $(e.target).data("id");
        app.dataService.setBlockItem(closestItem);
        $(".add-contact-block-dialog").removeClass("show")
        $(".add-contact-block-dialog-wrap").addClass("hide")
    }
}
  