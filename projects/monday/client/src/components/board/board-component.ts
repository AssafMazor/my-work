import { GroupComponent } from "./group/group-component";
import { ItemService } from "../../services/item.service";
import { IItem } from "../../interfaces/item.interface";
import { IGroup } from "../../interfaces/group.interface";
import $ from "jquery"
import { GroupService } from "../../services/group.service";

import "../board/board-component.scss"
const boardTemplate = require('../board/board-component.hbs');

export class boardComponent {
    public $el:any;
    private itemService:ItemService = ItemService.Instance;
    private taskList:IItem[] = [];
    private groupService:GroupService = GroupService.Instance
    private groupList:IGroup[] = [];

    constructor(){
        this.renderHtml();

        this.groupService.eventEmitter.on('group-change', () => {
         this.groupList = this.groupService.getGroupList();
         this.renderGroups()
        });
    }

    //-----------------------------
    // renderHtml
    //-----------------------------

    renderHtml(){
        this.taskList = this.itemService.getItems();
        this.groupList = this.groupService.getGroupList();
        this.$el =  $(boardTemplate({}));

        $(".main .container .item-list").html(this.$el);

        this.initEvents();
        this.renderGroups();
    }

    //-----------------------------
    // renderGroups
    //-----------------------------

    renderGroups(){
        this.$el.find(".group-list").html("");

        this.groupList.forEach((group)=>{
            new GroupComponent(group,this,this.$el.find(".group-list"));
        })
    }

    //-----------------------------
    // initEvents
    //-----------------------------

    initEvents(){
        this.$el.find(".add-new-group-btn-wrap .info-wrap").on("click",(e)=>{
            this.onAddGroupBtnClick(e);
        })
    }

    //-----------------------------
    // onAddGroupBtnClick
    //-----------------------------

    onAddGroupBtnClick(e){
        this.groupService.addGroup(()=>{});
    }
}