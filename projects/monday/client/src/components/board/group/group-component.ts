import $ from "jquery"
import moment from "moment";
import { CommonService } from "../../../services/common.service";
import { IGroup } from "../../../interfaces/group.interface";
import { ItemService } from "../../../services/item.service";
import { IItem } from "../../../interfaces/item.interface";
import { GroupItemComponent } from "./group-item/group-item-component";

import "../group/group-component.scss"
const groupTemplate = require('../group/group-component.hbs');

export class GroupComponent {
    private $el:any;
    private parent:any;
    private group:IGroup;
    private itemService:ItemService = ItemService.Instance
    private commonService:CommonService = CommonService.Instance
    private itemsList:IItem[] = []
    private $host:any;

    constructor(group:IGroup,parent:any,$host:any){
        this.parent = parent
        this.group = group
        this.$host = $host
        this.renderHtml();

        this.itemService.eventEmitter.on('items-change', () => {
            this.itemsList = this.itemService.getItems();
            this.renderTasks()
        });
    }

    //--------------------------------
    // renderHtml
    //---------------------------------

    renderHtml(){
        this.itemsList = this.itemService.getItemsByGroupId(this.group.id);

        this.$el =  $(groupTemplate({
            itemsList:this.itemsList,
            group:this.group
        }));

        this.$host.append(this.$el);
        this.renderTasks();
        this.initEvents()
    }

    //--------------------------------
    // initEvents
    //---------------------------------

    initEvents(){
        this.$el.find(".add-item-btn").on("click",(e)=>{
            this.onAddTaskItemClick(e);
        })
        this.$el.find(".add-item-name").on("input",(e)=>{
            this.onAddTaskNameInput(e)
        })
    }

    //--------------------------------
    // onAddTaskNameInput
    //---------------------------------

    onAddTaskNameInput(e){
        this.$el.find(".add-item-btn").removeClass("hide");
        
        if(this.$el.find(".add-taitemsk-name").val() !== ""){
            this.$el.find(".add-item-btn").removeClass("disable");
        }else {
            this.$el.find(".add-item-btn").addClass("disable");
        }
    }

    //--------------------------------
    // onAddTaskItemClick
    //---------------------------------

    onAddTaskItemClick(e){
        this.itemService.addItem(this.$el.find(".add-item-name").val(), this.group.id,(()=>{}));
        this.$el.find(".add-item-name").val("");
    }

    //------------------------------
    // renderTasks
    //-----------------------------

    renderTasks(){
        this.$el.find(".item-list").html("");

        this.itemsList.forEach((item:IItem)=>{
            new GroupItemComponent(this,item);
        })
    }

    //------------------------------
    // renderTask
    //-----------------------------

    renderTask(item:IItem){  
    }
}
