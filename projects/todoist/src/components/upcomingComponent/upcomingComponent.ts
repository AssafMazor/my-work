import $ from 'jquery';
import { ITask } from "../../interfaces/task.interface";
import { TasksService } from "../../services/tasks.service";
import { LabelsService } from "../../services/labels.service";
import { TaskEditorComponent, eTaskMode } from "../taskEditor/taskEditorComponent";
import { TaskListItemComponents } from "../taskListItem/taskListItem";
import moment from 'moment';
import { DayComponent } from './dayComponent/dayComponent';

import '../upcomingComponent/upcomingComponent.scss';
const upcomingTemplate = require('../upcomingComponent/upcomingComponent.hbs');

export class upcomingComponent {
    tasksService:TasksService = TasksService.Instance;
    labelsService:LabelsService  = LabelsService.Instance;;
    taskList: ITask[] = [];
    $el:any;
    overdueTasks:boolean;

    constructor(taskList){
      this.taskList = taskList
      this.overdueTasks = false
      this.setHtml();

      this.tasksService.eventEmitter.on('task-change', () => {
        this.taskList = this.tasksService.getAllTasks()
        this.renderTodayTasks();
      });

      this.tasksService.eventEmitter.on("addNewSubTask" , (newSubTask, subTask:ITask) => {
        this.renderTodayTasks()
      })
    }

    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
      let now = moment()

      this.$el = $(upcomingTemplate({
        tasks:this.taskList,
        today:now.format('MMMM y'),
      }))
      
      $(".main .container .task-list .inside-task-list").html(this.$el);

      this.initEvents();
      this.renderTodayTasks();
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
     
      for(let i=0; i<8;i++){
        new DayComponent(i);
      }
    }
}