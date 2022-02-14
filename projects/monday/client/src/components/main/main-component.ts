import $ from "jquery"
import { FeaturesMenuComponent } from "../features-menu/features-menu-component";
import { HeaderComponent } from "../header/header-component";
import { boardComponent } from "../board/board-component";
import { WorkspaceMenuComponent } from "../workspace-menu/workspace-menu-component";

import "../main/main-component.scss"
const mainTemplate = require('../main/main-component.hbs');

export class MainComponent {
    $el:any;

    constructor(){
        this.renderHtml();
        this.renderComponents()
    }

    //------------------------------
    // renderHtml
    //------------------------------

    renderHtml(){
        this.$el =  $(mainTemplate({}));

        $(".main").html(this.$el)
    }

    //------------------------------
    // renderComponents
    //------------------------------

    renderComponents(){
        new WorkspaceMenuComponent();
        new boardComponent();
        new HeaderComponent();
        new FeaturesMenuComponent();
    }
}