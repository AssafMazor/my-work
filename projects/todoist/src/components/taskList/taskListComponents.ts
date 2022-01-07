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

    constructor(){
      this.tasksService = TasksService.Instance;
      this.labelsService = LabelsService.Instance;

      this.setHtml();
      this.onAddTaskClick();
      this.setOnTasksChangeEvent();
    }

    //----------------------------------
    // setHtml
    //----------------------------------

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

          new TaskEditorComponent(
            $wrap, 
            this.tasksService.x(),
            eTaskMode.Add
          );

        $(".add-task-dialog").removeClass("hide");
        $(".task-list-footer .add-task-wrap").addClass("hide");
    })
  }

    //----------------------------------
    // setOnTasksChangeEvent
    //----------------------------------

    setOnTasksChangeEvent(){
      this.tasksService.eventEmitter.on('task-change', (taskList:ITask[]) => {
        this.taskList = taskList;
        this.setTaskItems();
      });
    }

    //----------------------------------
    // setTaskItems
    //----------------------------------

    setTaskItems(){
      $(".task-list-body").html("")
      this.taskList.forEach((task:ITask) => {
        new TaskListItemComponents(task)
      })
    }
}