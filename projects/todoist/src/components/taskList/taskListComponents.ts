import $ from 'jquery';
import { Itask } from "../../interfaces/task.interface";
import { ILabel } from "../../interfaces/label.interface";
import './taskListComponents.scss';
import { TasksService } from "../../services/tasks.service";
import { LabelsService } from "../../services/labels.service";
import { taskEditorComponent } from "./taskEditorComponent/taskEditorComponent";
import { TaskListItemComponents } from "./taskListItem/taskListItem";

const taskListTemplate = require('./taskListComponents.hbs');

export class TaskListComponents {
    tasksService:TasksService;
    labelsService:LabelsService;
    taskList;

    constructor(){
      this.tasksService = TasksService.Instance;
      this.labelsService = LabelsService.Instance;

      this.setHtml();
      this.onAddTaskClick();
      this.setOnTasksChangeEvent();
    }

    setHtml(){
      this.taskList = this.tasksService.getTasks();

      $(".main .container .task-list .inside-task-list").html(taskListTemplate({
        tasks:this.taskList,
      }));
      this.setTaskItems();
    }

    //----------------------------------
    // onAddTaskClick
    //----------------------------------

    onAddTaskClick(){
      $(".add-task-wrap").on("click" , (e) => {
        let $wrap = $(".new-editor-wrap");
        $wrap.removeClass("hide");
        new taskEditorComponent($wrap ,  {
        name:"",
        title:"",
        sentTime:1640874110852,
        labels:[],
        isfinished:false,
        priority:[],
        category:3,
        id:this.taskList.length + 1
        }
        , "add-task"
        );
        $(".add-task-dialog").removeClass("hide");
        $(".task-list-footer .add-task-wrap").addClass("hide");
      })
    }

    //----------------------------------
    // setOnTasksChangeEvent
    //----------------------------------

    setOnTasksChangeEvent(){
      this.tasksService.eventEmitter.on('task-change', (taskList:Itask[]) => {
        this.taskList = taskList;
        this.setTaskItems();
      });
    }

    //----------------------------------
    // setTaskItems
    //----------------------------------

    setTaskItems(){
      $(".task-list-body").html("")
      this.taskList.forEach((task) => {
        new TaskListItemComponents(task)
      })
    }
}