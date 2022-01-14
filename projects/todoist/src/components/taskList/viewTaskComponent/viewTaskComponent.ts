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
    task:ITask;
    choosenLabels: number[] = [];

    constructor(task){
        this.task = task
        this.setHtml();
        this.onEditTaskChange();
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
      new TaskListItemComponents(this.task , this , eTaskCaller.View);
      this.onChooseLabels(this.task.labels);
      this.initEvents();
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
    // initEvents
    //----------------------------------

    initEvents(){
        this.$el.find(".edit-label-wrap").on("click" , (e) => {
            this.onEditLabelBtnClick(e);
        })
        this.$el.find(".content").on("click" , (e) => {
            this.onEditTaskClick(e);
        })
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
            isAddMode:eTaskMode.Edit
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