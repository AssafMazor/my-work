import $ from 'jquery';
import { ITask } from "../../interfaces/task.interface";
import { TasksService } from "../../services/tasks.service";
import { LabelsService } from "../../services/labels.service";
import { TaskEditorComponent, eTaskMode } from "../taskEditor/taskEditorComponent";
import { TaskListItemComponents } from "../taskListItem/taskListItem";

import '../InboxTaskListComponent/InboxTaskListComponent.scss';
const taskListTemplate = require('../InboxTaskListComponent/InboxTaskListComponent.hbs');

export class inboxTaskListComponent {
    tasksService:TasksService = TasksService.Instance;
    labelsService:LabelsService  = LabelsService.Instance;;
    taskList: ITask[] = [];
    $el:any;

    constructor(taskList){
      this.taskList = taskList
      this.setHtml();

      this.tasksService.eventEmitter.on('task-change', () => {
        this.taskList = this.tasksService.getTasks()
        this.renderAllTasks(this.$el.find(".task-list-body") , 0);
      });

      this.tasksService.eventEmitter.on("addNewSubTask" , (newSubTask, subTask:ITask) => {
        this.renderAllTasks(this.$el.find(".task-list-body") , 1)
      })

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
      this.renderAllTasks(this.$el.find(".inbox-task-list-body") , 0);
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
    // renderAllTasks
    //----------------------------------

    renderAllTasks($parentEl , level){    
      this.$el.find(".inbox-task-list-body").html("");

      this.taskList.forEach((task:ITask) => {
        this.renderTask(task , $parentEl , level);
      })
    }

    //----------------------------------
    // renderTask
    //----------------------------------

    renderTask(task , $parentEl , level){
        new TaskListItemComponents({
          task:task, 
          parent:this, 
          $host:$parentEl, 
          level:level,
          isToday:false
        });
        
        let $el = $(`.inbox-task-list-body .item.${task.name}`)
        
        task.children.forEach((taskId) => {
          let subtask = this.tasksService.getTask(taskId)
          this.renderTask(subtask , $el , level + 1)
      });
    }
}