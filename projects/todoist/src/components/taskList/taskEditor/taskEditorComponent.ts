import $ from 'jquery';
import { ITask } from "../../../interfaces/task.interface";
import { ILabel } from "../../../interfaces/label.interface";
import { TasksService } from "../../../services/tasks.service";
import { LabelsService } from "../../../services/labels.service";
import { LabelComponents , eTaskAction } from "./labelsComponent/labelsComponent"

export enum eTaskMode {
    Add,
    Edit
}

import './taskEditorComponent.scss';
const taskEditorTemplate = require('./taskEditorComponent.hbs');

export class TaskEditorComponent {  
    taskService:TasksService = TasksService.Instance;
    labelsService:LabelsService = LabelsService.Instance;
    task:ITask;
    choosenLabels:number[] = [];
    $host:any;
    $main:any;
    isAddMode: boolean = false;

    constructor($host:any, task:ITask , taskMode:eTaskMode){
        this.task = task;
        this.$host = $host
        this.isAddMode = taskMode === eTaskMode.Add;

        this.setHtml();
    }

    setHtml(){
        this.$main = $(taskEditorTemplate({
            isAddMode:this.isAddMode,
            task:this.task
        }));
        this.$host.html(this.$main);
        this.onChooseLabels(this.task.labels)
        this.initEvents();
    }

    initEvents(){
        $(".name-task-input").on("input" , (e) => {
            this.onTaskNameInput(e);
        })
        $(".task-confirmation .cancel").on('click' , (e) => {
            this.onAddTaskCancel(e);
        })
        $(".task-confirmation .add-task").on("click" , (e) => {
            this.onAddTaskConfirmtion(e);
        })
        this.$main.find(".edit-label-wrap").on("click" , (e) => {
            this.onEditLabelBtnClick(e);
        })
        this.$main.find(".add-label-wrap").on("click" , (e) => {
            this.onLabelBtnClick(e);
        })
        $(".task-confirmation .save-edit").on("click" , (e) => {
            this.onEditTaskConfirmtion(e);
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
        this.$main.find(".new-label-dialog").addClass("show");
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
        this.$main.find(".edit-label-dialog").addClass("show");
    }

    //----------------------------------
    // onEditTaskConfirmtion
    //----------------------------------

    onEditTaskConfirmtion(e){
        if(!$(e.target).hasClass("disable") && !$(e.target).parent().hasClass("disable")){
            this.taskService.editTask( {
                "name":$(".edit-name-task-input").val(),
                "title":$(".edit-description-task-input").val(),
                "sentTime":new Date().getTime(),
                "labels":this.choosenLabels,
                "isfinished":false,
                "priority":[],
                "category":1,
                "id":this.task.id
            },);
            $(".add-task-dialog").addClass("hide");
            $(".add-task-wrap").removeClass("hide");
        }
    }

    //----------------------------------
    // onTaskNameInput
    //----------------------------------

    onTaskNameInput(e){
        if($(".name-task-input").val() !== ""){
            $(".task-confirmation .add-task").removeClass("disable")
        }else {
            $(".task-confirmation .add-task").addClass("disable")
        }
    }

    //----------------------------------
    // onAddTaskCancel
    //----------------------------------

    onAddTaskCancel(e){
        $(".task-editor-wrap").addClass("hide");
        $(".content").removeClass("hide");
        $(".new-editor-wrap").addClass("hide")
        this.$host.find(".content").removeClass("hide");
        $(".add-task-wrap").removeClass("hide");
    }   

    //----------------------------------
    // onAddTaskConfirmtion
    //----------------------------------

    onAddTaskConfirmtion(e){
        let target = $(e.target);
        if(!target.hasClass("disable") && !target.parent().hasClass("disable")){
            this.taskService.addNewTask( {
                "name":$(".name-task-input").val(),
                "title":$(".description-task-input").val(),
                "sentTime":new Date().getTime(),
                "labels":this.choosenLabels,
                "isfinished":false,
                "priority":[],
                "category":1,
                "id":this.task.id + 1
            },);
            $(".add-task-dialog").addClass("hide");
            $(".add-task-wrap").removeClass("hide");
        }
    }

    //----------------------------------
    // onChooseLabels
    //----------------------------------


    onChooseLabels(choosenLabels){
        $(".features-wrap").html("")
        alert(choosenLabels)
        choosenLabels.forEach((id) => {
            $(".features-wrap").append(`
            <div class='label-wrap'>
                <div class='label-name'>${this.labelsService.getLabel(id).name}
                </div>
            </div>
            `
            );
        }) 
        this.choosenLabels = choosenLabels;
    }
}