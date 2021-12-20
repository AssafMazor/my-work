class ListItem {
    tempalte;
    item;

    constructor(item){
        this.item = item;
        this.setHtml();
    }

    
    setHtml() {
        $.get("./components/list-item/list-item.hbs", (result) => {
            let t = {...this.item, ...{"checked":app.dataService.isItemSelected(this.item.id)}}
            this.template = Handlebars.compile(result);
            $(".items-panle").append(this.template(t));
            this.initEvents();
        });
    }

    initEvents() {
        let itemrow = $(`.item[data-id="${this.item.id}"]`);

        itemrow.on("click", (e) => {
            var itemId = $(e.target).closest(".item").data("id");
            this.onItemClick(itemId);
        });
        itemrow.find(".star").on("click", (e) => {
            this.onStarClick(e);
        });
        itemrow.find(".trash").on("click", (e) => {
            this.onDeleteClick(e);
        });
        itemrow.find(".square-row").on("click", (e) => {
            this.onCheckboxClick(e);
        });
    }
   
    onStarClick(e) {
        if (e.stopPropagation) {
        e.stopPropagation();
        }
        $(e.target).parent(".star").toggleClass("on");

        var itemId = $(e.target).closest(".item").data("id");
        app.dataService.toggleImportant(itemId);
    }

    onItemClick(Mailid) {
        new ViewMailDialog(Mailid);
    }

    onDeleteClick(e){
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        var divClass = $(e.target).closest(".item")
        $(divClass).toggleClass("on");

        var itemId = $(e.target).closest(".item").data("id").toString();
        app.dataService.deleteMail(itemId);
    }

    onCheckboxClick(e){
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        var closestItem = $(e.target).closest(".item")
        $(closestItem).toggleClass("checked");

        var itemId = $(e.target).closest(".item").data("id").toString();
        app.dataService.toggleSelectedItem(itemId);
    }

}