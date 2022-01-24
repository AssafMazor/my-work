import $ from 'jquery'
import moment from 'moment';
import { ITask } from "../../interfaces/task.interface";
import { LabelsService } from "../../services/labels.service";
import { commonService } from '../../services/common.service';
import { TasksService } from "../../services/tasks.service";
import { PriorityService } from "../../services/priority.service";
import { TaskEditorComponent , eTaskMode } from "../taskEditor/taskEditorComponent";
import { LabelComponents , eTaskAction } from "../taskEditor/labelsComponent/labelsComponent";
import { ILabel } from '../../interfaces/label.interface';
import { datePickerComponents } from '../viewTaskComponent/datePickerComponents/datePickerComponents';

export enum eTaskCaller {
    View,
    Task
}

export interface ITaskParams {
    task:ITask,
    parent:any,
    $host:any,
    level:number,
    isToday:boolean,
    isViewMode?:boolean
}

import '../taskListItem/taskListItem.scss';
const taskListItemTemplate = require('../taskListItem/taskListItem.hbs');

export class TaskListItemComponents {
    private labelsService:LabelsService = LabelsService.Instance;
    private tasksService:TasksService = TasksService.Instance;
    private priorityService:PriorityService = PriorityService.Instance;
    private commonService:commonService = commonService.Instance;
    private labelsNames:ILabel[] = [];
    private task:ITask;
    private $el:any;
    private parent:any;
    private isViewMode:boolean;
    private $host:any;
    private level:number;
    private isTaskHaveChildren:boolean;
    private isToday:boolean;

    constructor(params:ITaskParams){ 
        this.level = params.level;
        this.isToday = params.isToday;
        this.isTaskHaveChildren = params.task.children.length > 0;
        this.isViewMode = params.isViewMode || false;
        this.$host = params.$host;
        this.parent = parent;
        this.task = params.task;
        this.setHtml();
    }

    //----------------------------------
    // onEditTaskChange
    //----------------------------------

    setHtml(){
        if(this.isToday){
            this.isTaskHaveChildren = false
        }
        this.getLabels();
        let sentTime = moment(this.task.sentTime);
        
        this.$el = $(taskListItemTemplate({
            dateDiff:this.commonService.getDate(sentTime),
            task:this.task,
            labelsNames:this.labelsNames,
            priorityColor:this.priorityService.getPriorityColor(this.task.priority),
            level:this.level,
            isTaskHaveChildren:this.isTaskHaveChildren
        }));
        this.$host.append(this.$el);
        
        this.initEvents();
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
        this.$el.find(".items-wrap .label-btn").on("click" , (e) => {
            this.onLabelBtnClick(e);
        })
        this.$el.find(".edit-btn").on("click" , (e) => {
            this.onEditBtnClick(e);
        })
        this.$el.find(".item .task-editor .task-confirmation").on("click" , (e) => {
            this.onEditTaskConfirmation(e);
        })
        this.$el.find(".delete-checkbox").on("click" , (e) => {
            this.onDeleteBtnClick(e);
        })
        this.$el.find(".toggle-hide-btn").on("click" , (e) => {
            this.onBtnDownClick(e);
        })
        this.$el.find(".date-wrap").on("click" , (e) => {
            this.onTimeBtnClick(e);
        })
    }

    //----------------------------------
    // onTimeBtnClick
    //----------------------------------

    onTimeBtnClick(e){
        e.preventDefault();

        this.$el.find(".date-picker-dialog").removeClass("hide");
        new datePickerComponents(this.task , this , false);
    }

    //----------------------------------
    // getTimeAgo
    //----------------------------------

    onBtnDownClick(e){
        e.preventDefault();

        this.$el.find(".item").toggleClass("hide");
        this.$el.find(".toggle-hide-btn").toggleClass("hide");
    }

    //----------------------------------
    // getLabels
    //----------------------------------

    getLabels(){
        this.labelsNames = [];

        this.task.labels.forEach((labelId:number) => {
            this.labelsNames.push(this.labelsService.getLabel(labelId))
        })
    }

    //----------------------------------
    // onLabelBtnClick
    //----------------------------------

    onDeleteBtnClick(e){
        this.tasksService.finishTask(this.task);
    }

    //----------------------------------
    // onLabelBtnClick
    //----------------------------------

    onLabelBtnClick(e){
        new LabelComponents({
            parent: this,
            task: this.task,
            action: eTaskAction.Add,
            labels: this.labelsService.getLabels()
        });
        $(".add-new-label").addClass("show");
    }

    //----------------------------------
    // onLabelBtnClick
    //----------------------------------

    onEditBtnClick(e){
        e.preventDefault();


        let $wrap = $(this.$el).children(".task-editor-wrap");
        $($wrap).removeClass("hide");

        if(this.isViewMode){
            new TaskEditorComponent({
                $wrap:$wrap,
                parent:this,
                task:this.task,
                isAddMode:eTaskMode.Edit,
                isAddSubTask:true
            });
        }else {
            new TaskEditorComponent({
                $wrap:$wrap,
                parent:this,
                task:this.task,
                isAddMode:eTaskMode.Edit,
                isAddSubTask:false
            });
        }
        
        this.parent.$el.find(".features-wrap").addClass("hide")
        $(".add-task-dialog").removeClass("hide");
        $(this.$el).children(".content").addClass("hide");
        $(".task-list-footer .add-task-wrap").addClass("hide");
    }

    //----------------------------------
    // onEditTaskConfirmation
    //----------------------------------

    onEditTaskConfirmation(e){
        $(".task-editor").addClass("hide");
        $(".task-list-body .item .content").removeClass("hide");
        $(".task-list-footer .add-task-wrap").removeClass("hide");
    }

    //----------------------------------
    // onChooseLabels
    //----------------------------------

    onChooseLabels(){
        this.$el.find(".label-tag-wrap").html("")
        this.task.labels.forEach((id:number) => {
            this.$el.find(".label-tag-wrap").append(`
            <div class='label'>${this.labelsService.getLabel(id).name}
            </div>
            `
            );
        }) 
    }
}