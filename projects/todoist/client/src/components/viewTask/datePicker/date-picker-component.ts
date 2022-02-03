import $ from 'jquery';
import { ITask } from "../../../interfaces/task.interface";
import { TasksService } from "../../../services/tasks.service";
import moment from 'moment';
import { isEmpty } from 'lodash';
import flatpickr from 'flatpickr';
import { CommonService , IPosition } from '../../../services/common.service';

import '../datePicker/date-picker-component.scss';
const datePickerTemplate = require('../datePicker/date-picker-component.hbs');

export class DatePickerComponent {
    private tasksService:TasksService = TasksService.Instance;
    private commonService:CommonService = CommonService.Instance
    private $el:any;
    private task:ITask;
    private parent:any;
    private date:any;
    private isEditMode:boolean;

    constructor(task:ITask , parent:any , isEditMode:boolean){
        this.parent = parent;
        this.isEditMode = isEditMode
        this.task = task;
        this.setHtml();

    }

    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){ 
        let now = moment();  
        this.$el = $(datePickerTemplate({
            sendTime:this.commonService.getDate(moment(this.task.data.sentTime)),
            today:now.format("ddd"),
            tomorrow:moment().add(1,'d').format('ddd'),
            isEditMode:this.isEditMode
        }));

        this.parent.$el.find(".date-picker-dialog").html(this.$el);

        flatpickr(".date-picker-calender",{
            inline: true,
            dateFormat: "j M",

            onChange: (selectedDates:any, dateStr:string) => {
                this.date = dateStr
                this.onSelectDateClick(selectedDates);  
            },
        })
        this.commonService.getPotions(this.parent.$el,<IPosition>{
            btnClass:".date-wrap",
            dialogClass:".inside-date-picker"
        })
        this.initEvents();
    } 

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
        this.$el.find(".item.today").on("click" , (e) => {
            this.onTodayItemClick(e);
        })
        this.$el.find(".item.tomorrow").on("click" , (e) => {
            this.onTomorrowItemClick(e);
        })
        this.$el.find(".item.no-date").on("click" , (e) => {
            this.onNoDateItemClick(e);
        })
        this.$el.find(".add-time-warp").on("click" , (e) => {
            this.onAddTimeWarpClick(e);
        })
        this.$el.find(".cancel-btn").on("click" , (e) => {
            this.onCancelBtnClick(e);
        })
        $(".date-picker-dialog").on("click" , (e) => {
            this.onPopperOverlayClick(e);
        })
        this.$el.find(".input-time").on("input" , (e) => {
            this.onTimeInput(e);
        })
        this.$el.find(".add-btn").on("click" , (e) => {
            this.addTimeBtnClick(e);
        })
        this.$el.find(".save-btn").on("click" , (e) => {
            this.onSaveBtnClick(e);
        })
        this.$el.find(".label-time").on("click" , (e) => {
            this.onEditTaskTimeClick(e);
        })
        this.$el.find(".close-btn").on("click" ,(e) => {
            this.onCloseEditFooterClick(e);
        })
    }
  
    //----------------------------------
    // onSelectDateClick
    //----------------------------------

    onSelectDateClick(selectedDates:any){
        let date = moment(new Date(selectedDates).getTime());  
        let dateDiff = date.format('D MMM');
        this.parent.$el.find(".date-input").html(this.date);
        this.parent.$el.find(".date-picker-dialog").addClass("hide");

        if(this.isEditMode){
            this.parent.taskTime = dateDiff + this.parent.$el.find(".label-date-input").html()
        }else {
            this.onSendTimeChange(dateDiff + this.parent.$el.find(".label-date-input").html());
        }

        this.$el.find(".date-input").val(this.commonService.getDate(moment(this.task.data.sentTime)));
    }

    //----------------------------------
    // onEditTaskTimeClick
    //----------------------------------

    onEditTaskTimeClick(e){
        e.preventDefault();

        this.$el.find(".add-time-dialog").removeClass("hide");
    }

    //----------------------------------
    // onCloseEditFooterClick
    //----------------------------------

    onCloseEditFooterClick(e){
        this.$el.find(".edit-footer").addClass("hide");
        this.$el.find(".add-time-warp").removeClass("hide");
    }
    
    //----------------------------------
    // onSaveBtnClick
    //----------------------------------

    onSaveBtnClick(e){
        e.preventDefault();

        let now = moment(this.task.data.sentTime);  
        let dateDiff = now.format('D MMM');

        $(".date-picker-dialog").addClass("hide");
        if(this.parent.$el.find(".date-input").html() === "Schedule"){
            this.parent.$el.find(".date-input").html("Today");
        }
        this.parent.$el.find(".label-date-input").html(this.$el.find(".input-time").val());

        if(this.isEditMode){
            this.parent.taskTime = dateDiff + this.parent.$el.find(".label-date-input").html()
        }else {
            this.onSendTimeChange(dateDiff + this.parent.$el.find(".label-date-input").html());
        }
    }

    //----------------------------------
    // addTimeBtnClick
    //----------------------------------

    addTimeBtnClick(e){
        this.$el.find(".date-input").val(`${this.$el.find(".date-input").val()} ${this.$el.find(".input-time").val()}`);
        this.$el.find(".add-time-dialog").addClass("hide");
        this.$el.find(".edit-footer").removeClass("hide");
        this.$el.find(".add-time-warp").addClass("hide");
        this.$el.find(".label-time").html(this.$el.find(".input-time").val())
    }

    //----------------------------------
    // onTimeInput
    //----------------------------------

    onTimeInput(e){
        let isTimeValid = /^([01]\d|2[0-3]):?([0-5]\d)$/.test(this.$el.find(".input-time").val());
        if(isTimeValid){
            this.$el.find(".add-btn").removeClass("disable");
        }else {
            this.$el.find(".add-btn").addClass("disable");
        }
    }

    //----------------------------------
    // onAddTimeWarpClick
    //----------------------------------

    onPopperOverlayClick(e){
        if(e.stopPropagation) {
            e.stopPropagation();
        }
        if(isEmpty($(e.target).closest(".inside-date-picker"))){
            $(".date-picker-dialog").addClass("hide");
        }
    }

    //----------------------------------
    // onAddTimeWarpClick
    //----------------------------------

    onAddTimeWarpClick(e){
        this.$el.find(".add-time-dialog").removeClass("hide");
    }

    //----------------------------------
    // onCancelBtnClick
    //----------------------------------

    onCancelBtnClick(e){
        this.$el.find(".add-time-dialog").addClass("hide");
    }

    //----------------------------------
    // onTodayItemClick
    //----------------------------------

    onTodayItemClick(e){
        e.preventDefault();

        let now = moment();  
        let today = now.format('D MMM')
        this.$el.find(".date-input").val(today);
        this.parent.$el.find(".date-input").html("Today");
        this.parent.$el.find(".date-picker-dialog").addClass("hide");
        
        if(this.isEditMode){
            this.parent.taskTime = new Date().getTime()
        }else {
            this.onSendTimeChange(new Date().getTime());
        }

    }
    
    //----------------------------------
    // onTodayItemClick
    //----------------------------------

    onTomorrowItemClick(e){
        e.preventDefault();

        let dateDiff = moment().add(1 ,"d").format("D MMM")
        this.$el.find(".date-input").val(dateDiff);
        this.parent.$el.find(".date-input").html(dateDiff);
        this.parent.$el.find(".date-picker-dialog").addClass("hide");

        if(this.isEditMode){
            this.parent.taskTime = dateDiff
        }else {
            this.onSendTimeChange(dateDiff);
        }
    }

    //----------------------------------
    // onNoDateItemClick
    //----------------------------------

    onNoDateItemClick(e){
        e.preventDefault();

        this.$el.find(".date-input").val("");
        this.parent.$el.find(".date-input").html("Schedule");
        this.parent.$el.find(".date-picker-dialog").addClass("hide");
        this.parent.$el.find(".label-date-input").html("")
        
        if(this.isEditMode){
            this.parent.taskTime = ""
        }else {
            this.onSendTimeChange("");
        }

    }

    //----------------------------------
    // onSendTimeChange
    //----------------------------------

    onSendTimeChange(time:any){
        this.tasksService.editTask({
            "taskId": this.task.taskId,
            "data":{
                "name": this.task.data.name,
                "title": this.task.data.title,
                "parentId": this.task.data.parentId,
                "isToday": this.task.data.isToday,
                "sentTime": time,
                "labels": this.task.data.labels,
                "isfinished": this.task.data.isfinished,
                "priority": this.task.data.priority,
                "category": this.task.data.category,
                "children": this.task.data.children,
                "sectionId":this.task.data.sectionId
            } 
            },
        ()=>{}
        )
    }
}