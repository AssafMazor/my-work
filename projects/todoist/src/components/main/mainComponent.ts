import $ from 'jquery';
import { HeaderComponents } from "../header/headerComponent/headerComponent"
import { TaskListComponents } from "../taskList/taskListComponents"
import { MenuComponent } from "../menuComponent/menuComponent"
import { TasksService } from"../../services/tasks.service";
import { LabelsService } from"../../services/labels.service";

import "./mainComponent.scss"
const mainTemplate = require('./mainComponent.hbs');

export class MainComponents {
    tasksService:TasksService = TasksService.Instance;
    labelService:LabelsService  = LabelsService.Instance;

    constructor(){
      this.setHtml();

      this.tasksService.laodData(()=>{
        this.labelService.laodData(()=>{
          $(".loader").addClass("hide");
          this.createComponents();
        });  
      });
    }

    createComponents(){
      new HeaderComponents();
      new MenuComponent();
      new TaskListComponents();
    }

    setHtml(){
      $(".main").html(mainTemplate({}))
    }
}