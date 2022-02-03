import $ from 'jquery';
import { TasksService } from "../../../services/tasks.service";
import { ITask  } from '../../../interfaces/task.interface';
import { LabelsService } from "../../../services/labels.service";
import { TaskListItemComponents } from '../../taskListItem/task-list-item-component';
import moment from 'moment';

import '../day/day-component.scss';
const dayTemplate = require('../day/day-component.hbs');

export class DayComponent {
    tasksService:TasksService = TasksService.Instance;
    labelsService:LabelsService  = LabelsService.Instance;
    $el:any;
    day:number;
    tasklist:ITask[] = [];
    
    constructor(day:number){
      this.day = day
      this.setHtml();
    }

    setHtml(){
      let now = moment().add(this.day ,"day");
      this.tasklist = this.tasksService.getTasksByDate(new Date(now.toString()).getTime());

      this.$el = $(dayTemplate({
        date:now.format("DD MMM"),
        isTaskListEmpty:this.tasklist.length > 0,
        day:now.add(this.day , "day").format("dddd")
      }))
      $(".main .container .task-list .inside-task-list").append(this.$el);     

      this.renderTasks();
    }

    //----------------------------------
    // getDate
    //----------------------------------

    renderTasks(){
      this.tasklist.forEach((task) => {
        new TaskListItemComponents({
          task:task,
          parent:this,
          $host:this.$el.find(".day-task-list"),
          level:0,
          isToday:true
        })
      })
    }
}