export class MoblieDialog{
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
            this.onArrowRightClick()
        })
        $(".feather-send").on('click', (e) => {
            this.onFeatherSendCLick(e);
        });
    }

    //----------------------------------
    // onArrowRightClick
    //----------------------------------

    onArrowRightClick(){
        $(".wrapper").removeClass("hide")
        $(".mobile-dialog").addClass("hide")
    }

    //----------------------------------
    // onFeatherSendCLick
    //----------------------------------
    
    onFeatherSendCLick(e){
        app.dataService.onDataChangeQueueEvents.push(()=>{
        });
        app.dataService.addNewMail({});
        this.onCloseClick($(e.currentTarget))    
    }
}