import $ from "jquery"
import { ItemService } from "../../../../services/item.service";
import { IItem } from "../../../../interfaces/item.interface";
import { taskListItemComponent , eTaskMode } from "./group-item-row/group-item-row-component";

import "../group-item/group-item-component.scss"
const groupTemplate = require('../group-item/group-item-component.hbs');

export class GroupItemComponent {
    private $el:any;
    private parent:any;
    private itemService:ItemService = ItemService.Instance;
    private item:IItem;

    constructor(parent:any,item:IItem){
        this.parent = parent;
        this.item = item
        this.renderHtml();
    }

    //--------------------------------
    // renderHtml
    //---------------------------------

    renderHtml(){
        this.$el =  $(groupTemplate({
            isItemNotHaveChildren:this.item.data.children.length === 0
        }));

        this.parent.$el.find(".item-list").append(this.$el);
        this.renderTasks();
        this.initEvents();
    }

    //--------------------------------
    // initEvents
    //---------------------------------

    initEvents(){
        this.$el.find(".add-sub-item-name").on("input",(e)=>{
            this.onAddSubItemNameInput(e);
        })
        this.$el.find(".add-sub-item-btn").on("click",(e)=>{
            this.onAddSubItemBtnClick(e);
        })
    }

    //--------------------------------
    // onAddSubItemBtnClick
    //---------------------------------
    
    onAddSubItemBtnClick(e){
        this.itemService.addSubItem(this.item,(()=>{}));
    }

    //--------------------------------
    // onAddSubItemNameInput
    //---------------------------------

    onAddSubItemNameInput(e){
        this.$el.find(".add-sub-item-btn").removeClass("hide");

        if(this.$el.find(".add-sub-item-name").val() !== ""){
            this.$el.find(".add-sub-item-btn").removeClass("disable");
        }else {
            this.$el.find(".add-sub-item-btn").addClass("disable");
        }
    }

    //--------------------------------
    // renderTasks
    //---------------------------------

    renderTasks(){
        new taskListItemComponent(this.item,this,this.$el.find(".item-wrap"),eTaskMode.item);
        
        for(const childId of this.item.data.children){
            let item = this.itemService.getTask(childId);

            new taskListItemComponent(item,this,this.$el.find(".sub-item-list-warp .sub-item-list"),eTaskMode.sub);
        }
    }
}
