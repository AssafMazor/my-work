import $, { Callbacks } from 'jquery';
import moment from 'moment';
import { ITask } from "../../../interfaces/task.interface";
import { LabelsService } from "../../../services/labels.service";
import { TasksService } from "../../../services/tasks.service";
import { PriorityService } from "../../../services/priority.service";
import { TaskEditorComponent , eTaskMode } from "../taskEditor/taskEditorComponent";
import { LabelComponents , eTaskAction } from "../taskEditor/labelsComponent/labelsComponent";
import { ILabel } from '../../../interfaces/label.interface';
import { viewTaskComponents } from '../viewTaskComponent/viewTaskComponent';

export enum eTaskCaller {
    View,
    Task
}

import '../taskListItem/taskListItem.scss';
const taskListItemTemplate = require('../taskListItem/taskListItem.hbs');

export class TaskListItemComponents {
    private labelsService:LabelsService = LabelsService.Instance;
    private tasksService:TasksService = TasksService.Instance;
    private priorityService:PriorityService = PriorityService.Instance;
    private labelsNames:ILabel[] = [];
    private task:ITask;
    private $el:any;
    private parent:any;
    private isViewMode:boolean = false;

    constructor(task:ITask , parent:any , caller?){ 
        this.isViewMode = caller === eTaskCaller.View;
        this.parent = parent;
        this.task = task;
        this.setHtml();
    }

    //----------------------------------
    // onEditTaskChange
    //----------------------------------

    setHtml(){
        this.getLabels();
        let sentTime = moment(this.task.sentTime);

        this.$el = $(taskListItemTemplate({
            dateDiff:this.getTime(sentTime),
            task:this.task,
            labelsNames:this.labelsNames,
            priorityColor:this.priorityService.getPriorityColor(this.task.priority)
        }));
        this.parent.$el.find(".task-list-body").append(this.$el);
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
        this.$el.find(".content").on("click" , (e) => {
            this.onItemClick(e);
        })
    }
 
    //----------------------------------
    // getTimeAgo
    //----------------------------------

    getTime(sentTime) {
        let now = moment();
        let diff = now.diff(sentTime, 'days');
        
        if(diff > 7){
            return sentTime.format('D MMM');
        }else {
            if(diff > 0){
                var mydate = sentTime;
                var weekDayName =  moment(mydate).format('d');
                return weekDayName
            }else {
                return sentTime.format('h:m');
            }
        }
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

    onItemClick(e){
        if(!this.isViewMode){
            $(".view-task-dialog").removeClass("hide");
            new viewTaskComponents(this.task);
        }
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
        if(e.stopPropagation) {
            e.stopPropagation();
        }
        let $wrap = this.$el.find(".task-editor-wrap");
        $($wrap).removeClass("hide");
        new TaskEditorComponent({
            $wrap:$wrap,
            parent:this,
            task:this.task,
            isAddMode:eTaskMode.Edit
            
        });
        $(".add-task-dialog").removeClass("hide");
        this.$el.find(".content").addClass("hide");
        $(".task-list-footer .add-task-wrap").addClass("hide");
        this.parent.$el.find(".features-wrap").addClass("hide")
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
        this.task.labels.forEach((id) => {
            this.$el.find(".label-tag-wrap").append(`
            <div class='label'>${this.labelsService.getLabel(id).name}
            </div>
            `
            );
        }) 
    }
}