import $ from "jquery"

import "../group/group-component.scss"
const groupTemplate = require('../group/group-component.hbs');

export class GroupComponent {
    private $el:any;
    private parent:any;

    constructor(parent){
        this.parent = parent
        this.renderHtml();
    }

    renderHtml(){
        this.$el =  $(groupTemplate({}));

        this.parent.$el.find(".group-list").html(this.$el)
    }
}