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
            this.checkEmail();
            this.onSendClick();         
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

    checkEmail(){
        const regex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
        if(!regex.test($(".to-email").val())){
            return false
        }
        if(!regex.test($(".subject").val())){
            return false
        }
        return true
    }

    onSendClick(){
        if(this.checkEmail()){
            app.dataService.addNewMail({
                "email":$(".to-email").val(),
                "mainTitle":$(".subject").val(),
                "title":$(".discription").val(),
                "id":this.id,
                "isImportant":false,
                "isDeleted":false,
                "category":1,
                "checked":false,
                "sentTime":new Date().getTime()
            })
        }else {
            alert("Need data")
        }
    }
}

