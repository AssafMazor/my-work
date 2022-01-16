import $ from 'jquery';
import { ITask } from "../../interfaces/task.interface";
import { TasksService } from "../../services/tasks.service";
import { LabelsService } from "../../services/labels.service";
import { TaskEditorComponent, eTaskMode } from "./taskEditor/taskEditorComponent";
import { TaskListItemComponents } from "./taskListItem/taskListItem";

import './taskListComponents.scss';

const taskListTemplate = require('./taskListComponents.hbs');

export class TaskListComponents {
    tasksService:TasksService;
    labelsService:LabelsService;
    taskList: ITask[] = [];
    $el:any;

    constructor(taskList){
      this.taskList = taskList
      this.tasksService = TasksService.Instance;
      this.labelsService = LabelsService.Instance;
      this.setHtml();

      this.tasksService.eventEmitter.on('task-change', (taskList:ITask[]) => {
        this.taskList = taskList;
        this.renderTaskItems();
      });

      this.tasksService.eventEmitter.on('sub-task-change', (task:ITask[]) => {
        this.taskList = taskList;
        this.renderTree(task , $(".sub-task-list") , 0);
      });
    }

    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
      this.$el = $(taskListTemplate({
        tasks:this.taskList,
      }))
      
      $(".main .container .task-list .inside-task-list").html(this.$el);

      this.initEvents();
      this.renderTaskItems();
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
      this.$el.find(".add-task-wrap").on("click" , (e) => {
        this.onAddTaskClick(e);
        
      })
    }

    //----------------------------------
    // onAddTaskClick
    //----------------------------------

    onAddTaskClick(e){
      let $wrap = $(".new-editor-wrap");
      $wrap.removeClass("hide");

      new TaskEditorComponent({
        $wrap:$wrap, 
        parent:this,
        task:this.tasksService.returnNewTask(),
        isAddMode:eTaskMode.Add,
        isAddSubTask:false
      });

      this.$el.find(".add-task-dialog").removeClass("hide");
      this.$el.find(".task-list-footer .add-task-wrap").addClass("hide");
    }

    //----------------------------------
    // renderTaskItems
    //----------------------------------

    renderTaskItems(){    
      this.$el.find(".task-list-body").html("")
      this.taskList.forEach((task:ITask) => {
        this.renderTree(task , this.$el.find(".task-list-body") , 0);
      })
    }

    //----------------------------------
    // renderTaskItems
    //----------------------------------

    renderTree(task , $parentEl , level , isViewMode?){
        new TaskListItemComponents(task , this , $parentEl , level);
        let $el = $(`.${task.name}`)
      console.log(isViewMode)
        task.children.forEach((child) => {
          this.renderTree(child , $el , level + 1, isViewMode)
      })
    }
}