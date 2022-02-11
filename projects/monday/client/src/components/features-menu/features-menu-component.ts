import $ from "jquery"

import "../features-menu/features-menu-component.scss"
const featuresMenuTemplate = require('../features-menu/features-menu-component.hbs');

export class FeaturesMenuComponent {
    $el:any;

    constructor(){
        this.renderHtml();
    }

    renderHtml(){
        this.$el =  $(featuresMenuTemplate({}));

        $(".main .menu .features-menu").html(this.$el)
    }
}