import $ from 'jquery';
import { HeaderComponents } from "../../header/headerComponent/headerComponent"
import { TaskListComponents } from "../../taskList/taskListComponents"
import { MenuComponent } from "../../menu/menuComponent/menuComponent"
import { TasksService } from"../../../services/tasks.service";
import { PriorityService } from"../../../services/priority.service";
import { LabelsService } from"../../../services/labels.service";

const mainTemplate = require('../mainComponent/mainComponent.hbs');

export class MainComponents {
    tasksService:TasksService;
    labelService:LabelsService;

    constructor(){
      this.setHtml();

      this.tasksService = TasksService.Instance;
      this.labelService = LabelsService.Instance;

      this.tasksService.laodData(()=>{
        this.labelService.laodData(()=>{
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