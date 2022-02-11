import { BoardItemsComponent } from "./board-items/board-items-component";
import $ from "jquery"

import "../workspace-menu/workspace-menu-component.scss"
const workspaceMenuTemplate = require('../workspace-menu/workspace-menu-component.hbs');

export class WorkspaceMenuComponent {
    $el:any;

    constructor(){
        this.renderHtml();
    }

    renderHtml(){
        this.$el =  $(workspaceMenuTemplate({}));

        $(".main .menu .workspace-menu").html(this.$el)
        new BoardItemsComponent(this)
    }
}