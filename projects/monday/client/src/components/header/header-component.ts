import $ from "jquery"
import { taskListItemComponent } from "../board/group/group-item/group-item-row/group-item-row-component";
import { ItemService } from "../../services/item.service";
import { GroupService } from "../../services/group.service";

import "../header/header-component.scss"
const headerTemplate = require('../header/header-component.hbs');

export class HeaderComponent {
    private $el:any;
    private ItemService:ItemService = ItemService.Instance
    private groupService:GroupService = GroupService.Instance

    constructor(){
        this.renderHtml();
    }

    renderHtml(){
        this.$el =  $(headerTemplate({}));
        $(".main .container .header").html(this.$el);

        this.initEvents();
    }

    initEvents(){
        this.$el.find(".new-task-btn-wrap .text").on("click",(e)=>{
            this.onAddTaskItemClick(e)
        })
    }

    onAddTaskItemClick(e){
       let groupId = this.groupService.getGroupList()[0].id;

       this.ItemService.addItem("New task",groupId,(()=>{}));
    }
}