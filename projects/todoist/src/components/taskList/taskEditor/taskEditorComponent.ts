import $ from 'jquery';
import { ITask } from "../../../interfaces/task.interface";
import { TasksService } from "../../../services/tasks.service";
import { LabelsService } from "../../../services/labels.service";
import { LabelComponents , eTaskAction } from "./labelsComponent/labelsComponent"
import { priorityComponents } from "./priorityComponents/priorityComponents";
import { PriorityService } from "../../../services/priority.service";
import moment from 'moment';
import { datePickerComponents } from "../viewTaskComponent/datePickerComponents/datePickerComponents"

export enum eTaskMode {
    Add,
    Edit
}

export interface IEditorParams {
    $wrap: any,
    parent:any,
    task: ITask,
    isAddMode:eTaskMode,
    showAsDialog?:boolean
    isAddSubTask:boolean
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
    private isAddSubTask:boolean = true;
    private taskTime:any;

    constructor(params:IEditorParams){
        this.isAddSubTask = params.isAddSubTask
        this.parent = params.parent
        this.task = params.task;
        this.$host = params.$wrap
        this.isAddMode = params.isAddMode === eTaskMode.Add;
        this.showAsDialog = !!params.showAsDialog;
        this.setHtml();
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
            sentTime:this.getTaskSendTime()
        }));
        this.$host.html(this.$el);
        this.onChooseLabels(this.task.labels)
        this.initEvents();
    }
    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
        this.$el.find(".name-task-input").on("input" , (e) => {
            this.onTaskNameInput(e);
        })
        this.$el.find(".task-confirmation .cancel").on('click' , (e) => {
            this.onAddTaskCancel(e);
        })
        this.$el.find(".task-confirmation .add-task-btn").on("click" , (e) => {
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
    }

    //----------------------------------
    // getTaskSendTime
    //----------------------------------

    getTaskSendTime(){
        let sentTime = moment(this.task.sentTime);
        let now = moment();
        let diff = now.diff(sentTime, 'days');

       if(diff > 7){
            if(new Date(this.task.sentTime).getHours() > 0){
                return sentTime.format('D MMM h:m');
            }else {
                return sentTime.format('D MMM');
            }
        }else {
            if(diff > 0){
                var mydate = sentTime;
                if(new Date(this.task.sentTime).getHours() > 0){
                    return moment(mydate).format('d h:m');
                }else {
                    debugger;
                    return moment(mydate).format('dddd');
                }
            }else {
                if(!isNaN(diff)){
                    return `today ${sentTime.format('h:m')}` 
                }
                return "Schedule"
            }
        }
    }
    
    //----------------------------------
    // renderSubTaskList
    //----------------------------------

    onDatePickerBtnClick(e){
        this.$el.find(".date-picker-dialog").removeClass("hide");
        new datePickerComponents(this.task , this , true);
    }

    // ---------------------------------
    // onAddSubTaskBtnClick
    // ----------------------------------

    onAddSubTaskBtnClick(e){
        this.taskService.addSubTask({
            "name":$(".name-task-input").val(),
            "title":$(".description-task-input").val(),
            "parentId":this.task.id,
            "isToday":false,
            "sentTime":new Date().getTime(),
            "labels":this.choosenLabels,
            "isfinished":false,
            "priority":[],
            "category":this.task.category,
            "id": new Date().getTime(),
            "children":[]
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
    // onTaskSave
    //----------------------------------

    onTaskSave(e){
        if(e.stopPropagation) {
            e.stopPropagation();
        }
        this.taskService.editTask({
            "name":$(".edit-name-task-input").val(),
            "title":$(".edit-description-task-input").val(),
            "parentId":this.task.parentId,
            "sentTime":this.taskTime,
            "isToday":this.task.isToday,
            "labels":this.choosenLabels,
            "isfinished":this.task.isfinished,
            "priority":this.choosenPriority,
            "category":this.task.category,
            "id":this.task.id,
            "children":this.task.children
        }
        );
        $(".add-task").addClass("hide");
        $(".add-task-wrap").removeClass("hide");
        this.parent.$el.find(".task-editor-wrap").addClass("hide");
        this.parent.$el.find(".content").removeClass("hide");
        $(".features-wrap").removeClass("hide");
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
    // onAddTaskCancel
    //----------------------------------

    onAddTaskCancel(e){
        $(".task-editor-wrap").addClass("hide");
        $(".content").removeClass("hide");
        $(".new-editor-wrap").addClass("hide")
        this.$host.find(".content").removeClass("hide");
        $(".add-task-wrap").removeClass("hide");
        $(".features-wrap").removeClass("hide")
    }   

    //----------------------------------
    // onAddTaskConfirmtion
    //----------------------------------

    onAddTaskConfirmtion(e){
        this.taskService.addNewTask( {
            "name":$(".name-task-input").val(),
            "title":$(".description-task-input").val(),
            "parentId":"-1",
            "isToday":false,
            "sentTime":new Date().getTime(),
            "labels":this.choosenLabels,
            "isfinished":false,
            "priority":[],
            "category":this.task.category,
            "id":new Date().getTime(),
            "children":[]
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