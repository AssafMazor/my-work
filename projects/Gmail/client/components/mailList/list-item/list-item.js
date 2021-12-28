import {ViewMailDialog} from "../.././viewMailDialog/viewMailDialog.js"

export class ListItem {
    tempalte;
    item;

    constructor(item){
        this.item = item;
        this.setHtml();
    }

    
    setHtml() {
        $.get("./components/mailList/list-item/list-item.hbs", (result) => {
            let extendedItem = {...this.item, ...{"checked":app.dataService.isItemSelected(this.item.id)}}
            this.template = Handlebars.compile(result);
            let isImportant = extendedItem.sysLabel.includes(3) ? true : false
            extendedItem.labels = this.getLabels();

            $(".items-panle").append(this.template({
                item:extendedItem,
                isImportant:isImportant,
            }));
            this.initEvents();
        });
    }

    initEvents() {
        let itemrow = $(`.item[data-id="${this.item.id}"]`);

        itemrow.on("click", (e) => {
            this.onItemClick(e);
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

    onItemClick(e) {
        var Mailid = $(e.target).closest(".item").data("id");
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

    getLabels(){
        let labels = []
        this.item.labels.forEach(labelId => {
            labels = [...labels, ...app.labelsService.getMailLabels(labelId)]
        });
        return labels
    }
}