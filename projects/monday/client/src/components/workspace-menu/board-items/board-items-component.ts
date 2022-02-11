import $ from "jquery"

import "../board-items/board-items-component.scss"
const boardItemsTemplate = require('../board-items/board-items-component.hbs');

export class BoardItemsComponent {
    private $el:any;
    private parent:any;

    constructor(parent){
        this.parent = parent
        this.renderHtml();
    }

    renderHtml(){
        this.$el =  $(boardItemsTemplate({}));

       this.parent.$el.find(".board-list").html(this.$el)
    }
}