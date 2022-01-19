import $ from 'jquery';
import { ITask } from "../../../../interfaces/task.interface";
import { TasksService } from "../../../../services/tasks.service";
import moment from 'moment';
import { isEmpty } from 'lodash';

import '../datePickerComponents/datePickerComponents.scss';
const datePickerTemplate = require('../datePickerComponents/datePickerComponents.hbs');

export class datePickerComponents {
    private tasksService:TasksService = TasksService.Instance;;
    private $el:any;
    private task:ITask;
    private parent:any;

    constructor(task:ITask , parent:any){
        this.parent = parent;
        this.task = task;
        this.setHtml();

    }

    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){ 
        let sentTime = moment(this.task.sentTime);
        let date = moment(new Date().getDay())
        let now = moment();  

        this.$el = $(datePickerTemplate({
            sendTime:sentTime.format('D MMM'),
            today:now.format("ddd"),
            tomorrow:date.format("ddd")
        }));

        this.parent.$el.find(".date-picker-dialog").html(this.$el);

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
    }
    
    //----------------------------------
    // onSaveBtnClick
    //----------------------------------

    onSaveBtnClick(e){
        let now = moment(this.task.sentTime);  
        let dateDiff = now.format('D MMM')
        console.log(moment(this.$el.find(".input-time").val()))

        $(".date-picker-dialog").addClass("hide");
        this.parent.$el.find(".label-date-input").html(this.$el.find(".input-time").val());
        debugger;
        this.onSendTimeChange(dateDiff + this.$el.find(".input-time").val());
    }

    //----------------------------------
    // onTimeInput
    //----------------------------------

    addTimeBtnClick(e){
        this.$el.find(".date-input").val(this.$el.find(".date-input").val() + this.$el.find(".input-time").val());
        this.$el.find(".add-time-dialog").addClass("hide");
        this.$el.find(".edit-footer").removeClass("hide");
        this.$el.find(".add-time-warp").addClass("hide");
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
        let now = moment();  
        let today = now.format('D MMM')
        this.$el.find(".date-input").val(today);
        this.parent.$el.find(".date-input").html("Today");
        this.parent.$el.find(".date-picker-dialog").addClass("hide");
        this.$el.find(".item").removeClass("hide")
        $(e.target).closest(".item").addClass("hide")

        this.onSendTimeChange(new Date().getTime());
    }
    
    //----------------------------------
    // onTodayItemClick
    //----------------------------------

    onTomorrowItemClick(e){
        let date = moment(new Date().getDay())
        let dateDiff = date.format("d MMM")
        this.$el.find(".date-input").val(dateDiff);
        this.parent.$el.find(".date-input").html(dateDiff);
        this.parent.$el.find(".date-picker-dialog").addClass("hide");

        this.onSendTimeChange(dateDiff);
    }

    //----------------------------------
    // onNoDateItemClick
    //----------------------------------

    onNoDateItemClick(e){
        this.$el.find(".date-input").val("");
        this.parent.$el.find(".date-input").html("Schedule");
        this.parent.$el.find(".date-picker-dialog").addClass("hide");
        
        this.onSendTimeChange("");
    }

    //----------------------------------
    // onSendTimeChange
    //----------------------------------

    onSendTimeChange(time){
        this.tasksService.editTask({
            "name":this.task.name,
            "title":this.task.title,
            "sentTime":time,
            "labels":this.task.labels,
            "isfinished":this.task.isfinished,
            "priority":this.task.priority,
            "category":this.task.category,
            "id":this.task.id,
            "children":this.task.children
        })
    }
}