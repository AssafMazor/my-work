import $ from 'jquery';
import { ITask } from "../../../interfaces/task.interface";
import { TasksService } from "../../../services/tasks.service";
import { LabelsService } from "../../../services/labels.service";
import { LabelComponents , eTaskAction } from "./labelsComponent/labelsComponent"
import { priorityComponents } from "./priorityComponents/priorityComponents";
import { PriorityService } from "../../../services/priority.service";

export enum eTaskMode {
    Add,
    Edit
}

export interface ILabelParams {
    $wrap: any,
    parent:any,
    task: ITask,
    isAddMode:eTaskMode
    showAsDialog?:boolean
  }
  

import './taskEditorComponent.scss';
const taskEditorTemplate = require('./taskEditorComponent.hbs');

export class TaskEditorComponent {  
    private taskService:TasksService = TasksService.Instance;
    private labelsService:LabelsService = LabelsService.Instance;
    private priorityService:PriorityService = PriorityService.Instance;
    private task:ITask;
    private choosenLabels:number[] = [];
    private $host:any;
    private $el:any;
    private isAddMode: boolean = false;
    private showAsDialog:boolean = false;
    private choosenPriority:any;
    private parent:any;

    constructor(params:ILabelParams){
        this.parent = params.parent
        this.task = params.task;
        this.$host = params.$wrap
        this.isAddMode = params.isAddMode === eTaskMode.Add;
        this.showAsDialog = !!params.showAsDialog;
        this.setHtml();
    }

    setHtml(){
        this.$el = $(taskEditorTemplate({
            isAddMode:this.isAddMode,
            display:this.showAsDialog ? "dialog" : "",
            task:this.task,
            priorityColor:this.priorityService.getPriorityColor(this.task.priority)
        }));
        
        this.$host.html(this.$el);
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
        $(".task-confirmation .add-task-btn").on("click" , (e) => {
            this.onAddTaskConfirmtion(e);
        })
        this.$el.find(".edit-label-wrap").on("click" , (e) => {
            this.onEditLabelBtnClick(e);
        })
        this.$el.find(".add-label-wrap").on("click" , (e) => {
            this.onLabelBtnClick(e);
        })
        $(".task-confirmation .btn-save").on("click" , (e) => {
            this.onTaskSave(e);
        })
        this.$el.find(".priority-wrap").on("click" , (e) => {
            this.onPriorityBtnCLick(e);
        })
    }

    //----------------------------------
    // onPriorityBtnCLick
    //----------------------------------

    onPriorityBtnCLick(e){
        new priorityComponents({
            parent: this,
            task: this.task,
        });
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
        this.$el.find(".new-label-dialog").addClass("show");
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
        this.$el.find(".edit-label-dialog").removeClass("hide")
    }

    //----------------------------------
    // onEditTaskConfirmtion
    //----------------------------------

    onTaskSave(e){
        alert("dhoifo")
        this.taskService.editTask({
            "name":$(".edit-name-task-input").val(),
            "title":$(".edit-description-task-input").val(),
            "sentTime":new Date().getTime(),
            "labels":this.choosenLabels,
            "isfinished":this.task.isfinished,
            "priority":this.choosenPriority,
            "category":1,
            "id":this.task.id
        },
        );
        $(".add-task").addClass("hide");
        $(".add-task-wrap").removeClass("hide");
        console.log(this.parent.$el)
        this.parent.$el.find(".task-editor-wrap").addClass("hide")
        this.parent.$el.find(".content").removeClass("hide")
    }

    //----------------------------------
    // onTaskNameInput
    //----------------------------------

    onTaskNameInput(e){
        if($(".name-task-input").val() !== ""){
            $(".task-confirmation .add-task-btn").removeClass("disable")
        }else {
            $(".task-confirmation .add-task-btn").addClass("disable")
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
        this.parent.$el.find(".features-wrap").removeClass("hide")
    }   

    //----------------------------------
    // onAddTaskConfirmtion
    //----------------------------------

    onAddTaskConfirmtion(e){
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
        $(".add-task").addClass("hide");
        $(".add-task-wrap").removeClass("hide");
        $(".new-editor-wrap").addClass("hide");
    }

    //----------------------------------
    // onChooseLabels
    //----------------------------------

    onChooseLabels(choosenLabels){
        $(".features-wrap").html("")
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

    //----------------------------------
    // onChoosePriorities
    //----------------------------------

    onChoosePriorities(choosenPriorityId , choosenPriorityName){
        this.$el.find(".priority-icon").addClass(choosenPriorityName)
        this.$el.find(".priority-icon").addClass(choosenPriorityName)
        
        this.choosenPriority = choosenPriorityId;
    }
}