import $ from 'jquery';
import  EventEmitter from 'events';
import { ITask } from "../../interfaces/task.interface";
import { TasksService } from "../../services/tasks.service";
import { LabelsService } from "../../services/labels.service";
import { CommonService } from '../../services/common.service';
import { LabelComponent , eTaskAction } from "./labels/labels-component"
import { PriorityComponent } from "./priority/priority-component";
import { PriorityService } from "../../services/priority.service";
import moment from 'moment';
import { DatePickerComponent } from "../viewTask/datePicker/date-picker-component"
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
  
import '../taskEditor/task-editor-component.scss';
const taskEditorTemplate = require('../taskEditor/task-editor-component.hbs');

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
            priorityColor:this.priorityService.getPriorityColor(this.task.data.priority),
            isAddSub:this.isAddSubTask,
            sentTime:this.commonService.getDate(moment(this.task.data.sentTime))
        }));
        this.$host.html(this.$el);
        if(!this.isAddMode){
            this.onChooseLabels(this.task.data.labels)
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
        new DatePickerComponent(this.task , this , true);
    }

    // ---------------------------------
    // onAddSubTaskBtnClick
    // ----------------------------------

    onAddSubTaskBtnClick(e){
        this.taskService.addSubTask({
            "taskId": new Date().getTime().toString(),
            "data":{
                "name":($(".name-task-input").val() || '').toString(),
                "title":($(".description-task-input").val() || '').toString(),
                "parentId":this.task.taskId,
                "isToday":false,
                "sentTime":new Date().getTime(),
                "labels":this.choosenLabels,
                "isfinished":false,
                "priority":4,
                "category":this.task.data.category,
                "children":[],
                "sectionId":"-1"
            }
        },
        this.task,
        ()=>{}
        );
        $(".add-task").addClass("hide");
        $(".add-task-wrap").removeClass("hide");
        $(".new-editor-wrap").addClass("hide");
    }

    //----------------------------------
    // onPriorityBtnCLick
    //----------------------------------

    onPriorityBtnCLick(e){
        new PriorityComponent({
            parent: this,
            task: this.task,
        });
    }

    //----------------------------------
    // onLabelBtnClick
    //----------------------------------

    onLabelBtnClick(e){
        new LabelComponent({
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
        new LabelComponent({
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
            "taskId":this.task.taskId,
            "data":{
                "name":($(".edit-name-task-input").val() || '').toString(),
                "title":($(".edit-description-task-input").val() || "").toString(),
                "parentId":this.task.data.parentId,
                "sentTime":this.task.data.sentTime,
                "isToday":this.task.data.isToday,
                "labels":this.choosenLabels,
                "isfinished":this.task.data.isfinished,
                "priority":this.choosenPriority,
                "category":this.task.data.category,
                "children":this.task.data.children,
                "sectionId":this.parentSectionId
            }
        },
        ()=>{}
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
        this.task.data.name = this.$el.find(".edit-name-task-input").val();
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
            "taskId":new Date().getTime().toString(),
            "data":{
                "name": ($(".name-task-input").val() || '').toString(),
                "title":($(".description-task-input").val() || "").toString(),
                "parentId":"-1",
                "isToday":false,
                "sentTime":new Date().getTime(),
                "labels":this.choosenLabels,
                "isfinished":this.task.data.isfinished,
                "priority":this.task.data.priority,
                "category":this.task.data.category,
                "children":[],
                "sectionId":this.parentSectionId
            }
        },
        ()=>{}
        );
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
        this.task.data.labels = choosenLabels
        this.detectChanges();
    }

    //----------------------------------
    // onChoosePriorities
    //----------------------------------

    onChoosePriorities(choosenPriorityId:number , choosenPriorityName:string){
        this.$el.find(".priority-icon").addClass(choosenPriorityName)
        this.$el.find(".priority-icon").addClass(choosenPriorityName)
        
        this.choosenPriority = choosenPriorityId;
        this.task.data.priority = choosenPriorityId
        this.detectChanges();
    }
}