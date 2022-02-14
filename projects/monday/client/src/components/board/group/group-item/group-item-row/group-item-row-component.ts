import $ from "jquery"
import moment from "moment";
import { CommonService } from "../../../../../services/common.service";
import { MemberService } from "../../../../../services/member.service";
import { IMember } from "../../../../../interfaces/member.interface";
import { ItemService } from "../../../../../services/item.service";
import { IItem } from "../../../../../interfaces/item.interface";

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
    private taskService:ItemService = ItemService.Instance
    private commonService:CommonService = CommonService.Instance
    private memberService:MemberService = MemberService.Instance
    private $host:any;
    private isSubItem:boolean;

    constructor(item:IItem,parent:any,$host:any,isSubItem:eTaskMode){
        this.parent = parent
        this.$host = $host
        this.item = item
        this.isSubItem = isSubItem === eTaskMode.sub
        this.renderHtml();
    }

    //-----------------------------
    // renderHtml
    //-----------------------------

    renderHtml(){
        this.$el = $(groupTemplate({
            item:this.item,
            date:this.commonService.getDate(moment(this.item.data.date)),
            status:this.taskService.getStatusNameById(this.item.data.statusId),
            membersArr:this.getMembersNameArr(),
            isMemberListEmpty:this.item.data.members.length === 0,
            isStatusNone:this.taskService.getStatusNameById(this.item.data.statusId) === '',
            isItemNotHaveChildren:this.item.data.children.length > 0,
            isSubItem:this.isSubItem
        }));
        this.$host.append(this.$el);
        this.initEvents()
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
        this.taskService.addSubItem(this.item,(()=>{}));
    }
}
