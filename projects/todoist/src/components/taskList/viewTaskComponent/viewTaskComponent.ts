import $ from 'jquery';
import { ITask } from "../../../interfaces/task.interface";
import { TasksService } from "../../../services/tasks.service";
import { LabelsService } from "../../../services/labels.service";
import { TaskEditorComponent, eTaskMode } from "../taskEditor/taskEditorComponent";
import { PriorityService } from "../../../services/priority.service";
import { LabelComponents , eTaskAction } from "../taskEditor/labelsComponent/labelsComponent";
import { TaskListItemComponents , eTaskCaller } from "../taskListItem/taskListItem"
import '../viewTaskComponent/viewTaskComponent.scss';

const viewTaskTemplate = require('../viewTaskComponent/viewTaskComponent.hbs');

export class viewTaskComponents {
    private tasksService:TasksService = TasksService.Instance;;
    private priorityService:PriorityService = PriorityService.Instance;
    private $el:any;
    private labelsService:LabelsService = LabelsService.Instance;
    private task:ITask;
    private choosenLabels: number[] = [];
    private parent:any;
    private taskListComponent:any;

    constructor(task , taskListComponent , parent){
        this.task = task;
        this.parent = parent;
        this.taskListComponent = taskListComponent
        this.setHtml();
        this.onEditTaskChange();
        this.subTaskList();

        this.tasksService.eventEmitter.on("sub-task-change" , (task:ITask) => {
            new TaskListItemComponents(task , this , eTaskCaller.Task , true)
        })
    }

    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){ 
      this.$el = $(viewTaskTemplate({
        task:this.task,
        priorityColor:this.priorityService.getPriorityColor(this.task.priority)
      }));
      $(".view-task-dialog").html(this.$el);
    //   new TaskListItemComponents(this.task , this , eTaskCaller.View);
      this.onChooseLabels(this.task.labels);
      this.initEvents();
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
        this.$el.find(".edit-label-wrap").on("click" , (e) => {
            this.onEditLabelBtnClick(e);
        })
        this.$el.find(".content").on("click" , (e) => {
            this.onEditTaskClick(e);
        })
        this.$el.find(".add-sub-task-wrap").on("click" , (e) => {
            this.onAddSubTaskClick(e);
        })
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    subTaskList(){
        this.task.children.forEach((child) => {
            this.taskListComponent.renderTree(child , this.$el.find(".sub-task-list") , 1 , true)
        })
    }

    //----------------------------------
    // onEditTaskChange
    //----------------------------------

    onAddSubTaskClick(e){
        let $wrap = this.$el.find(".new-editor-wrap");
        $wrap.removeClass("hide");

        new TaskEditorComponent({
            $wrap:$wrap, 
            parent:this,
            task:this.task,
            isAddMode:eTaskMode.Add,
            isAddSubTask:true
        })
    }

    //----------------------------------
    // onEditTaskChange
    //----------------------------------

    onEditTaskChange(){
        this.tasksService.eventEmitter.on('onEditTaskChange', (task:ITask) => {
            this.task = task;
            this.updateEditedTask();
        });
    }

    //----------------------------------
    // updateEditedTask
    //----------------------------------

    updateEditedTask(){
        this.$el.find(".name").text(this.task.name);
        this.onChooseLabels(this.task.labels);
        this.$el.find(".features-wrap").removeClass("hide")
        this.$el.find(".view-task-delete-checkbox").addClass(this.priorityService.getPriorityColor(this.task.priority))
    }

    //----------------------------------
    // onEditTaskClick
    //----------------------------------

    onEditTaskClick(e){
        let $wrap = this.$el.find(".task-editor-wrap");
        $($wrap).removeClass("hide");
        
        new TaskEditorComponent({
            $wrap:$wrap,
            parent:this,
            task:this.task,
            isAddMode:eTaskMode.Edit,
            isAddSubTask:false
        });

        this.$el.find(".content").addClass("hide")
        this.$el.find(".features-wrap").addClass("hide")
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
        $(".add-new-label").addClass("show");
    }

    //----------------------------------
    // onChooseLabels
    //----------------------------------

    onChooseLabels(choosenLabels){
        this.$el.find(".features-wrap").html("")
        choosenLabels.forEach((id) => {
            this.$el.find(".features-wrap").append(`
            <div class='label-wrap'>
                <div class='label-name'>${this.labelsService.getLabel(id).name}
                </div>
            </div>
            `
            );
        }) 
        this.choosenLabels = choosenLabels;
        this.task.labels = choosenLabels
    }
}