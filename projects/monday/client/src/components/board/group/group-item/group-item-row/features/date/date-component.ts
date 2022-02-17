import $ from "jquery"
import moment from "moment";
import { CommonService } from "../../../../../../../services/common.service";
import { ItemService } from "../../../../../../../services/item.service";
import flatpickr from "flatpickr";
import { IItem } from "../../../../../../../interfaces/item.interface";

import "./date-component.scss"
const dateTemplate = require('./date-component.hbs');

export class dateDialogComponent {
    private $el:any;
    private parent:any;
    private itemService:ItemService = ItemService.Instance
    private commonService:CommonService = CommonService.Instance
    private item:IItem;
    private selectedDate:any;
    private date:number;

    constructor(item:IItem,parent:any){
        this.parent = parent;
        this.date = item.data.date
        this.selectedDate = item.data.date
        this.item = item;
        this.renderHtml();
    }

    //-----------------------------
    // renderHtml
    //-----------------------------

    renderHtml(){
        this.$el = $(dateTemplate({}));
        this.parent.$el.find(".date-dialog").html(this.$el);
        flatpickr(".date-picker-calender",{
            inline: true,
            dateFormat: "j M",

            onChange: (selectedDates:any, dateStr1:string) => {
                this.selectedDate = new Date(selectedDates).getTime();

                this.itemService.editItemDateId(this.selectedDate,this.item,(()=>{}));
                this.parent.$el.find(".date-dialog").addClass("hide");
            },
        })
        this.initEvents();
    }

    //-----------------------------
    // initEvents
    //-----------------------------

    initEvents(){
        this.$el.find(".toggle-time-btn").on("click",(e)=>{
            this.onToggleTimeBtnClick(e);
        })
        this.$el.find(".time-input").on("input",(e)=>{
            this.onTimeInputChange(e);
        })
        this.$el.find(".time-input").on("blur",(e)=>{
            this.onTimeInputBlur(e);
        })
        this.$el.find(".popper").on("click",(e)=>{
            this.onPopperOverlayClick(e);
        })
    }

    //-----------------------------
    // onPopperOverlayClick
    //-----------------------------

    onPopperOverlayClick(e){
        this.parent.$el.find(".date-dialog").addClass("hide");
    }

    //-----------------------------
    // onToggleTimeBtnClick
    //-----------------------------

    onTimeInputBlur(e){
        this.itemService.editItemDateId(this.date,this.item,(()=>{}));
    }

    //-----------------------------
    // onToggleTimeBtnClick
    //-----------------------------

    onToggleTimeBtnClick(e){
        this.$el.find(".time-wrapper").toggleClass("hide");
        this.$el.find(".toggle-time-btn").toggleClass("active")
    }

    //-----------------------------
    // onTimeInputChange
    //-----------------------------

    onTimeInputChange(e){
        let isTimeValid = /^([01]\d|2[0-3]):?([0-5]\d)$/.test(this.$el.find(".time-input").val());
        if(isTimeValid || this.$el.find(".time-input").val() === ""){
            this.$el.find(".time-wrap").css("border","1px solid #c4c4c4");
            let date = moment(new Date(this.selectedDate).getTime())
            let time = moment(this.$el.find(".time-input").val(), 'HH:mm');

            date.set({
            hour:time.get('hour'),
            minute:time.get('minute'),
            second:time.get('second')
            });
            this.parent.$el.find(".date-item-wrap .inside .title").append(`,${this.$el.find(".time-input").val()}`);
            this.date = date.valueOf();
        }else {
            this.$el.find(".time-wrap").css("border","1px solid red");
        }
    }
}
