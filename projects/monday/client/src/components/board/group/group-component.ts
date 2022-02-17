import $ from "jquery"
import moment from "moment";
import { CommonService } from "../../../services/common.service";
import { IGroup } from "../../../interfaces/group.interface";
import { ItemService } from "../../../services/item.service";
import { IItem } from "../../../interfaces/item.interface";
import { GroupItemComponent } from "./group-item/group-item-component";

import "../group/group-component.scss"
import { precompile } from "handlebars";
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

        this.itemService.eventEmitter.on('items-change', (groupId:string) => {
            if(this.group.id === groupId){
                this.itemsList = this.itemService.getItemsByGroupId(this.group.id);
                this.renderTasks();
                this.updateDoneItemProgressBar();
                this.updateStatusWidth();
            }
        });
    }

    //--------------------------------
    // renderHtml
    //---------------------------------

    renderHtml(){
        this.itemsList = this.itemService.getItemsByGroupId(this.group.id);

        this.$el = $(groupTemplate({
            itemsList:this.itemsList,
            group:this.group,
            totalProgress:this.getDoneItemsPercent(),
            totalStatusWidthObj:this.getItemsStatusWidth(),
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
            this.onAddItemNameInput(e)
        })
    }

    //--------------------------------
    // onAddTaskNameInput
    //---------------------------------

    onAddItemNameInput(e){
        this.$el.find(".add-item-btn").removeClass("hide");

        if(this.$el.find(".add-item-name").val() !== ""){
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
        this.$el.find(".add-item-btn").addClass("disable");
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

    //-----------------------------
    // getDoneItemsPercent
    //-----------------------------

    getDoneItemsPercent(){
        let doneItems = this.itemService.getDoneItems(this.group.id);
        let percent = this.itemsList.length / doneItems.length
        percent = Math.trunc( 100 / percent );

        if(isNaN(percent)){
            return "0%"
        }else {
            return percent + "%"
        }
    }

    //-----------------------------
    // updateStatusWidth
    //-----------------------------

    updateStatusWidth(){
        let statusWidthObj:object = this.getItemsStatusWidth();

        this.$el.find(".status-color.working").width(statusWidthObj["workingWidth"] + "%");
        this.$el.find(".status-color.stack").width(statusWidthObj["stackWidth"] + "%");
        this.$el.find(".status-color.done").width(statusWidthObj["doneWidth"] + "%");
        this.$el.find(".status-color.none").width(statusWidthObj["noneWidth"] + "%")
    }

    //-----------------------------
    // getItemsStatusWidth
    //-----------------------------

    getItemsStatusWidth():object{
        let statusList = this.itemService.getItemsArrByStatusId(this.group.id,this.itemService.getItemsByGroupId(this.group.id));
        let total = statusList.working + statusList.stack + statusList.done + statusList.none
        debugger;

        let obj =  {
            workingWidth:(statusList.working / total) *  100,
            stackWidth:(statusList.stack / total) *  100,
            doneWidth:( statusList.done / total) *  100,
            noneWidth:(statusList.none / total) *  100,
        }
        return obj
    }

    //-----------------------------
    // updateDoneItemProgressBar
    //-----------------------------
    
    updateDoneItemProgressBar(){
        let percent = this.getDoneItemsPercent();
        this.$el.find(".total-progress-row").css("width",percent);
        this.$el.find(".total-progress-percent").html(percent);
    }
}
