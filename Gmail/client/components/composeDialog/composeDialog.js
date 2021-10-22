class ComposeDialog {
    id;
    template;
    mailList = app.dataService.getMails();

    constructor() {
        this.id = Date.now()
        this.setHtml();
    }

    setHtml(){
        $.get("./components/composeDialog/composeDialog.hbs",  (result) => {
            this.template = Handlebars.compile(result);
            $(".compose-dialog-wrap").html(this.template({id: this.id , isDesktop: $( window ).width() > 600}));
            this.initEventes()
       });
    }

    initEventes(){
        $(".feather-x").on('click', (e) => {
            this.onCloseClick($(e.currentTarget))    
        });
        $(".send-btn").on('click', (e) => {
            this.onSendClick($(e.currentTarget))         
        });
        $(".feather-send").on('click', (e) => {
            this.onSendClick($(e.currentTarget))         
        });
        $(".feather-arrow-right").on('click', (e) => {
            this.onCloseClick($(e.currentTarget))         
        });
    }
    
    onCloseClick(){
        app.composeDialog = null
        $(".compose-dialog-wrap").addClass("hide");
    }

    onSendClick(){
        app.dataService.addNewMail({});
        this.onCloseClick();
    }
}

