class UI_List {
    tempalte;
    data = {
        items:[]
    }


    constructor() {
        this.setHtml();
    }
    
    setHtml(){
        $.get("./components/list/list.hbs",  (result) => {
            this.template = Handlebars.compile(result);
            this.data.items = app.dataService.getMails();
            this.renderList();

            app.dataService.onDataChangeQueueEvents.push(()=>{
                this.onDataChange()
            });
       });
    }
    
    onItemClick(){
        new ViewMailDialog();
    }

    onDataChange(){
        this.data.items = app.dataService.getMails();
        this.renderList();
    }

    renderList(){
        $(".list").html(this.template(this.data));
        $(".item").on('click', (e) => { 
            this.onItemClick($(e.currentTarget))         
        });
        $(".item .star").on('click', (e) => { 
            this.onStarClick(e);        
        });
    }

    onStarClick(e){
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        $(e.target).toggleClass('on');
        
        var itemId = $(e.target).closest(".item").data("id");
        app.dataService.toggleImportant(itemId);

    }


}   
