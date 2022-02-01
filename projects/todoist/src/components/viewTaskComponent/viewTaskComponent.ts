import $ from 'jquery';
import moment from 'moment';
import { ITask } from "../../interfaces/task.interface";
import { TasksService } from "../../services/tasks.service";
import { CommonService } from '../../services/common.service';
import { LabelsService } from "../../services/labels.service";
import { TaskEditorComponent, eTaskMode } from "../taskEditor/taskEditorComponent";
import { PriorityService } from "../../services/priority.service";
import { LabelComponents , eTaskAction } from "../taskEditor/labelsComponent/labelsComponent";
import { TaskListItemComponents } from "../taskListItem/taskListItem";
import { DatePickerComponents } from "./datePickerComponents/datePickerComponents"
import { ChangeAlertComponent } from '../main/changeAlertComponent/changeAlertComponent';
import { DeleteAlertComponent , edeleteMode } from '../main/deleteAlertComponent/deleteAlertComponent';

import '../viewTaskComponent/viewTaskComponent.scss';
const viewTaskTemplate = require('../viewTaskComponent/viewTaskComponent.hbs');

export class ViewTaskComponents {
    private tasksService:TasksService = TasksService.Instance;;
    private commonService:CommonService = CommonService.Instance;;
    private priorityService:PriorityService = PriorityService.Instance;
    private $el:any;
    private labelsService:LabelsService = LabelsService.Instance;
    private task:ITask;
    private arrParents:any[] = [];
    private isEqualTasks:boolean = true;
    private editedTask:ITask;
    
    constructor(taskId){
        this.task = <any>this.tasksService.getTask(taskId);
        this.editedTask = JSON.parse(JSON.stringify(this.task))
        this.getParents(this.task); 
        this.setHtml();
        this.renderSubTaskList();

        this.tasksService.eventEmitter.on("addNewSubTask" , (subTask:ITask , newSubTask:ITask) => {
            this.task = subTask
            $(".sub-task-list").html("");
            this.renderSubTaskList();
        }); 

        this.tasksService.eventEmitter.on("task-change" , () => {
            $(".sub-task-list").html("");
            $(".task-item").html("");
            new TaskListItemComponents({
                task:this.task, 
                parent:this,
                $host:this.$el.find(".task-item"),
                level:0,
                isToday:false,
                isViewMode:true
            })
            this.renderSubTaskList();
        });
    }

    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
        let sentTime = moment(this.task.sentTime);

        this.$el = $(viewTaskTemplate({
            task:this.task,
            priorityColor:this.priorityService.getPriorityColor(this.task.priority),
            parentName:this.arrParents.reverse(),
            sendTime:this.commonService.getDate(sentTime)
        }));
        $(".main .view-task-dialog").html(this.$el)
        new TaskListItemComponents({
            task:this.task, 
            parent:this,
            $host:this.$el.find(".task-item"),
            level:0,
            isToday:false,
            isViewMode:true
        })
        this.initEvents();
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
        this.$el.find(".edit-label-wrap").on("click" , (e) => {
            this.onEditLabelBtnClick(e);
        })
        this.$el.find(".task-item .item .content").on("click" , (e) => {
            this.onEditTaskClick(e);
        })
        this.$el.find(".add-sub-task-wrap").on("click" , (e) => {
            this.onAddSubTaskClick(e);
        })
        this.$el.find(".close-btn").on("click" , (e) => {
            this.onCloseBtnClick(e);
        })
        this.$el.find(".popper").on("click" , (e) => {
            this.onPoperOverlayClick(e);
        })
        this.$el.find(".date-picker-btn").on("click" , (e) => {
            this.onDatePickerBtnClick(e);
        })
        this.$el.find(".settings-btn-wrap").on("click" , (e) => {
            this.onSettingsBtnClick(e);
        })
        this.$el.find(".settings-menu-popper").on("click" , (e) => {
            this.onSettingsMenuPopperClick(e);
        })
        this.$el.find(".settings-edit-item").on("click" , (e) => {
            this.onSettingsEditItemClick(e);
        })
        this.$el.find(".settings-delete-item").on("click" , (e) => {
            this.onDeleteTaskItemClick(e);
        })
    }

    //----------------------------------
    // onSettingsEditItemClick
    //----------------------------------

    onDeleteTaskItemClick(e){
        this.$el.find(".settings-menu-wrap").addClass("hide");
        new DeleteAlertComponent(this.task.name,this.task.id,edeleteMode.task,edeleteMode.view);
        $(".delete-dialog").removeClass("hide");
    }

    //----------------------------------
    // onSettingsEditItemClick
    //----------------------------------

    onSettingsEditItemClick(e){
        this.onEditTaskClick(e);
        this.$el.find(".settings-menu-wrap").addClass("hide");
    }

    //----------------------------------
    // onSettingsBtnClick
    //----------------------------------

    onSettingsBtnClick(e){
        this.$el.find(".settings-menu-wrap").removeClass("hide");
    }

    //----------------------------------
    // onSettingsMenuPopperClick
    //----------------------------------

    onSettingsMenuPopperClick(e){
        this.$el.find(".settings-menu-wrap").addClass("hide");
    }

    //----------------------------------
    // renderSubTaskList
    //----------------------------------

    onDatePickerBtnClick(e){
        this.$el.find(".date-picker-dialog").removeClass("hide");
        new DatePickerComponents(this.task , this , false);
    }

    //----------------------------------
    // renderSubTaskList
    //----------------------------------

    onPoperOverlayClick(e){
        if(this.isEqualTasks){
            $(".view-task-dialog").addClass("hide");
            window.history.back();
        }else {
            new ChangeAlertComponent(this.editedTask)
            $(".change-alert-dialog").removeClass("hide");
        }
    }

    //----------------------------------
    // renderSubTaskList
    //----------------------------------

    renderSubTaskList(){
        this.task.children.forEach((taskId:string) => {
            let subtask = this.tasksService.getTask(taskId);

            if(subtask){
                this.renderSubTask(subtask , this.$el.find(".sub-task-list") , 0);
            }
        })
    }

    //----------------------------------
    // renderSubTask
    //----------------------------------

    renderSubTask(subtask:ITask , $parentEl:any , level:number){
        new TaskListItemComponents({
            task:subtask, 
            parent:this,
            $host: $parentEl,
            level:level,
            isToday:false
        })
        let $el = $(`.sub-task-list .item.${subtask.name}`);
       
        subtask.children.forEach((taskId:string) => { 
            let subtask = this.tasksService.getTask(taskId);

            if(subtask){
                this.renderSubTask(subtask , $el , level + 1);
            }
        })
    }

    //----------------------------------
    // getParents
    //----------------------------------

    getParents(node:ITask){
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
        if(this.isEqualTasks){
            $(".view-task-dialog").addClass("hide");
            window.history.back();
        }else {
            new ChangeAlertComponent(this.editedTask)
            $(".change-alert-dialog").removeClass("hide");
        }
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
            isAddSubTask:true,
            parentSectionId:"-1"
        })
    }
    
    //----------------------------------
    // onEditTaskClick
    //----------------------------------

    onEditTaskClick(e){
        let $wrap = this.$el.find(`.item[data-id="${this.task.id}"] .task-editor-wrap`);
        $($wrap).removeClass("hide");

        let editor = new TaskEditorComponent({
            $wrap:$wrap,
            parent:this,
            task:this.task,
            isAddMode:eTaskMode.Edit,
            isAddSubTask:false,
            parentSectionId:"-1"
        });

        editor.eventEmitter.on('edit-task-change' , (isEqual:boolean,editTask:ITask) => {
            this.isEqualTasks = isEqual
            this.editedTask = editTask
        })

        this.$el.find(`.item[data-id="${this.task.id}"] .content`).addClass("hide")
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
}