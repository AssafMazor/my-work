import moment from 'moment';
import { ITask } from "../../../interfaces/task.interface";
import { LabelsService } from "../../../services/labels.service";
import { TasksService } from "../../../services/tasks.service";
import { PriorityService } from "../../../services/priority.service";
import { TaskEditorComponent , eTaskMode } from "../taskEditor/taskEditorComponent";
import { LabelComponents , eTaskAction } from "../taskEditor/labelsComponent/labelsComponent";
import { ILabel } from '../../../interfaces/label.interface';
import { viewTaskComponents } from '../viewTaskComponent/viewTaskComponent';
import { isEmpty, times } from 'lodash';
import $ from 'jquery'

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
    private $host:any;
    private level:number;
    
    constructor(task:ITask , parent:any , $host:any , level:number, isViewMode?:boolean){ 
        this.level = level;
        this.isViewMode = isViewMode || false;
        this.$host = $host;
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
            priorityColor:this.priorityService.getPriorityColor(this.task.priority),
            level:this.level,
            isTaskHaveChildren:this.task.children.length > 0 
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
        this.$el.find(".content").on("click" , (e) => {
            this.onItemClick(e);
        })
        this.$el.find(".toggle-hide-btn").on("click" , (e) => {
            this.onBtnDownClick(e);
        })
    }

    //----------------------------------
    // getTimeAgo
    //----------------------------------

    onBtnDownClick(e){
        if(e.stopPropagation) {
            e.stopPropagation();
        }
        this.$el.find(".item").toggleClass("hide");
        this.$el.find(".toggle-hide-btn").toggleClass("hide");
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
        debugger;
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
            new viewTaskComponents(this.task , this.parent , this);
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
        this.task.labels.forEach((id) => {
            this.$el.find(".label-tag-wrap").append(`
            <div class='label'>${this.labelsService.getLabel(id).name}
            </div>
            `
            );
        }) 
    }
}