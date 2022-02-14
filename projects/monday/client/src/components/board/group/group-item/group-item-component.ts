import $ from "jquery"
import { ItemService } from "../../../../services/item.service";
import { IItem } from "../../../../interfaces/item.interface";
import { taskListItemComponent , eTaskMode } from "./group-item-row/group-item-row-component";

import "../group-item/group-item-component.scss"
import { chain } from "lodash";
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
    }

    //--------------------------------
    // renderHtml
    //---------------------------------

    renderTasks(){
        new taskListItemComponent(this.item,this,this.$el.find(".item-item"),eTaskMode.item);
        
        for(const childId of this.item.data.children){
            let item = this.itemService.getTask(childId);

            new taskListItemComponent(item,this,this.$el.find(".sub-item-list-warp .sub-item-list"),eTaskMode.sub);
        }
    }
}
