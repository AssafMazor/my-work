import { GroupComponent } from "../task-list/group/group-component";
import $ from "jquery"

import "../task-list/task-list-component.scss"
const taskListTemplate = require('../task-list/task-list-component.hbs');

export class TaskListComponent {
    $el:any;

    constructor(){
        this.renderHtml();
    }

    renderHtml(){
        this.$el =  $(taskListTemplate({}));

        $(".main .container .task-list").html(this.$el);

        new GroupComponent(this)
    }
}