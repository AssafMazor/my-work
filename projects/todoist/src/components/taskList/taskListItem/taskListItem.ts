import $ from 'jquery';
import moment from 'moment';
import { Itask } from "../../../interfaces/task.interface";
import { ILabel } from "../../../interfaces/label.interface";
import '../taskListItem/taskListItem.scss';
import { TasksService } from "../../../services/tasks.service";
import { LabelsService } from "../../../services/labels.service";
import { addLabelComponents } from "../addLabelComponents/addLabelComponents"
import { taskEditorComponent } from "../taskEditorComponent/taskEditorComponent";

const taskListItemTemplate = require('../taskListItem/taskListItem.hbs');

export class TaskListItemComponents {
    tasksService:TasksService;
    labelsService:LabelsService;
    task;
    taskList;
    $main;

    constructor(task){
        this.task = task
        this.tasksService = TasksService.Instance;
        this.labelsService = LabelsService.Instance;
        this.taskList = this.tasksService.getTasks();

        this.setHtml();
    }

    setHtml(){
        this.getLabels();
        let sentTime = moment(this.task.sentTime);
           
        this.task.dateDiff = this.getTime(sentTime);

        this.$main = $(taskListItemTemplate({
            task:this.task
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
            return this.task.dateDiff = sentTime.format('D MMM');
        }else {
            if(diff > 0){
                var mydate = sentTime;
                var weekDayName =  moment(mydate).format('d');
                return this.task.dateDiff = weekDayName
            }else {
                return this.task.dateDiff = sentTime.format('h:m');
            }
        }
    }


    //----------------------------------
    // getLabels
    //----------------------------------

    getLabels(){
        this.task.fullLabels = [];
        this.task.labels.forEach((labelId) => {
            this.task.fullLabels.push(this.labelsService.getLabel(labelId))
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
        new addLabelComponents({
            parent: this,
            task: this.task.id,
            caller: "addLabel",
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
        
        new taskEditorComponent($wrap, this.task, "edit-task");
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