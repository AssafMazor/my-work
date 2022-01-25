import $ from 'jquery';
import { ITask } from "../../interfaces/task.interface";
import { TasksService } from "../../services/tasks.service";
import { LabelsService } from "../../services/labels.service";
import { TaskEditorComponent, eTaskMode } from "../taskEditor/taskEditorComponent";
import { TaskListItemComponents } from "../taskListItem/taskListItem";
import moment from 'moment';

import '../todayTaskListComponent/todayTaskListComponent.scss';
const taskListTemplate = require('../todayTaskListComponent/todayTaskListComponent.hbs');

export class TodayTaskListComponent {
    tasksService:TasksService = TasksService.Instance;
    labelsService:LabelsService  = LabelsService.Instance;;
    taskList: ITask[] = [];
    $el:any;
    overdueTasks:boolean;
    overDueTaskList:ITask[] = [];

    constructor(taskList){
      this.taskList = taskList
      this.overdueTasks = false
      this.setHtml();

      this.tasksService.eventEmitter.on('task-change', () => {
        this.taskList = this.tasksService.getAllTasks();
        this.isTasksOverDue();
        this.renderTodayTasks();
        this.renderOverDueTasks();
      });

      this.tasksService.eventEmitter.on("addNewSubTask" , (newSubTask, subTask:ITask) => {
        this.renderTodayTasks();
        this.renderOverDueTasks();
      })
    }

    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
      let now = moment()

      this.$el = $(taskListTemplate({
        tasks:this.taskList,
        today:now.format('D MMM'),
        todayDay:now.format('ddd'),
        isOverdueTasksExist:this.tasksService.getOverDueTasks().length > 0
      }))
      
      $(".main .container .task-list .inside-task-list").html(this.$el);
      this.initEvents();
      this.renderTodayTasks();
      this.renderOverDueTasks();
      this.isTasksOverDue();
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

    renderTodayTasks(){
      this.$el.find(".today-task-list-body").html("");
      this.taskList.forEach((task:ITask) => {
        if(new Date(task.sentTime).getDate() === new Date().getDate()){
            new TaskListItemComponents({
              task:task, 
              parent:this, 
              $host:this.$el.find(".today-task-list-body"),
              level:0,
              isToday:true
            });
        }
      })
    }

    //----------------------------------
    // renderOverDueTasks
    //----------------------------------

    renderOverDueTasks(){
      this.$el.find(".yesterday-task-list-body").html("");

      this.taskList.forEach((task:ITask) => {
        if(new Date(task.sentTime).getDate() === (new Date().getDate() - 1)){
            new TaskListItemComponents({
              task:task, 
              parent:this, 
              $host:this.$el.find(".yesterday-task-list-body"),
              level:0,
              isToday:true
            });
            this.overDueTaskList.push(task)
        }
      })
    }

    //----------------------------------
    // isTasksOverDue
    //----------------------------------

    isTasksOverDue(){
      if(this.tasksService.getOverDueTasks().length > 0){
          this.$el.find(".overdue-section").removeClass("hide");
          this.$el.find(".task-list-name").removeClass("hide");
      }else {
        this.$el.find(".overdue-section").addClass("hide");
        this.$el.find(".task-list-name").addClass("hide");
      }
    }
}