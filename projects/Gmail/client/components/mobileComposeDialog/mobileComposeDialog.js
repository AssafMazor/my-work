class MoblieDialog{
    html;
    template;

    constructor() {
        this.setHtml();
        this.initEvents();
    }

    setHtml(){
       $.get("./components/mobileComposeDialog/mobileComposeDialog.hbs",  (result) => {
        this.template = Handlebars.compile(result);
        $(".mobile-dialog").html(this.template({}));
        this.initEvents();
   });
    }

    initEvents(){
        $(".feather-arrow-right").click(function (){
            $(".wrapper").removeClass("hide")
            $(".mobile-dialog").addClass("hide")
        })
        $(".feather-send").on('click', (e) => {
            app.dataService.onDataChangeQueueEvents.push(()=>{
            });
            app.dataService.addNewMail({});
            this.onCloseClick($(e.currentTarget))    
        });
    }
}