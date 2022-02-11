import $ from "jquery"

import "../header/header-component.scss"
const headerTemplate = require('../header/header-component.hbs');

export class HeaderComponent {
    $el:any;

    constructor(){
        this.renderHtml();
    }

    renderHtml(){
        this.$el =  $(headerTemplate({}));
        $(".main .container .header").html(this.$el)
    }
}