import $ from "jquery"
import moment from "moment";
import { CommonService } from "../../../../../../../services/common.service";
import { ItemService } from "../../../../../../../services/item.service";
import { IItem } from "../../../../../../../interfaces/item.interface";

import "./status-component.scss"
const statusTemplate = require('./status-component.hbs');

export enum eTaskMode {
    sub,
    item,
}

export class StatusDialogComponent {
    private $el:any;
    private parent:any;
    private itemStatusId:number;
    private itemService:ItemService = ItemService.Instance
    private commonService:CommonService = CommonService.Instance
    private item:IItem;

    constructor(itemStatusId:number,parent:any,item:IItem){
        this.parent = parent
        this.item = item
        this.itemStatusId = itemStatusId
        this.renderHtml();
    }

    //-----------------------------
    // renderHtml
    //-----------------------------

    renderHtml(){
        this.$el = $(statusTemplate({
            isStatusWorking:this.item.data.statusId === 1,
            isStatusStack:this.item.data.statusId === 2,
            isStatusDone:this.item.data.statusId === 3,
            isStatusNone:this.item.data.statusId === 4,
        }));
        this.parent.$el.find(".status-dialog").html(this.$el);
        this.initEvents();
    }

    //-----------------------------
    // initEvents
    //-----------------------------

    initEvents(){
        this.$el.find(".popper").on("click",(e)=>{
            this.onPopperOverlayClick(e);
        })
        this.$el.find(".status-item.working").on("click",(e)=>{
            this.onStatusItemClick(e,1);
        })
        this.$el.find(".status-item.stuck").on("click",(e)=>{
            this.onStatusItemClick(e,2);
        })
        this.$el.find(".status-item.done").on("click",(e)=>{
            this.onStatusItemClick(e,3);
        })
        this.$el.find(".status-item.none").on("click",(e)=>{
            this.onStatusItemClick(e,4);
        })
    }

    //-----------------------------
    // onStatusItemClick
    //-----------------------------

    onStatusItemClick(e,statusId:number){
        this.itemService.editItemStatusId(this.item,statusId,(()=>{}))
    }   

    //-----------------------------
    // onPopperOverlayClick
    //-----------------------------

    onPopperOverlayClick(e){
        this.parent.$el.find(".status-dialog").addClass("hide")
    }
}
