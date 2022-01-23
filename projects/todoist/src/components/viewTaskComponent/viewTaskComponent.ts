import $ from 'jquery';
import moment from 'moment';
import { ITask } from "../../interfaces/task.interface";
import { TasksService } from "../../services/tasks.service";
import { LabelsService } from "../../services/labels.service";
import { TaskEditorComponent, eTaskMode } from "../taskEditor/taskEditorComponent";
import { PriorityService } from "../../services/priority.service";
import { LabelComponents , eTaskAction } from "../taskEditor/labelsComponent/labelsComponent";
import { TaskListItemComponents , eTaskCaller } from "../taskListItem/taskListItem";
import { isEmpty } from 'lodash';
import { datePickerComponents } from "./datePickerComponents/datePickerComponents"

import '../viewTaskComponent/viewTaskComponent.scss';
const viewTaskTemplate = require('../viewTaskComponent/viewTaskComponent.hbs');

export class viewTaskComponents {
    private tasksService:TasksService = TasksService.Instance;;
    private priorityService:PriorityService = PriorityService.Instance;
    private $el:any;
    private labelsService:LabelsService = LabelsService.Instance;
    private task:ITask;
    private arrParents:any[] = [];

    constructor(taskId){
        this.task = this.tasksService.getTask(taskId);
        this.getParents(this.task); 
        this.setHtml();
        this.renderSubTaskList();

        this.tasksService.eventEmitter.on("addNewSubTask" , (subTask , newSubTask:ITask) => {
            this.task = subTask
            $(".sub-task-list").html("");
            this.renderSubTaskList();
        })

        this.tasksService.eventEmitter.on("task-change" , () => {
            $(".sub-task-list").html("");
            $(".task-item").html("");
            new TaskListItemComponents({
                task:this.task, 
                parent:this,
                $host:this.$el.find(".task-item"),
                level:0,
                isToday:false
            })
            this.renderSubTaskList();
        })
    }

    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){ 
        this.$el = $(viewTaskTemplate({
            task:this.task,
            priorityColor:this.priorityService.getPriorityColor(this.task.priority),
            parentName:this.arrParents.reverse(),
            sendTime:this.getTaskSendTime()
        }));
        $(".main .view-task-dialog").html(this.$el)
        new TaskListItemComponents({
            task:this.task, 
            parent:this,
            $host:this.$el.find(".task-item"),
            level:0,
            isToday:false
        })
        this.onChooseLabels(this.task.labels);
        this.initEvents();
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
        this.$el.find(".edit-label-wrap").on("click" , (e) => {
            this.onEditLabelBtnClick(e);
        })
        this.$el.find(".content").on("click" , (e) => {
            this.onEditTaskClick(e);
        })
        this.$el.find(".add-sub-task-wrap").on("click" , (e) => {
            this.onAddSubTaskClick(e);
        })
        this.$el.find(".close-btn").on("click" , (e) => {
            this.onCloseBtnClick(e);
        })
        $(".view-task-dialog").on("click" , (e) => {
            this.onPoperOverlayClick(e);
        })
        this.$el.find(".date-picker-btn").on("click" , (e) => {
            this.onDatePickerBtnClick(e);
        })
    }

    //----------------------------------
    // getTaskSendTime
    //----------------------------------

    getTaskSendTime(){
        let sentTime = moment(this.task.sentTime);
        let now = moment();
        let diff = now.diff(sentTime, 'days');

       if(diff > 7){
            if(new Date(this.task.sentTime).getHours() > 0){
                return sentTime.format('D MMM h:m');
            }else {
                return sentTime.format('D MMM');
            }
        }else {
            if(diff > 0){
                var mydate = sentTime;
                if(new Date(this.task.sentTime).getHours() > 0){
                    return moment(mydate).format('d h:m');
                }else {
                    debugger;
                    return moment(mydate).format('dddd');
                }
            }else {
                if(!isNaN(diff)){
                    return `today ${sentTime.format('h:m')}` 
                }
                return "Schedule"
            }
        }
    }

    //----------------------------------
    // renderSubTaskList
    //----------------------------------

    onDatePickerBtnClick(e){
        this.$el.find(".date-picker-dialog").removeClass("hide");
        new datePickerComponents(this.task , this , false);
    }

    //----------------------------------
    // renderSubTaskList
    //----------------------------------

    onPoperOverlayClick(e){
        if(isEmpty($(e.target).closest(".inside"))){
            $(".view-task-dialog").addClass("hide");
        }
    }

    //----------------------------------
    // renderSubTaskList
    //----------------------------------

    renderSubTaskList(){
        debugger;
        this.task.children.forEach((taskId) => {
            let subtask = this.tasksService.getTask(taskId) 
            this.renderSubTask(subtask , this.$el.find(".sub-task-list") , 0);
        })
    }

    //----------------------------------
    // renderSubTask
    //----------------------------------

    renderSubTask(subtask , $parentEl , level){
        new TaskListItemComponents({
            task:subtask, 
            parent:this,
            $host: $parentEl,
            level:level,
            isToday:false
        })
        let $el = $(`.sub-task-list .item.${subtask.name}`);
       
        subtask.children.forEach((taskId) => { 
            debugger;
            let subtask = this.tasksService.getTask(taskId) 
            this.renderSubTask(subtask , $el , level + 1);
        })
    }

    //----------------------------------
    // getParents
    //----------------------------------

    getParents(node){
        let parent = this.tasksService.getTask(node.parentId);

        if(parent){
            this.arrParents.push({
                name: parent.name,
                id:parent.id
            });
            this.getParents(parent);
        }
    }

    //----------------------------------
    // onCloseBtnClick
    //----------------------------------

    onCloseBtnClick(e){
        $(".view-task-dialog").addClass("hide");
        window.history.back();
    }

    //----------------------------------
    // onEditTaskChange
    //----------------------------------

    onAddSubTaskClick(e){
        let $wrap = this.$el.find(".new-editor-wrap");
        $wrap.removeClass("hide");

        new TaskEditorComponent({
            $wrap:$wrap, 
            parent:this,
            task:this.task,
            isAddMode:eTaskMode.Add,
            isAddSubTask:true
        })
    }
    
    //----------------------------------
    // onEditTaskClick
    //----------------------------------

    onEditTaskClick(e){
        let $wrap = this.$el.find(".task-editor-wrap");
        $($wrap).removeClass("hide");
        
        new TaskEditorComponent({
            $wrap:$wrap,
            parent:this,
            task:this.task,
            isAddMode:eTaskMode.Edit,
            isAddSubTask:false
        });

        this.$el.find(".content").addClass("hide")
        this.$el.find(".features-wrap").addClass("hide")
    }
    //----------------------------------
    // onEditLabelBtnClick
    //----------------------------------

    onEditLabelBtnClick(e){
        new LabelComponents({
            parent: this,
            task: this.task,
            action: eTaskAction.Edit,
            labels: this.labelsService.getLabels()
        });
        $(".add-new-label").addClass("show");
    }

    //----------------------------------
    // onChooseLabels
    //----------------------------------

    onChooseLabels(choosenLabels){
        this.$el.find(".features-wrap").html("")
        choosenLabels.forEach((id) => {
            this.$el.find(".features-wrap").append(`
            <div class='label-wrap'>
                <div class='label-name'>${this.labelsService.getLabel(id).name}
                </div>
            </div>
            `
            );
        }) 
        this.task.labels = choosenLabels
    }
}