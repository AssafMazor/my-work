import $ from 'jquery';
import  EventEmitter from 'events';
import { ITask } from "../../interfaces/task.interface";
import { TasksService } from "../../services/tasks.service";
import { LabelsService } from "../../services/labels.service";
import { CommonService } from '../../services/common.service';
import { LabelComponents , eTaskAction } from "./labelsComponent/labelsComponent"
import { PriorityComponents } from "./priorityComponents/priorityComponents";
import { PriorityService } from "../../services/priority.service";
import moment from 'moment';
import { DatePickerComponents } from "../viewTaskComponent/datePickerComponents/datePickerComponents"
import { isEqual } from 'lodash';

export enum eTaskMode {
    Add,
    Edit
}

export interface IEditorParams {
    $wrap: any,
    parent:any,
    task: ITask,
    isAddMode:eTaskMode,
    showAsDialog?:boolean,
    isAddSubTask:boolean,
    parentSectionId:string,
    labelId?:string[],
}
  
import './taskEditorComponent.scss';
const taskEditorTemplate = require('./taskEditorComponent.hbs');

export class TaskEditorComponent {  
    private taskService:TasksService = TasksService.Instance;
    private labelsService:LabelsService = LabelsService.Instance;
    private commonService:CommonService = CommonService.Instance;
    private priorityService:PriorityService = PriorityService.Instance;
    public eventEmitter: EventEmitter = new EventEmitter;
    private task:ITask;
    private choosenLabels:string[] = [];
    private $host:any;
    private $el:any;
    private isAddMode: boolean = false;
    private showAsDialog:boolean = false;
    private choosenPriority:any;
    private parent:any;
    private isAddSubTask:boolean = true;
    private parentSectionId:string;
    private originalTask:ITask;

    constructor(params:IEditorParams){
        this.isAddSubTask = params.isAddSubTask
        this.parent = params.parent
        this.parentSectionId = params.parentSectionId
        this.task = params.task;
        this.originalTask = JSON.parse(JSON.stringify(params.task))
        this.$host = params.$wrap
        this.isAddMode = params.isAddMode === eTaskMode.Add;
        this.showAsDialog = !!params.showAsDialog;
        this.setHtml();

        if(params.labelId !== undefined){   
            this.onChooseLabels(params.labelId)
        }
    }

    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
        this.$el = $(taskEditorTemplate({
            isAddMode:this.isAddMode,
            display:this.showAsDialog ? "dialog" : "",
            task:this.task,
            priorityColor:this.priorityService.getPriorityColor(this.task.priority),
            isAddSub:this.isAddSubTask,
            sentTime:this.commonService.getDate(moment(this.task.sentTime))
        }));
        this.$host.html(this.$el);
        if(!this.isAddMode){
            this.onChooseLabels(this.task.labels)
        }
        this.initEvents();
    }
    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
        this.$el.find(".name-task-input").on("input" , (e) => {
            this.onTaskNameInput(e);
        })
        this.$el.find(".cancel").on('click' , (e) => {
            this.onAddTaskCancel(e);
        })
        this.$el.find(".add-task-btn").on("click" , (e) => {
            this.onAddTaskConfirmtion(e);
        })
        this.$el.find(".edit-label-wrap").on("click" , (e) => {
            this.onEditLabelBtnClick(e);
        })
        this.$el.find(".add-label-wrap").on("click" , (e) => {
            this.onLabelBtnClick(e);
        })
        this.$el.find(".btn-save").on("click" , (e) => {
            this.onTaskSave(e);
        })
        this.$el.find(".priority-wrap").on("click" , (e) => {
            this.onPriorityBtnCLick(e);
        })
        this.$el.find(".add-sub-task-btn").on("click" , (e) => {
            this.onAddSubTaskBtnClick(e);
        })   
        this.$el.find(".date-wrap").on("click" , (e) => {
            this.onDatePickerBtnClick(e);
        })
        this.$el.find(".edit-name-task-input").on("input" , (e) => {
            this.onEditTaskNameInput(e);
        })
    }

    //----------------------------------
    // renderSubTaskList
    //----------------------------------

    onDatePickerBtnClick(e){
        this.$el.find(".date-picker-dialog").removeClass("hide");
        new DatePickerComponents(this.task , this , true);
    }

    // ---------------------------------
    // onAddSubTaskBtnClick
    // ----------------------------------

    onAddSubTaskBtnClick(e){
        this.taskService.addSubTask({
            "name":($(".name-task-input").val() || '').toString(),
            "title":($(".description-task-input").val() || '').toString(),
            "parentId":this.task.id,
            "isToday":false,
            "sentTime":new Date().getTime(),
            "labels":this.choosenLabels,
            "isfinished":false,
            "priority":4,
            "category":this.task.category,
            "id": new Date().getTime().toString(),
            "children":[],
            "sectionId":"-1"
        },
        this.task
        );
        $(".add-task").addClass("hide");
        $(".add-task-wrap").removeClass("hide");
        $(".new-editor-wrap").addClass("hide");
    }

    //----------------------------------
    // onPriorityBtnCLick
    //----------------------------------

    onPriorityBtnCLick(e){
        new PriorityComponents({
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
    // onTaskSave
    //----------------------------------

    onTaskSave(e){
        if(e.stopPropagation) {
            e.stopPropagation();
        }
        this.taskService.editTask({
            "name":($(".edit-name-task-input").val() || '').toString(),
            "title":($(".edit-description-task-input").val() || "").toString(),
            "parentId":this.task.parentId,
            "sentTime":this.task.sentTime,
            "isToday":this.task.isToday,
            "labels":this.choosenLabels,
            "isfinished":this.task.isfinished,
            "priority":this.choosenPriority,
            "category":this.task.category,
            "id":this.task.id,
            "children":this.task.children,
            "sectionId":this.parentSectionId
        }
        );
        $(".add-task").addClass("hide");
        $(".add-task-wrap").removeClass("hide");
        this.parent.$el.find(".task-editor-wrap").addClass("hide");
        this.parent.$el.find(".content").removeClass("hide");
        this.eventEmitter.emit('edit-task-change', true,this.task);
    }

    //----------------------------------
    // onTaskNameInput
    //----------------------------------

    onTaskNameInput(e){
        if($(".name-task-input").val() !== ""){
            $(".task-confirmation .add-task-btn").removeClass("disable");
            $(".task-confirmation .add-sub-task-btn").removeClass("disable");
        }else {
            $(".task-confirmation .add-task-btn").addClass("disable");
            $(".task-confirmation .add-sub-task-btn").removeClass("disable");
        }
    }

    //----------------------------------
    // onEditTaskNameInput
    //----------------------------------

    onEditTaskNameInput(e){
        this.task.name = this.$el.find(".edit-name-task-input").val();
        this.detectChanges();
    }

    //----------------------------------
    // detectChanges
    //----------------------------------

    detectChanges(){
        if(isEqual(this.originalTask, this.task)){
            this.eventEmitter.emit('edit-task-change', true,this.task);
        }else {
            this.eventEmitter.emit('edit-task-change', false,this.task);
        }
    }

    //----------------------------------
    // onAddTaskCancel
    //----------------------------------

    onAddTaskCancel(e){
        this.$host.addClass("hide");
        this.parent.$el.find(".content").removeClass("hide");
        this.parent.$el.find(".add-task-wrap").removeClass("hide")
    }   

    //----------------------------------
    // onAddTaskConfirmtion
    //----------------------------------

    onAddTaskConfirmtion(e){
        this.taskService.addNewTask({
            "name": ($(".name-task-input").val() || '').toString(),
            "title":($(".description-task-input").val() || "").toString(),
            "parentId":"-1",
            "isToday":false,
            "sentTime":new Date().getTime(),
            "labels":this.choosenLabels,
            "isfinished":this.task.isfinished,
            "priority":this.task.priority,
            "category":this.task.category,
            "id":new Date().getTime().toString(),
            "children":[],
            "sectionId":this.parentSectionId
        },);
        $(".add-task").addClass("hide");
        $(".add-task-wrap").removeClass("hide");
        $(".new-editor-wrap").addClass("hide");
    }

    //----------------------------------
    // onChooseLabels
    //----------------------------------

    onChooseLabels(choosenLabels:string[]){
        $(".features-wrap").html("")
        choosenLabels.forEach((id:string) => {
            $(".features-wrap").append(`
            <div class='label-wrap'>
                <div class='label-name'>${this.labelsService.getLabel(id).name}
                </div>
            </div>
            `
            );
        }) 
        this.choosenLabels = choosenLabels;
        this.task.labels = choosenLabels
        this.detectChanges();
    }

    //----------------------------------
    // onChoosePriorities
    //----------------------------------

    onChoosePriorities(choosenPriorityId:number , choosenPriorityName:string){
        this.$el.find(".priority-icon").addClass(choosenPriorityName)
        this.$el.find(".priority-icon").addClass(choosenPriorityName)
        
        this.choosenPriority = choosenPriorityId;
        this.task.priority = choosenPriorityId
        this.detectChanges();
    }
}