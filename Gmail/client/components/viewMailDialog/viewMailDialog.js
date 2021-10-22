class ViewMailDialog {
    mail;
    template;

    constructor(mailId) {
        this.setHtml(mailId);
    }

    setHtml(mailId){
        $.get("./components/viewMailDialog/viewMailDialog.hbs",  (result) => {
            this.template = Handlebars.compile(result);
            this.mail = app.dataService.getMail(mailId);
            debugger;
            $("body").append(this.template(this.mail));
            this.initEventes(); 
       });
    }

    initEventes(){
        $(".feather-x").on('click', (e) => {
            this.onCloseClick()         
        });
    }

    onCloseClick() {
        $(".view-dialog-panle").remove();
    }
}
