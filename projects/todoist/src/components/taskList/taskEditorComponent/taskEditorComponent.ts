import $ from 'jquery';
import { Itask } from "../../../interfaces/task.interface";
import { ILabel } from "../../../interfaces/label.interface";
import '../taskEditorComponent/taskEditorComponent.scss';
import { TasksService } from "../../../services/tasks.service";
import { LabelsService } from "../../../services/labels.service";
import { addLabelComponents } from "../addLabelComponents/addLabelComponents"

const taskEditorTemplate = require('../taskEditorComponent/taskEditorComponent.hbs');

export class taskEditorComponent {  
    taskService:TasksService;
    labelsService:LabelsService;
    task;
    choosenLabels:number[] = [];
    container:any;
    $main;
    caller;

    constructor(container:any, task , caller){
        this.taskService = TasksService.Instance
        this.labelsService = LabelsService.Instance;
        this.task = task
        this.container = container
        this.caller = caller === "add-task"
        this.setHtml();
    }

    setHtml(){
        this.$main = $(taskEditorTemplate({
            caller:this.caller,
            task:this.task
        }));
        this.container.html(this.$main);
        this.onChooseLabels(this.task.labels , this.labelsService.getLabels())
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
        new addLabelComponents({
            parent: this,
            task: this.task,
            caller: "addTask",
            labels: this.labelsService.getLabels()
        });
        this.$main.find(".new-label-dialog").addClass("show");
    }

    //----------------------------------
    // onEditLabelBtnClick
    //----------------------------------

    onEditLabelBtnClick(e){
        new addLabelComponents({
            parent: this,
            task: this.task,
            caller: "edit-task",
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
        this.container.find(".task-editor-wrap").addClass("hide")
        this.container.find(".content").removeClass("hide")
        $(".add-task-wrap").removeClass("hide");
    }   

    //----------------------------------
    // onAddTaskConfirmtion
    //----------------------------------

    onAddTaskConfirmtion(e){
        if(!$(e.target).hasClass("disable") && !$(e.target).parent().hasClass("disable")){
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


    onChooseLabels(choosenLabels , labelsList){
        $(".features-wrap").html("")
        choosenLabels.forEach((id) => {
            console.log(choosenLabels)
            $(".features-wrap").append(`
            <div class='label-wrap'>
                <div class='label-name'>${this.labelsService.getLabel(id).name}
                </div>
            </div>
            `
            );
        }) 
        this.choosenLabels = choosenLabels
    }
}