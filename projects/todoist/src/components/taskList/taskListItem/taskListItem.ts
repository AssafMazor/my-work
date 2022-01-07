import $ from 'jquery';
import moment from 'moment';
import { ITask } from "../../../interfaces/task.interface";
import { TasksService } from "../../../services/tasks.service";
import { LabelsService } from "../../../services/labels.service";
import { TaskEditorComponent , eTaskMode } from "../taskEditor/taskEditorComponent";
import { LabelComponents , eTaskAction } from "../taskEditor/labelsComponent/labelsComponent";
import { ILabel } from '../../../interfaces/label.interface';

import '../taskListItem/taskListItem.scss';
const taskListItemTemplate = require('../taskListItem/taskListItem.hbs');

export class TaskListItemComponents {
    tasksService:TasksService = TasksService.Instance;
    labelsService:LabelsService = LabelsService.Instance;
    labelsNames:ILabel[] = [];
    task:ITask;
    $main:any;

    constructor(task:ITask){
        this.task = task;
        this.setHtml();
    }

    setHtml(){
        this.getLabels();
        let sentTime = moment(this.task.sentTime);

        this.$main = $(taskListItemTemplate({
            dateDiff:this.getTime(sentTime),
            task:this.task,
            labelsNames:this.labelsNames
        }));

        $(".main .container .task-list-body").append(this.$main)
        this.initEvents();
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
    // initEvents
    //----------------------------------


    initEvents(){
        this.$main.find(".items-wrap .label-btn").on("click" , (e) => {
            this.onLabelBtnClick(e);
        })
        this.$main.find(".edit-btn").on("click" , (e) => {
            this.onEditBtnClick(e);
        })
        $(".item .task-editor .task-confirmation").on("click" , (e) => {
            this.onEditTaskConfirmation(e);
        })
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
        let $wrap = this.$main.find(".task-editor-wrap");
        $($wrap).removeClass("hide");
        
        new TaskEditorComponent($wrap, this.task, eTaskMode.Edit);
        $(".add-task-dialog").removeClass("hide");
        this.$main.find(".content").addClass("hide");
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
}