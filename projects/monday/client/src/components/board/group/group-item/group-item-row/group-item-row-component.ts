import $ from "jquery"
import moment from "moment";
import { CommonService } from "../../../../../services/common.service";
import { MemberService } from "../../../../../services/member.service";
import { IMember } from "../../../../../interfaces/member.interface";
import { ItemService } from "../../../../../services/item.service";
import { IItem } from "../../../../../interfaces/item.interface";
import { StatusDialogComponent } from "./features/status/status-component";
import { dateDialogComponent } from "./features/date/date-component";

import "./group-item-row-component.scss"
const groupTemplate = require('./group-item-row-component.hbs');

export enum eTaskMode {
    sub,
    item,
}

export class taskListItemComponent {
    private $el:any;
    private parent:any;
    private item:IItem;
    private itemService:ItemService = ItemService.Instance
    private commonService:CommonService = CommonService.Instance
    private memberService:MemberService = MemberService.Instance
    private $host:any;
    private isSubItem:boolean;

    constructor(item:IItem,parent:any,$host:any,isSubItem:eTaskMode){
        this.parent = parent
        this.$host = $host
        this.item = item
        this.isSubItem = isSubItem === eTaskMode.sub;
        this.renderHtml();
    }

    //-----------------------------
    // renderHtml
    //-----------------------------

    renderHtml(){
        this.$el = $(groupTemplate({
            item:this.item,
            date:this.commonService.getDate(moment(this.item.data.date)),
            status:this.itemService.getStatusNameById(this.item.data.statusId),
            membersArr:this.getMembersNameArr(),
            isMemberListEmpty:this.item.data.members.length === 0,
            isItemNotHaveChildren:this.item.data.children.length > 0,
            statusClassName:this.itemService.getStatusClassNameById(this.item.data.statusId),
            isSubItem:this.isSubItem,
            isItemStatusDone:this.item.data.statusId === 3
        }));
        this.$host.append(this.$el);
        this.initEvents();
    }

    //-----------------------------
    // getMembersNameArr
    //-----------------------------

    getMembersNameArr(){
        let membersNameArr:IMember[] = []
        
        this.item.data.members.forEach((memberId:string)=>{
            membersNameArr = this.memberService.getMembersById(memberId);
       })

       return membersNameArr;
    }  
    
    //-----------------------------
    // initEvents
    //-----------------------------

    initEvents(){
        this.$el.find(".add-sub-item-wrap").on("click",(e)=>{
            this.onAddSubItemClick(e);
        })
        this.$el.find(".toggle-show-sub-list").on("click",(e)=>{
            this.onToggleShowSubList(e);
        })
        this.$el.find(".status-item-wrap").on("click",(e)=>{
            this.onStatusItemClick(e);
        })
        this.$el.find(".date-item-wrap").on("click",(e)=>{
            this.onDateItemWarpClick(e);
        })
        this.$el.find(".setting-item.delete").on("click",(e)=>{
            this.onSettingsItemDeleteClick(e);
        })
        this.$el.find(".bottom-arrow-btn").on("click",(e)=>{
            this.onSettingsDialogOpenClick(e);
        })
        this.$el.find(".add-sub-item").on("click",(e)=>{
            this.onAddSubItemSettingsClick(e);
        })
        this.$el.find(".setting-item.duplicate").on("click",(e)=>{
            this.onDuplicateSettingsItemClick(e);
        })
    }

    //------------------------------
    // onDuplicateSettingsItemClick
    //------------------------------

    onDuplicateSettingsItemClick(e){
        this.$el.find(".item-settings-dialog").addClass("hide")
        this.itemService.duplicateItem(this.item,(()=>{}));
    }

    //-----------------------------
    // onAddSubItemSettingsClick
    //-----------------------------

    onAddSubItemSettingsClick(e){
        this.$el.find(".item-settings-dialog").addClass("hide")
        this.onAddSubItemClick(e);
    }

    //-----------------------------
    // onSettingsDialogOpenClick
    //-----------------------------

    onSettingsDialogOpenClick(e){
        this.$el.find(".item-settings-dialog").toggleClass("hide")
    }

    //-----------------------------
    // onSettingsItemDeleteClick
    //-----------------------------

    onSettingsItemDeleteClick(e){
        this.$el.find(".item-settings-dialog").addClass("hide")
        this.itemService.deleteItem(this.item,(()=>{}))
    }
 
    //-----------------------------
    // onDateItemWarpClick
    //-----------------------------

    onDateItemWarpClick(e){
        this.$el.find(".date-dialog").removeClass("hide");
        new dateDialogComponent(this.item,this);
    }

    //-----------------------------
    // onToggleShowSubList
    //-----------------------------

    onStatusItemClick(e){
        this.$el.find(".status-dialog").removeClass("hide");
        new StatusDialogComponent(this.item.data.statusId,this,this.item);
    }

    //-----------------------------
    // onToggleShowSubList
    //-----------------------------

    onToggleShowSubList(e){
        this.$el.find(".toggle-btn").toggleClass("hide");
        this.$el.find(".toggle-show-sub-list").toggleClass("open");
        this.parent.$el.find(".sub-item-list-warp").toggleClass("hide");
    }

    //-----------------------------
    // onAddSubItemClick
    //-----------------------------

    onAddSubItemClick(e){
        this.$el.find(".sub-item-list").removeClass("hide");
        this.itemService.addSubItem(this.item,(()=>{}));
    }
}
