class ViewMailDialog {
    mail;
    template;
    mailId;

    constructor(mailId) {
        this.setHtml(mailId);
        this.mailId = mailId;
    }

    setHtml(mailId){
        $.get("./components/viewMailDialog/viewMailDialog.hbs",  (result) => {
            this.template = Handlebars.compile(result);
            this.mail = app.dataService.getMail(mailId);

            let sentTime = moment(this.mail.sentTime);
           
            this.mail.dateDiff = this.getTimeAgo(sentTime);
            this.mail.sentDateFormat = sentTime.format('l, hh:m'); 

            $("body").append(this.template(this.mail));
            this.initEventes(); 
       });
    }

    initEventes(){
        $(".feather-x").on('click', (e) => {
            this.onCloseClick(e);
        });
        $(".remove-bin").on('click', (e) => {
            this.onDeleteClick(e);
        });
    }

    onCloseClick() {
        $(".view-dialog-panle").remove();
    }

    getTimeAgo(sentTime) {
        let now = moment();
        if(now.diff(sentTime, 'days') > 0){
            return {type:"days ago", diff:now.diff(sentTime, 'days')};
        }
        if(now.diff(sentTime, 'hour') > 0){
            return {type:"hours ago", diff:now.diff(sentTime, 'hour')};
        }
        if(now.diff(sentTime, 'minutes') > 0){
            return {type:"minutes ago", diff:now.diff(sentTime, 'minutes')};
        } 
        if(now.diff(sentTime, 'seconds') > 0){
            return {type:"seconds ago", diff:now.diff(sentTime, 'seconds')};
        }
    }

    onDeleteClick(e){
        $(".view-dialog-panle").remove();
        app.dataService.deleteMail(this.mailId)
    }
}
